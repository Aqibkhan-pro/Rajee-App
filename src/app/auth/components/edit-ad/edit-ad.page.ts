import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Ad } from '../../../shared/models/marketplace.models';
import { AdService } from '../../../services/ad.service';
import { CategoryService } from '../../../services/category.service';
import { StorageService } from '../../../services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-ad',
  templateUrl: './edit-ad.page.html',
  styleUrls: ['./edit-ad.page.scss'],
})
export class EditAdPage implements OnInit, OnDestroy {
  editForm!: FormGroup;
  ad!: Ad;
  adId = '';
  categories: any[] = [];
  isLoading = false;
  isSubmitting = false;

  selectedImages: string[] = [];
  removedImageUrls: string[] = [];

  cities = [
    'Riyadh',
    'Jeddah',
    'Dammam',
    'Mecca',
    'Medina',
    'Taif',
    'Abha',
    'Tabuk',
    'Yanbu',
    'Khobar'
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adService: AdService,
    private categoryService: CategoryService,
    private storageService: StorageService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCategories();
    this.loadAd();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize form
   */
  initializeForm() {
    this.editForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1), Validators.max(9999999)]],
      city: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^05[0-9]{8}$/)]],
      allowContact: [true],
      specifications: this.formBuilder.group({
        brand: [''],
        model: [''],
        condition: ['new'],
        color: [''],
        material: ['']
      })
    });
  }

  /**
   * Load categories
   */
  loadCategories() {
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  /**
   * Load existing ad
   */
  async loadAd() {
    try {
      this.isLoading = true;

      // Get ad ID from route params
      this.adId = this.route.snapshot.paramMap.get('id') || '';
      if (!this.adId) {
        throw new Error('Ad ID not found');
      }

      // Load ad details using firstValueFrom
      const ad = await firstValueFrom(this.adService.getAdById(this.adId));
      if (!ad) {
        throw new Error('Ad not found');
      }

      this.ad = ad;

      // Check if user owns this ad
      const userId = this.storageService.getItem('userData')?.uid;
      if (this.ad.uid !== userId) {
        this.showToast('You do not have permission to edit this ad', 'danger');
        this.router.navigate(['/auth/my-ads']);
        return;
      }

      // Populate form with ad data
      this.editForm.patchValue({
        title: this.ad.title,
        description: this.ad.description,
        categoryId: this.ad.categoryId,
        price: this.ad.price,
        city: this.ad.city,
        phoneNumber: this.ad.sellerPhone,
        allowContact: true,
        specifications: this.ad.specifications || {
          brand: '',
          model: '',
          condition: 'new',
          color: '',
          material: ''
        }
      });

      // Load existing images
      if (this.ad.images && this.ad.images.length > 0) {
        this.selectedImages = [...this.ad.images];
      }

      this.isLoading = false;
    } catch (error) {
      console.error('❌ Error loading ad:', error);
      this.showToast('Error loading ad', 'danger');
      this.isLoading = false;
      this.router.navigate(['/auth/my-ads']);
    }
  }

  /**
   * Add image from camera or gallery
   */
  async addImage() {
    if (this.selectedImages.length >= 10) {
      this.showToast('Maximum 10 images allowed', 'warning');
      return;
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Add Image',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => this.captureFromCamera()
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => this.captureFromGallery()
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  /**
   * Capture image from camera
   */
  private async captureFromCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800,
        height: 800
      });

      if (image.dataUrl) {
        this.selectedImages.push(image.dataUrl);
      }
    } catch (error) {
      console.error('❌ Error capturing photo:', error);
      this.showToast('Error capturing photo', 'danger');
    }
  }

  /**
   * Choose image from gallery
   */
  private async captureFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 800,
        height: 800
      });

      if (image.dataUrl) {
        this.selectedImages.push(image.dataUrl);
      }
    } catch (error) {
      console.error('❌ Error picking photo:', error);
      this.showToast('Error picking photo', 'danger');
    }
  }

  /**
   * Remove image
   */
  removeImage(index: number) {
    const removedImage = this.selectedImages[index];

    // If it's an existing image, add to removed list
    if (removedImage.startsWith('http')) {
      this.removedImageUrls.push(removedImage);
    }

    this.selectedImages.splice(index, 1);
  }

  /**
   * Submit form to update ad
   */
  async onSubmit() {
    if (!this.editForm.valid) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (this.selectedImages.length === 0) {
      this.showToast('Please add at least one image', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Updating ad...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.isSubmitting = true;

      // Upload new images
      const uploadedImages = [];
      for (const image of this.selectedImages) {
        if (image.startsWith('data:')) {
          // Note: For demo, we'll just add the base64 directly
          // In production, convert base64 to File objects using uploadAdImages
          uploadedImages.push(image);
        } else {
          // Existing image, keep it
          uploadedImages.push(image);
        }
      }

      // Prepare update data
      const updateData: Partial<Ad> = {
        ...this.editForm.getRawValue(),
        images: uploadedImages,
        thumbnail: uploadedImages[0],
        updatedAt: new Date()
      };

      // Update ad
      await this.adService.updateAd(this.adId, updateData);

      // Remove deleted images from storage
      for (const imageUrl of this.removedImageUrls) {
        try {
          // In production, you'd delete from Firebase Storage
          // await this.storageService.deleteImage(imageUrl);
        } catch (error) {
          console.error('❌ Error deleting image:', error);
        }
      }

      await loading.dismiss();
      this.showToast('Ad updated successfully', 'success');
      this.router.navigate(['/auth/my-ads']);
    } catch (error) {
      console.error('❌ Error updating ad:', error);
      await loading.dismiss();
      this.showToast('Error updating ad', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Cancel editing
   */
  async cancelEdit() {
    const alert = await this.alertController.create({
      header: 'Discard Changes?',
      message: 'Are you sure you want to discard your changes?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/auth/my-ads']);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Delete ad
   */
  async deleteAd() {
    const alert = await this.alertController.create({
      header: 'Delete Ad',
      message: `Are you sure you want to delete "${this.ad.title}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deleting ad...'
            });
            await loading.present();

            try {
              await this.adService.deleteAd(this.adId);
              await loading.dismiss();
              this.showToast('Ad deleted successfully', 'success');
              this.router.navigate(['/auth/my-ads']);
            } catch (error) {
              console.error('❌ Error deleting ad:', error);
              await loading.dismiss();
              this.showToast('Error deleting ad', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Get form control error message
   */
  getErrorMessage(fieldName: string): string {
    const control = this.editForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} is too short`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName} is too long`;
    }
    if (control?.hasError('min')) {
      return `${fieldName} must be greater than 0`;
    }
    if (control?.hasError('pattern')) {
      return `Invalid ${fieldName} format`;
    }
    return '';
  }

  /**
   * Show toast message
   */
  private showToast(message: string, color: string = 'primary') {
    this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'bottom'
    }).then(toast => toast.present());
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  /**
   * Get category name
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name.en : '';
  }
}
