import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Camera } from '@capacitor/camera';

import { storage } from 'src/environments/firebase-config';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { UserService } from 'src/app/services/user.service';
import { MapComponentComponent } from './map-component/map-component.component';
import { District, Province, SAUDI_PROVINCES } from 'src/app/shared/saudi-provinces';
import { HarajCategorySheetComponent } from './haraj-category-sheet/haraj-category-sheet.component';


interface PickedImage {
  dataUrl: string;
  mimeType: string;
  fileName?: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  providers: [Geolocation],
  standalone: false,
})
export class AddProductPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content?: IonContent;

  currentStep = 1;
  readonly TOTAL_STEPS = 3;

  form: FormGroup;
  selectedLanguage: string = 'en';

  pickedImages: PickedImage[] = [];
  readonly MAX_IMAGES = 10;

  productLocation: { lat: number; lng: number } | any = null;

  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  category: any[] = [];
  subCategoryOptions: Array<{ key: string; ar: string; en: string }> = [];

  provinces: Province[] = SAUDI_PROVINCES;
  districtOptions: District[] = [];

  conditions: string[] = [];

  // ✅ Display names for selected category/subcategory
  selectedCategoryDisplay = '';
  selectedSubCategoryDisplay = '';

  subCategoriesMap: Record<string, Array<{ key: string; ar: string; en: string }>> = {
    cars: [
      { key: 'parts', ar: 'قطع غيار وملحقات', en: 'Parts & Accessories' },
      { key: 'trucks', ar: 'شاحنات ومعدات ثقيلة', en: 'Trucks & Heavy Equipment' },
      { key: 'motorbikes', ar: 'دبابات', en: 'Motorbikes' },
      { key: 'classic', ar: 'سيارات تراثية', en: 'Classic/Heritage Cars' },
      { key: 'damaged', ar: 'سيارات مصدومه', en: 'Damaged Cars' },
      { key: 'transfer', ar: 'سيارات للتنازل', en: 'Transfer Cars' },
    ],
    electronics: [
      { key: 'mobiles', ar: 'جوالات', en: 'Mobiles' },
      { key: 'tablets', ar: 'تابلت', en: 'Tablets' },
      { key: 'computers', ar: 'كمبيوتر', en: 'Computers' },
      { key: 'egames', ar: 'العاب إلكترونية', en: 'Electronic Games' },
      { key: 'tv_audio', ar: 'تلفزيونات وصوتيات', en: 'TV & Audio' },
      { key: 'cameras', ar: 'كاميرات', en: 'Cameras' },
      { key: 'accounts', ar: 'حسابات واشتراكات', en: 'Accounts & Subscriptions' },
      { key: 'numbers', ar: 'أرقام مميزة', en: 'Special Numbers' },
      { key: 'appliances', ar: 'أجهزة منزلية ومطبخ', en: 'Home & Kitchen Appliances' },
      { key: 'generators', ar: 'مولدات ومحركات', en: 'Generators & Motors' },
      { key: 'networking', ar: 'شبكات وراوترات', en: 'Networking & Routers' },
      { key: 'printers', ar: 'طابعات وملحقاتها', en: 'Printers & Accessories' },
    ],
    furniture: [
      { key: 'majlis', ar: 'مجالس ومفروشات', en: 'Majlis & Upholstery' },
      { key: 'tables', ar: 'طاولات وكراسي', en: 'Tables & Chairs' },
      { key: 'beds', ar: 'أسرة ومراتب', en: 'Beds & Mattresses' },
      { key: 'wardrobes', ar: 'خزائن ودواليب', en: 'Wardrobes & Cabinets' },
      { key: 'office', ar: 'أثاث مكتبي', en: 'Office Furniture' },
      { key: 'outdoor', ar: 'أثاث خارجي', en: 'Outdoor Furniture' },
      { key: 'home_tools', ar: 'أدوات منزلية', en: 'Home Tools & Items' },
      { key: 'decor', ar: 'تحف وديكور', en: 'Decor & Antiques' },
      { key: 'kitchen', ar: 'مطابخ', en: 'Kitchens' },
      { key: 'carpets', ar: 'سجاد وستائر', en: 'Carpets & Curtains' },
    ],
    personal_items: [
      { key: 'watches', ar: 'ساعات', en: 'Watches' },
      { key: 'perfumes', ar: 'عطور', en: 'Perfumes' },
      { key: 'sports', ar: 'مستلزمات رياضية', en: 'Sports Items' },
      { key: 'glasses', ar: 'نظارات', en: 'Glasses' },
      { key: 'men', ar: 'ملابس رجالية', en: 'Men Clothing' },
      { key: 'women', ar: 'ملابس نسائية', en: 'Women Clothing' },
      { key: 'kids', ar: 'ملابس واحتياجات اطفال', en: 'Kids Items' },
      { key: 'gifts', ar: 'هدايا', en: 'Gifts' },
      { key: 'bags', ar: 'شنط سفر', en: 'Travel Bags' },
      { key: 'beauty', ar: 'صحة وجمال', en: 'Health & Beauty' },
      { key: 'jewelry', ar: 'ذهب ومجوهرات', en: 'Gold & Jewelry' },
    ],
    services: [
      { key: 'construction', ar: 'بناء ومقاولات', en: 'Construction & Contracting' },
      { key: 'ac', ar: 'تكييف وتبريد', en: 'AC & Cooling' },
      { key: 'car_services', ar: 'خدمات سيارات', en: 'Car Services' },
      { key: 'moving', ar: 'نقل عفش', en: 'Moving Furniture' },
      { key: 'water_pumps', ar: 'مضخات ومياه', en: 'Water & Pumps' },
      { key: 'shipping', ar: 'شحن وتوصيل', en: 'Delivery & Shipping' },
      { key: 'cleaning', ar: 'نظافة', en: 'Cleaning' },
      { key: 'rentals', ar: 'تاجير', en: 'Rentals' },
      { key: 'other_services', ar: 'خدمات أخرى', en: 'Other Services' },
    ],
    jobs: [
      { key: 'admin', ar: 'إدارية وسكرتارية', en: 'Admin & Secretary' },
      { key: 'sales', ar: 'تسويق ومبيعات', en: 'Sales & Marketing' },
      { key: 'media', ar: 'إعلام', en: 'Media' },
      { key: 'tech', ar: 'تقنية واتصالات', en: 'Tech & Telecom' },
      { key: 'accounting', ar: 'محاسبة ومالية', en: 'Accounting & Finance' },
      { key: 'engineering', ar: 'هندسة', en: 'Engineering' },
      { key: 'customer_service', ar: 'خدمة عملاء', en: 'Customer Service' },
      { key: 'security', ar: 'حراسة وأمن', en: 'Security & Guard' },
      { key: 'teaching', ar: 'تعليم وتدريس', en: 'Education & Teaching' },
      { key: 'hospitality', ar: 'سياحة وفندقة', en: 'Tourism & Hospitality' },
      { key: 'drivers', ar: 'سائقين وتوصيل', en: 'Drivers & Delivery' },
      { key: 'design', ar: 'تصميم', en: 'Design' },
      { key: 'industry', ar: 'صناعة وحرف', en: 'Industry & Crafts' },
      { key: 'medical', ar: 'طب وتمريض', en: 'Medical & Nursing' },
      { key: 'hr_training', ar: 'تدريب وموارد بشرية', en: 'Training & HR' },
      { key: 'trades', ar: 'مهن وحرف', en: 'Trades' },
      { key: 'remote', ar: 'عمل من المنزل', en: 'Work From Home' },
    ],
    games: [
      { key: 'console_games', ar: 'ألعاب بلايستيشن/إكس بوكس', en: 'Console Games' },
      { key: 'consoles', ar: 'أجهزة ألعاب', en: 'Gaming Consoles' },
      { key: 'controllers', ar: 'يد تحكم وملحقات', en: 'Controllers & Accessories' },
      { key: 'toys', ar: 'ألعاب أطفال', en: 'Kids Toys' },
      { key: 'tickets', ar: 'تذاكر', en: 'Tickets' },
      { key: 'other_ent', ar: 'ترفيه أخرى', en: 'Other Entertainment' },
    ],
    others: [{ key: 'misc', ar: 'متنوع', en: 'Miscellaneous' }],
  };

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private userService: UserService,
    private geolocation: Geolocation,
    private modalCtrl: ModalController
  ) {
    this.category = [
      { key: 'cars', ar: 'رجيع السيارات', en: 'Cars & Vehicles' },
      { key: 'electronics', ar: 'رجيع الأجهزة', en: 'Electronics & Devices' },
      { key: 'furniture', ar: 'رجيع الأثاث', en: 'Furniture' },
      { key: 'personal_items', ar: 'مستلزمات شخصية', en: 'Personal Items & Accessories' },
      { key: 'services', ar: 'خدمات', en: 'Services' },
      { key: 'jobs', ar: 'وظائف', en: 'Jobs' },
      { key: 'games', ar: 'ألعاب وترفيه', en: 'Games & Entertainment' },
      { key: 'others', ar: 'قسم غير مصنف', en: 'Uncategorized / Other' },
    ];

    this.refreshConditions();

    const defaultSectionKey = this.category?.[0]?.key || '';
    const defaultCondition = this.conditions?.[0] || '';
    const defaultProvinceKey = this.provinces?.[0]?.key || '';
    const defaultDistrictKey = this.provinces?.[0]?.districts?.[0]?.key || '';

    const phoneRegex = /^\+?[0-9]{7,15}$/;

    this.form = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],

      section: [defaultSectionKey, Validators.required],
      subCategory: ['', Validators.required],

      condition: [defaultCondition, Validators.required],
      description: ['', Validators.required],

      province: [defaultProvinceKey, Validators.required],
      district: [defaultDistrictKey, Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern(phoneRegex)]],

      address: [''],
      images: [[]],
    });
  }

  async ngOnInit() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) this.selectedLanguage = savedLang;

    this.refreshConditions();
    this.setDefaultConditionIfEmpty();

    this.form.get('section')?.valueChanges.subscribe((sectionKey: string) => {
      this.applySubCategories(sectionKey, true);
    });

    const defaultSection = this.form.get('section')?.value;
    this.applySubCategories(defaultSection, true);

    this.form.get('province')?.valueChanges.subscribe((provinceKey: string) => {
      this.applyDistricts(provinceKey, true);
    });

    const defaultProvince = this.form.get('province')?.value;
    this.applyDistricts(defaultProvince, true);
  }

  // ✅ NEW: Open category selector bottom sheet
  async openCategorySelector() {
    const modal = await this.modalCtrl.create({
      component: HarajCategorySheetComponent,
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75,
      cssClass: 'category-selector-modal',
    });

    modal.onDidDismiss().then((result) => {
      if (result?.data?.category && result?.data?.subCategory) {
        // Update form values
        this.form.patchValue({
          section: result.data.category,
          subCategory: result.data.subCategory,
        });

        // Update display names
        this.updateCategoryDisplayNames(result.data.category, result.data.subCategory);
      }
    });

    await modal.present();
  }

  // ✅ Helper to update display names
  private updateCategoryDisplayNames(categoryKey: string, subCategoryKey: string) {
    const cat = this.category.find((c) => c.key === categoryKey);
    const subCats = this.subCategoriesMap[categoryKey] || [];
    const subCat = subCats.find((sc) => sc.key === subCategoryKey);

    if (cat) {
      this.selectedCategoryDisplay = this.selectedLanguage === 'en' ? cat.en : cat.ar;
    }

    if (subCat) {
      this.selectedSubCategoryDisplay = this.selectedLanguage === 'en' ? subCat.en : subCat.ar;
    }
  }

  private getStepControls(step: number): string[] {
    if (step === 1) return ['title', 'section', 'subCategory'];
    if (step === 2) return ['province', 'district', 'condition', 'description'];
    return ['contactPhone', 'price'];
  }

  private markStepTouched(step: number) {
    const names = this.getStepControls(step);
    for (const n of names) {
      this.form.get(n)?.markAsTouched();
      this.form.get(n)?.updateValueAndValidity();
    }
  }

  private isStepValid(step: number): boolean {
    if (step === 1) {
      const baseValid = this.getStepControls(1).every((n) => this.form.get(n)?.valid);
      return baseValid && this.pickedImages.length > 0;
    }

    return this.getStepControls(step).every((n) => this.form.get(n)?.valid);
  }

  async nextStep() {
    if (!this.isStepValid(this.currentStep)) {
      this.markStepTouched(this.currentStep);

      if (this.currentStep === 1 && !this.pickedImages.length) {
        this.showToast(this.translate.instant('please_pick_product_image'), 'danger');
      } else {
        this.showToast(this.translate.instant('please_fill_required_fields'), 'danger');
      }
      return;
    }

    if (this.currentStep < this.TOTAL_STEPS) {
      this.currentStep++;
      await this.content?.scrollToTop(250);
    }
  }

  async prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      await this.content?.scrollToTop(250);
    }
  }

  refreshConditions() {
    this.conditions = [
      this.translate.instant('new'),
      this.translate.instant('used'),
      this.translate.instant('good'),
    ];
  }

  private setDefaultConditionIfEmpty() {
    const condCtrl = this.form.get('condition');
    if (!condCtrl?.value) condCtrl?.setValue(this.conditions?.[0] || '');
  }

  private applySubCategories(sectionKey: string, autoSelectFirst: boolean) {
    this.subCategoryOptions = this.subCategoriesMap[sectionKey] || [];
    const sc = this.form.get('subCategory');

    if (this.subCategoryOptions.length) {
      sc?.setValidators([Validators.required]);
      if (autoSelectFirst) sc?.setValue(this.subCategoryOptions[0].key);
      else if (!sc?.value) sc?.setValue(this.subCategoryOptions[0].key);
    } else {
      sc?.setValue('');
      sc?.clearValidators();
    }

    sc?.updateValueAndValidity();
  }

  private applyDistricts(provinceKey: string, autoSelectFirst: boolean) {
    const province = this.provinces.find((p) => p.key === provinceKey);
    this.districtOptions = province?.districts || [];

    const dCtrl = this.form.get('district');

    if (this.districtOptions.length) {
      dCtrl?.setValidators([Validators.required]);
      if (autoSelectFirst) dCtrl?.setValue(this.districtOptions[0].key);
      else if (!dCtrl?.value) dCtrl?.setValue(this.districtOptions[0].key);
    } else {
      dCtrl?.setValue('');
      dCtrl?.clearValidators();
    }

    dCtrl?.updateValueAndValidity();
  }

  async pickMultipleImages() {
    try {
      const remainingSlots = this.MAX_IMAGES - this.pickedImages.length;
      if (remainingSlots <= 0) {
        this.showToast(`Maximum ${this.MAX_IMAGES} images allowed`, 'warning');
        return;
      }

      const result = await Camera.pickImages({
        quality: 20,
        limit: remainingSlots,
      });

      const photos = (result?.photos || []).slice(0, remainingSlots);
      if (!photos.length) return;

      const dataUrls = await Promise.all(
        photos.map((p) => this.webPathToDataUrl(p.webPath))
      );

      this.pickedImages = [
        ...this.pickedImages,
        ...dataUrls.map((du) => ({ dataUrl: du, mimeType: 'image/jpeg' })),
      ];
    } catch (err) {
      console.error('Image pick failed', err);
    }
  }

  private async webPathToDataUrl(webPath?: string): Promise<string> {
    if (!webPath) return '';
    const res = await fetch(webPath);
    const blob = await res.blob();
    return await this.blobToDataUrl(blob);
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  removePickedImage(index: number) {
    this.pickedImages = this.pickedImages.filter((_, i) => i !== index);
  }

  private getProvinceName(key: string) {
    const p = this.provinces.find((x) => x.key === key);
    return { en: p?.en || '', ar: p?.ar || '' };
  }

  private getDistrictName(provinceKey: string, districtKey: string) {
    const p = this.provinces.find((x) => x.key === provinceKey);
    const d = p?.districts?.find((x) => x.key === districtKey);
    return { en: d?.en || '', ar: d?.ar || '' };
  }

  async handleSubmit() {
    if (this.currentStep !== this.TOTAL_STEPS) {
      await this.nextStep();
      return;
    }

    if (this.form.invalid) {
      this.showToast(this.translate.instant('please_fill_required_fields'), 'danger');
      return;
    }

    if (!this.pickedImages.length) {
      this.showToast(this.translate.instant('please_pick_product_image'), 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('posting'),
    });
    await loading.present();

    try {
      const imageUrls: string[] = [];

      for (const img of this.pickedImages) {
        const fileName = `products/${Date.now()}_${Math.random().toString(16).slice(2)}.jpeg`;
        const imgRef = storageRef(storage, fileName);

        await uploadString(imgRef, img.dataUrl, 'data_url');
        const url = await getDownloadURL(imgRef);
        imageUrls.push(url);
      }

      this.form.patchValue({ images: imageUrls });

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const idToken = userData?.idToken;
      if (!idToken) throw new Error('User not authenticated');

      const pUser: any = await this.userService.getUserById(userData.uid);

      const manualPhone = (this.form.value.contactPhone || '').trim();

      const provinceKey = this.form.value.province;
      const districtKey = this.form.value.district;

      const provinceName = this.getProvinceName(provinceKey);
      const districtName = this.getDistrictName(provinceKey, districtKey);

      const productData = {
        ...this.form.value,
        user: {
          uid: userData.uid,
          name: userData.name,
          email: userData.email,
          phone: manualPhone || pUser?.phone || '',
          photoURL: userData.photoURL,
        },
        provinceName,
        districtName,
        createdAt: Date.now(),
      };

      const productId = Date.now().toString();
      await this.saveProductToDatabase(productData, productId, idToken);

      this.showToast(this.translate.instant('product_posted_success'), 'success');

      this.form.reset();
      this.pickedImages = [];
      this.subCategoryOptions = [];
      this.districtOptions = [];

      this.currentStep = 1;

      const defaultSectionKey = this.category?.[0]?.key || '';
      const defaultProvinceKey = this.provinces?.[0]?.key || '';
      const defaultDistrictKey = this.provinces?.[0]?.districts?.[0]?.key || '';

      this.form.patchValue({
        section: defaultSectionKey,
        condition: this.conditions?.[0] || '',
        province: defaultProvinceKey,
        district: defaultDistrictKey,
      });

      this.applySubCategories(defaultSectionKey, true);
      this.applyDistricts(defaultProvinceKey, true);

      this.navCtrl.navigateRoot('/home');
    } catch (err: any) {
      console.error(err);
      this.showToast(err?.message || this.translate.instant('server_error'), 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async saveProductToDatabase(productData: any, productId: string, idToken: string): Promise<void> {
    const url = `${this.FIREBASE_DB_URL}/products/${productId}.json?auth=${idToken}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to save product: ${errorText}`);
    }
  }

  async getCurrentLocation() {
    try {
      const resp = await this.geolocation.getCurrentPosition();
      this.productLocation = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
      };

      await this.getAddressFromCoordinatesOSM(this.productLocation.lat, this.productLocation.lng);
    } catch (err) {
      console.error('Error getting location:', err);
    }
  }

  async openMapPicker() {
    const modal = await this.modalCtrl.create({
      component: MapComponentComponent,
      componentProps: { location: this.productLocation },
    });

    modal.onDidDismiss().then(async (result) => {
      if (result?.data) {
        this.productLocation = result.data;
      }
    });

    await modal.present();
  }

  async getAddressFromCoordinatesOSM(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    try {
      const res: any = await fetch(url).then((r) => r.json());
      const address = res?.display_name || '';
      this.form.patchValue({ address });
      return address;
    } catch (error) {
      console.error('OSM Geocode error', error);
      return '';
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.navigateRoot('/main');
  }
}
