import { Component, OnInit } from '@angular/core';
import {
  NavController,
  ModalController,
  RangeCustomEvent,
  ToggleCustomEvent,
  LoadingController,
  ToastController,
  ActionSheetController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Province, District } from 'src/app/shared/saudi-provinces';
import { LocationPickerModalComponent } from './location-picker-modal/location-picker-modal.component';

import { stepAnim } from 'src/app/shared/utils/anim';

import { CategoryPickerModalComponent } from './category-picker-modal/category-picker-modal.component';
import { CatItem } from 'src/app/shared/category-data';

// ✅ Firebase
import { storage } from 'src/environments/firebase-config';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

type ProductDraft = {
  subject: string;

  // Step 2 (Cars only)
  dealType: 'sell' | 'waiver';
  condition: 'new' | 'used' | 'damaged';
  gearType: 'manual' | 'automatic';
  fuelType: 'gasoline' | 'diesel' | 'hybrid';
  mileage: number;
  is4wd: 'yes' | 'no';
  carClass: string[];

  // Step 3
  extraInfo: string;
  price: number | null;
  phone: string;
};

type PickedImage = {
  blob: Blob;       // ✅ compressed image
  dataUrl: string;  // ✅ preview
  name: string;     // file name
  mimeType: string; // image/jpeg
};

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.page.html',
  styleUrls: ['./add-new-product.page.scss'],
  standalone: false,
  animations: [stepAnim],
})
export class AddNewProductPage implements OnInit {
  step = 0;
  selectedLanguage: 'en' | 'ar' = 'en';

  model: ProductDraft = {
    subject: '',

    dealType: 'sell',
    condition: 'new',
    gearType: 'manual',
    fuelType: 'gasoline',
    mileage: 0,
    is4wd: 'no',
    carClass: [],

    extraInfo: '',
    price: null,
    phone: '',
  };

  // ✅ location keys
  selectedProvinceKey: string | null = 'riyadh';
  selectedDistrictKey: string | null = 'riyadh_city';

  // ✅ location objects (for storing values)
  selectedProvinceObj: Province | null = null;
  selectedDistrictObj: District | null = null;

  locationDisplayText = 'Change Location - Riyadh (Saudi Arabia)';

  // ✅ images (100)
  pickedImages: PickedImage[] = [];
  MAX_IMAGES = 10;

  // ✅ category keys
  selectedSectionKey: string | null = null;
  selectedBrandKey: string | null = null;
  selectedModelKey: string | null = null;
  selectedYear: number | null = null;

  // ✅ category objects (for storing values)
  selectedSectionObj: CatItem | null = null;
  selectedBrandObj: CatItem | null = null;
  selectedModelObj: CatItem | null = null;

  carDisplayText = 'Select';
carClassOptions: string[] = ['riyal', 'ls', 'ltz', 'ss', 'bermimam'];

  // ✅ Realtime DB base
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  disablePrice = false;
  disablePhone = false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('lang');
    this.selectedLanguage = savedLang === 'ar' ? 'ar' : 'en';

    this.carDisplayText = this.translate.instant('select_section');
    this.refreshLocationDisplay();
  }

  // ✅ Cars only condition for Step-2
  isCarsSelected(): boolean {
    // If your cars key is different, update it here
    return this.selectedSectionKey === 'cars_section';
  }

  // =========================
  // STEP NAV
  // =========================
  nextStep() {
    // Step 0 -> (Cars ? Step1 : Step2)
    if (this.step === 0) {
      if (!this.validateStep1()) return;
      this.step = this.isCarsSelected() ? 1 : 2;
      return;
    }

    // Step 1 (Cars only) -> Step 2
    if (this.step === 1) {
      this.step = 2;
      return;
    }
  }

  prevStep() {
    if (this.step === 2 && !this.isCarsSelected()) {
      // ✅ devices/auction skip step 1
      this.step = 0;
      return;
    }

    if (this.step > 0) {
      this.step--;
      return;
    }

    this.navCtrl.back();
  }

  private validateStep1(): boolean {
    const subjectOk = (this.model.subject ?? '').trim().length > 0;
    const locOk = !!this.selectedProvinceKey && !!this.selectedDistrictKey;
    const catOk = !!this.selectedSectionKey; // you can make this stricter if needed
    const imagesOk = this.pickedImages.length > 0;

    if (!imagesOk) {
      this.toast(this.translate.instant('select_at_least_image'), 'danger');
      return false;
    }
    if (!locOk) {
      this.toast(this.translate.instant('select_location_msg'), 'danger');
      return false;
    }
    if (!subjectOk) {
      this.toast(this.translate.instant('enter_description'), 'danger');
      return false;
    }
    if (!catOk) {
      this.toast(this.translate.instant('select_category_msg'), 'danger');
      return false;
    }
    return true;
  }

  // =========================
  // SAVE TO FIREBASE
  // =========================
  async save() {
    if (this.step !== 2) return;

    // ✅ Step-1 validation again (safe)
    if (!this.validateStep1()) return;

    const loading = await this.loadingCtrl.create({ message: this.translate.instant('uploading') });
    await loading.present();

    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const idToken = userData?.idToken;
      if (!idToken) throw new Error('User not authenticated');

      const productId = Date.now().toString();

      // ✅ upload compressed images -> urls
      const imageUrls = await this.uploadImages(productId);

      const payload: any = {
        subject: (this.model.subject ?? '').trim(),

        extraInfo: (this.model.extraInfo ?? '').trim(),

        // toggles
        price: this.disablePrice ? null : (this.model.price === null ? 0 : Number(this.model.price)),
        phone: this.disablePhone ? '' : (this.model.phone ?? '').trim(),

        // ✅ location: store key + values
        location: {
          provinceKey: this.selectedProvinceKey,
          districtKey: this.selectedDistrictKey,
          provinceName: this.selectedProvinceObj ? { en: this.selectedProvinceObj.en, ar: this.selectedProvinceObj.ar } : { en: '', ar: '' },
          districtName: this.selectedDistrictObj ? { en: this.selectedDistrictObj.en, ar: this.selectedDistrictObj.ar } : { en: '', ar: '' },
          displayText: {
            en: this.buildLocationText('en'),
            ar: this.buildLocationText('ar'),
          },
        },

        // ✅ selection: store key + values
        selection: {
          section: this.selectedSectionKey
            ? { key: this.selectedSectionKey, en: this.selectedSectionObj?.en ?? '', ar: this.selectedSectionObj?.ar ?? '' }
            : null,
          brand: this.selectedBrandKey
            ? { key: this.selectedBrandKey, en: this.selectedBrandObj?.en ?? '', ar: this.selectedBrandObj?.ar ?? '' }
            : null,
          model: this.selectedModelKey
            ? { key: this.selectedModelKey, en: this.selectedModelObj?.en ?? '', ar: this.selectedModelObj?.ar ?? '' }
            : null,
          year: this.selectedYear ?? null,
          displayText: {
            en: this.buildCategoryText('en'),
            ar: this.buildCategoryText('ar'),
          },
        },

        // ✅ images urls only
        images: imageUrls,

        createdAt: Date.now(),
      };

      // ✅ Only cars: include Step-2 data
      if (this.isCarsSelected()) {
        payload.carDetails = {
          dealType: this.model.dealType,
          condition: this.model.condition,
          gearType: this.model.gearType,
          fuelType: this.model.fuelType,
          mileage: Number(this.model.mileage || 0),
          is4wd: this.model.is4wd,
          carClass: this.model.carClass,
        };
      }

      if(userData){
        payload.user = {
          uid: userData.uid,
          email: userData.email,
          name:  userData?.name ||  userData.displayName || '',
          photoURL: userData.photoURL,
        }
      }

      await this.saveToRealtimeDb(payload, productId, idToken);

      this.toast(this.translate.instant('saved_successfully'), 'success');

      // reset
      this.resetAll();
      this.navCtrl.back();

    } catch (e: any) {
      console.error(e);
      this.toast(e?.message || this.translate.instant('save_failed'), 'danger');
    } finally {
      loading.dismiss();
    }
  }

  private async uploadImages(productId: string): Promise<string[]> {
    const urls: string[] = [];

    // ✅ sequential to avoid memory crash with 100 files
    for (let i = 0; i < this.pickedImages.length; i++) {
      const img = this.pickedImages[i];

      const path = `products/${productId}/${Date.now()}_${i}.jpg`;
      const refObj = storageRef(storage, path);

      await uploadBytes(refObj, img.blob, { contentType: 'image/jpeg' });
      const url = await getDownloadURL(refObj);
      urls.push(url);
    }

    return urls;
  }

  private async saveToRealtimeDb(data: any, productId: string, idToken: string) {
    const url = `${this.FIREBASE_DB_URL}/products/${productId}.json?auth=${idToken}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`DB save failed: ${t}`);
    }
  }

  private resetAll() {
    this.step = 0;

    this.model = {
      subject: '',
      dealType: 'sell',
      condition: 'new',
      gearType: 'manual',
      fuelType: 'gasoline',
      mileage: 0,
      is4wd: 'no',
      carClass: [],
      extraInfo: '',
      price: null,
      phone: '',
    };

    this.disablePrice = false;
    this.disablePhone = false;

    this.pickedImages = [];

    this.selectedSectionKey = null;
    this.selectedBrandKey = null;
    this.selectedModelKey = null;
    this.selectedYear = null;

    this.selectedSectionObj = null;
    this.selectedBrandObj = null;
    this.selectedModelObj = null;

    this.carDisplayText = this.translate.instant('select_section');
  }

  // =========================
  // IMAGES (pick 100 + compress)
  // =========================
  async showPhotoPicker() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: this.translate.instant('add_image'),
      buttons: [
        {
          text: this.translate.instant('photo_library'),
          icon: 'image',
          handler: () => this.openPhotoLibrary()
        },
        {
          text: this.translate.instant('take_photo'),
          icon: 'camera',
          handler: () => this.takePhoto()
        },
        {
          text: this.translate.instant('cancel'),
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  private async openPhotoLibrary() {
    try {
      const result = await Camera.pickImages({
        quality: 80,
        limit: this.MAX_IMAGES - this.pickedImages.length,
      });

      if (result?.photos && result.photos.length > 0) {
        for (const photo of result.photos) {
          const blob = await this.photoURLToBlob(photo.webPath!);
          const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
          const compressed = await this.compressToJpeg(file, 1280, 0.40);
          this.pickedImages.push(compressed);
        }
      }
    } catch (err: any) {
      console.error('Photo library error:', err);
    }
  }

  private async takePhoto() {
    try {
      const result = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (result?.webPath) {
        const blob = await this.photoURLToBlob(result.webPath);
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const compressed = await this.compressToJpeg(file, 1280, 0.40);
        this.pickedImages.push(compressed);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
    }
  }

  private async photoURLToBlob(photoURL: string): Promise<Blob> {
    const response = await fetch(photoURL);
    return response.blob();
  }

  pickMultipleImages(input: HTMLInputElement) {
    // This function is no longer used - functionality moved to showPhotoPicker()
    this.showPhotoPicker();
  }

  async onFilesPicked(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (!files.length) return;

    const remaining = this.MAX_IMAGES - this.pickedImages.length;
    const slice = files.slice(0, Math.max(0, remaining));

    // ✅ compress sequential
    for (const file of slice) {
      const compressed = await this.compressToJpeg(file, 1280, 0.40);
      this.pickedImages.push(compressed);
    }
  }

  removePickedImage(i: number) {
    this.pickedImages.splice(i, 1);
  }

  // ✅ compress + resize
  private async compressToJpeg(file: File, maxSide = 1280, quality = 0.72): Promise<PickedImage> {
    const img = await this.loadImage(URL.createObjectURL(file));

    const { width, height } = img;
    const scale = Math.min(1, maxSide / Math.max(width, height));

    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Compression failed'))),
        'image/jpeg',
        quality
      );
    });

    // preview dataUrl (small)
    const dataUrl = await this.blobToDataUrl(blob);

    return {
      blob,
      dataUrl,
      name: file.name || `image_${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
    };
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  // =========================
  // ✅ Location modal
  // =========================
  async openLocationModal() {
    const modal = await this.modalCtrl.create({
      component: LocationPickerModalComponent,
      cssClass: 'location-picker-modal',
      breakpoints: [0, 0.85],
      initialBreakpoint: 0.85,
      mode: 'ios',
      backdropDismiss: false,
      componentProps: {
        lang: this.selectedLanguage,
        provinceKey: this.selectedProvinceKey,
        districtKey: this.selectedDistrictKey,
      },
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      this.selectedProvinceKey = data.provinceKey ?? null;
      this.selectedDistrictKey = data.districtKey ?? null;

      // ✅ store full objects for saving values
      this.selectedProvinceObj = (data.province ?? null) as Province | null;
      this.selectedDistrictObj = (data.district ?? null) as District | null;

      this.refreshLocationDisplay(this.selectedProvinceObj ?? undefined, this.selectedDistrictObj ?? undefined);
    }
  }

  private refreshLocationDisplay(province?: Province, district?: District) {
    if (province && district) {
      const p = this.selectedLanguage === 'ar' ? province.ar : province.en;
      const d = this.selectedLanguage === 'ar' ? district.ar : district.en;
      this.locationDisplayText = `${d} - ${p} (Saudi Arabia)`;
      return;
    }

    if (!this.selectedProvinceKey || !this.selectedDistrictKey) {
      this.locationDisplayText = this.translate.instant('select_location_msg');
      return;
    }

    this.locationDisplayText = this.selectedLanguage === 'ar' ? 'تغيير الموقع' : 'Change Location';
  }

  private buildLocationText(lang: 'en' | 'ar'): string {
    const p = this.selectedProvinceObj ? (lang === 'ar' ? this.selectedProvinceObj.ar : this.selectedProvinceObj.en) : '';
    const d = this.selectedDistrictObj ? (lang === 'ar' ? this.selectedDistrictObj.ar : this.selectedDistrictObj.en) : '';
    if (!p || !d) return '';
    return `${d} - ${p} (Saudi Arabia)`;
  }

  // =========================
  // ✅ Category modal
  // =========================
  async openCategoryModal() {
    this.openSectionModal();
  }

  async openSectionModal(reset?: boolean) {
    const modal = await this.modalCtrl.create({
      component: CategoryPickerModalComponent,
      cssClass: 'category-picker-modal',
      breakpoints: [0, 0.85],
      initialBreakpoint: 0.85,
      mode: 'ios',
      backdropDismiss: false,
      componentProps: {
        lang: this.selectedLanguage,
        sectionKey: reset ? null : this.selectedSectionKey,
        brandKey: reset ? null : this.selectedBrandKey,
        modelKey: reset ? null : this.selectedModelKey,
        year: reset ? null : this.selectedYear,
      },
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      this.selectedSectionKey = data.sectionKey ?? null;
      this.selectedBrandKey = data.brandKey ?? null;
      this.selectedModelKey = data.modelKey ?? null;
      this.selectedYear = data.year ?? null;

      // ✅ keep objects too
      this.selectedSectionObj = (data.section ?? null) as CatItem | null;
      this.selectedBrandObj = (data.brand ?? null) as CatItem | null;
      this.selectedModelObj = (data.model ?? null) as CatItem | null;

      // ✅ display text
      this.carDisplayText =
        this.selectedLanguage === 'ar'
          ? this.buildCategoryText('ar') || this.translate.instant('select_category')
          : this.buildCategoryText('en') || this.translate.instant('select_category');

      // ✅ if user is on step 1 (car-details) and switched to device/auction -> jump to step 2
      if (this.step === 1 && !this.isCarsSelected()) {
        this.step = 2;
      }
    }
  }

  onEditCategory() {
    this.openSectionModal(true);
  }

  private buildCategoryText(lang: 'en' | 'ar'): string {
    const pick = (x: CatItem | null) => (x ? (lang === 'ar' ? x.ar : x.en) : '');
    const parts: string[] = [];

    const sec = pick(this.selectedSectionObj);
    const br = pick(this.selectedBrandObj);
    const mo = pick(this.selectedModelObj);

    if (sec) parts.push(sec);
    if (br) parts.push(br);
    if (mo) parts.push(mo);
    if (this.selectedYear) parts.push(String(this.selectedYear));

    return parts.join(' > ');
  }

  // =========================
  // STEP 2 helpers (Cars only)
  // =========================
  onMileageChange(event: RangeCustomEvent) {
    const v = event.detail.value;
    this.model.mileage = typeof v === 'number' ? v : Number(v || 0);
  }

  toggleCarClass(value: string) {
    const idx = this.model.carClass.indexOf(value);
    if (idx >= 0) this.model.carClass.splice(idx, 1);
    else this.model.carClass.push(value);
  }

  isCarClassSelected(value: string) {
    return this.model.carClass.includes(value);
  }

  onPriceToggle(ev: ToggleCustomEvent) {
    this.disablePrice = !!ev.detail.checked;
    if (this.disablePrice) this.model.price = null;
  }

  onPhoneToggle(ev: ToggleCustomEvent) {
    this.disablePhone = !!ev.detail.checked;
    if (this.disablePhone) this.model.phone = '';
  }

  private async toast(message: string, color: string = 'danger') {
    const t = await this.toastCtrl.create({ message, duration: 2000, position: 'bottom', color });
    t.present();
  }
}
