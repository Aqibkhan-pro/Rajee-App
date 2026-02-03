import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import {
  trigger, transition, style, animate, query, group
} from '@angular/animations';
import { Province, District } from 'src/app/shared/saudi-provinces';
import { LocationPickerModalComponent } from './location-picker-modal/location-picker-modal.component';
import { stepAnim } from 'src/app/shared/utils/anim';
import { CategoryPickerModalComponent } from './category-picker-modal/category-picker-modal.component';
import { CatItem } from 'src/app/shared/category-data';



type ProductDraft = {
  name: string;
  price: number | null;
  category: string;
  description: string;
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
    name: '',
    price: null,
    category: '',
    description: '',
  };

  // ✅ selected location state
  selectedProvinceKey: string | null = 'riyadh';
  selectedDistrictKey: string | null = 'riyadh_city';
  locationDisplayText = 'Change Location - Riyadh (Saudi Arabia)';

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'ar') this.selectedLanguage = 'ar';
    else this.selectedLanguage = 'en';

    this.refreshLocationDisplay();
  }

  nextStep() {
    if (this.step < 2) this.step++;
  }

  prevStep() {
    if (this.step > 0) {
      this.step--;
      return;
    }
    this.navCtrl.back();
  }

  save() {
    const payload = {
      ...this.model,
      price: this.model.price === null ? 0 : Number(this.model.price),
      location: {
        provinceKey: this.selectedProvinceKey,
        districtKey: this.selectedDistrictKey,
      }
    };

    console.log('SAVE PAYLOAD:', payload);
  }

  // ✅ Open location modal
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
      }
    });

    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm' && data) {
      this.selectedProvinceKey = data.provinceKey ?? null;
      this.selectedDistrictKey = data.districtKey ?? null;
      this.refreshLocationDisplay(data.province, data.district);
    }
  }

  private refreshLocationDisplay(province?: Province, district?: District) {
    // agar modal se object aaya hai to direct use
    if (province && district) {
      const p = this.selectedLanguage === 'ar' ? province.ar : province.en;
      const d = this.selectedLanguage === 'ar' ? district.ar : district.en;
      this.locationDisplayText = `${d} - ${p} (Saudi Arabia)`;
      return;
    }

    // warna default text
    if (!this.selectedProvinceKey || !this.selectedDistrictKey) {
      this.locationDisplayText = 'Select Location';
      return;
    }

    // simple fallback
    this.locationDisplayText = `Change Location`;
  }

  // existing image stuff (as is)
  pickedImages: any[] = [];
  MAX_IMAGES: number = 10;
  pickMultipleImages() {}
  removePickedImage(i: any) {}



selectedCategoryKey: string | null = null;
selectedSubCategoryKey: string | null = null;
categoryDisplayText = 'Select Category';

async openCategoryModal() {
  const modal = await this.modalCtrl.create({
    component: CategoryPickerModalComponent,
    cssClass: 'location-picker-modal', // same modal class ok
    breakpoints: [0, 0.85],
    initialBreakpoint: 0.85,
    mode: 'ios',
    backdropDismiss: false,
    componentProps: {
      lang: this.selectedLanguage,
      categoryKey: this.selectedCategoryKey,
      subCategoryKey: this.selectedSubCategoryKey,
    },
  });

  await modal.present();
  const { data, role } = await modal.onDidDismiss();

  if (role === 'confirm' && data) {
    this.selectedCategoryKey = data.categoryKey ?? null;
    this.selectedSubCategoryKey = data.subCategoryKey ?? null;

    const cat = data.category as CatItem;
    const sub = data.subCategory as CatItem;

    const catName = this.selectedLanguage === 'ar' ? cat.ar : cat.en;
    const subName = this.selectedLanguage === 'ar' ? sub.ar : sub.en;

    this.categoryDisplayText = `${catName} > ${subName}`;
  }
}

}
