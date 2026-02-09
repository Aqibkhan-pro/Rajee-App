import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { locationAnim } from 'src/app/shared/utils/anim';
import {
  CatItem,
  SECTIONS,
  getSectionByKey,
  getBrandsBySection,
  getModelsByBrandKey,

  DEVICE_CATEGORIES,
  DEVICE_MODELS,

  // ✅ ADD THESE
  ALL_AUCTION_CATEGORIES,
  AUCTION_SUBCATEGORIES,
} from 'src/app/shared/category-data';

@Component({
  selector: 'app-category-picker-modal',
  templateUrl: './category-picker-modal.component.html',
  styleUrls: ['./category-picker-modal.component.scss'],
  standalone: false,
  animations: [locationAnim],
})
export class CategoryPickerModalComponent implements OnInit {
  @Input() lang: 'en' | 'ar' = 'en';

  // ✅ reuse: sectionKey = section, brandKey = (car brand / device category / auction category)
  // ✅ modelKey = (car model / device model / auction subcategory)
  @Input() sectionKey: string | null = null;
  @Input() brandKey: string | null = null;
  @Input() modelKey: string | null = null;

  // ✅ cars only
  @Input() year: number | null = null;

  step = 0;

  sections: CatItem[] = SECTIONS;
  brands: CatItem[] = []; // ✅ cars brands OR device categories OR auction categories
  models: CatItem[] = []; // ✅ cars models OR device models OR auction subcategories
  years: CatItem[] = [];

  searchSection = '';
  searchBrand = '';
  searchModel = '';
  searchYear = '';

  selectedSection: CatItem | null = null;
  selectedBrand: CatItem | null = null;
  selectedModel: CatItem | null = null;

  yearKey: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  private get isCars(): boolean {
    return this.selectedSection?.key === 'cars_section';
  }
  private get isDevice(): boolean {
    return this.selectedSection?.key === 'device_section';
  }
  private get isAuctions(): boolean {
    return this.selectedSection?.key === 'all_auctions';
  }

  ngOnInit() {
    if (!this.sectionKey) return;

    const sec = getSectionByKey(this.sectionKey);
    if (!sec) return;

    this.selectedSection = sec;

    // ✅ load step-1 list
    if (sec.key === 'cars_section') {
      this.brands = getBrandsBySection(sec.key);
      this.step = 1;
    } else if (sec.key === 'device_section') {
      this.brands = DEVICE_CATEGORIES;
      this.step = 1;
    } else if (sec.key === 'all_auctions') {
      this.brands = ALL_AUCTION_CATEGORIES; // ✅ auction categories
      this.step = 1;
    } else {
      this.step = 0;
      return;
    }

    // ✅ preselect brand/category
    if (this.brandKey) {
      const b = this.brands.find(x => x.key === this.brandKey) ?? null;
      if (b) {
        this.selectedBrand = b;

        // ✅ load step-2 list
        if (sec.key === 'cars_section') {
          this.models = getModelsByBrandKey(b.key);
        } else if (sec.key === 'device_section') {
          this.models = DEVICE_MODELS[b.key] ?? [];
        } else if (sec.key === 'all_auctions') {
          this.models = AUCTION_SUBCATEGORIES[b.key] ?? []; // ✅ auction subcategories
        }

        this.step = 2;

        // ✅ preselect model/subcategory
        if (this.modelKey) {
          const m = this.models.find(x => x.key === this.modelKey) ?? null;
          if (m) {
            this.selectedModel = m;

            // ✅ only cars go to year step
            if (sec.key === 'cars_section') {
              this.buildYears(1971);
              this.step = 3;
              if (this.year) this.yearKey = String(this.year);
            }
          }
        }
      }
    }
  }

  uiText() {
    const isAr = this.lang === 'ar';
    const secKey = this.selectedSection?.key;

    const brandTitle =
      secKey === 'all_auctions'
        ? (isAr ? 'اختر تصنيف المزاد' : 'Select Auction Category')
        : secKey === 'device_section'
          ? (isAr ? 'اختر فئة الجهاز' : 'Select Device Category')
          : (isAr ? 'اختر الماركة' : 'Select Car Brand');

    const modelTitle =
      secKey === 'all_auctions'
        ? (isAr ? 'اختر القسم الفرعي' : 'Select Subcategory')
        : secKey === 'device_section'
          ? (isAr ? 'اختر نوع الجهاز' : 'Select Device Type')
          : (isAr ? 'اختر الموديل' : 'Select Model');

    const brandSearch =
      secKey === 'all_auctions'
        ? (isAr ? 'ابحث عن تصنيف المزاد...' : 'Search auction category...')
        : secKey === 'device_section'
          ? (isAr ? 'ابحث عن فئة الجهاز...' : 'Search device category...')
          : (isAr ? 'ابحث عن الماركة...' : 'Search car brand...');

    const modelSearch =
      secKey === 'all_auctions'
        ? (isAr ? 'ابحث عن القسم الفرعي...' : 'Search subcategory...')
        : (isAr ? 'ابحث عن الموديل...' : 'Search model...');

    return isAr
      ? {
          section: 'اختر القسم',
          brand: brandTitle,
          model: modelTitle,
          year: 'اختر السنة',
          close: 'إغلاق',
          searchSection: 'ابحث عن القسم...',
          searchBrand: brandSearch,
          searchModel: modelSearch,
          searchYear: 'ابحث عن السنة...',
          noModels: 'لا توجد نتائج.',
        }
      : {
          section: 'Select Section',
          brand: brandTitle,
          model: modelTitle,
          year: 'Select Year',
          close: 'Close',
          searchSection: 'Search section...',
          searchBrand: brandSearch,
          searchModel: modelSearch,
          searchYear: 'Search year...',
          noModels: 'No results found.',
        };
  }

  private buildYears(from = 1971) {
    const currentYear = new Date().getFullYear();
    const arr: CatItem[] = [];
    for (let y = currentYear; y >= from; y--) {
      const s = String(y);
      arr.push({ key: s, en: s, ar: s });
    }
    this.years = arr;
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  back() {
    if (this.step > 0) {
      this.step--;
      return;
    }
    this.close();
  }

  chooseSection(s: CatItem) {
    this.selectedSection = s;
    this.sectionKey = s.key;

    // reset below
    this.selectedBrand = null;
    this.brandKey = null;
    this.selectedModel = null;
    this.modelKey = null;
    this.yearKey = null;
    this.year = null;

    this.searchBrand = '';
    this.searchModel = '';
    this.searchYear = '';
    this.models = [];
    this.years = [];

    if (s.key === 'cars_section') {
      this.brands = getBrandsBySection(s.key);
      this.step = 1;
      return;
    }

    if (s.key === 'device_section') {
      this.brands = DEVICE_CATEGORIES;
      this.step = 1;
      return;
    }

    if (s.key === 'all_auctions') {
      this.brands = ALL_AUCTION_CATEGORIES; // ✅ auction categories
      this.step = 1;
      return;
    }

    // other sections -> return section only
    this.modalCtrl.dismiss(
      { sectionKey: s.key, section: s, brandKey: null, brand: null, modelKey: null, model: null, year: null },
      'confirm'
    );
  }

  chooseBrand(b: CatItem) {
    this.selectedBrand = b;
    this.brandKey = b.key;

    // reset below
    this.selectedModel = null;
    this.modelKey = null;
    this.yearKey = null;
    this.year = null;

    this.searchModel = '';
    this.searchYear = '';
    this.years = [];

    // load step-2 list
    if (this.isCars) {
      this.models = getModelsByBrandKey(b.key);
    } else if (this.isDevice) {
      this.models = DEVICE_MODELS[b.key] ?? [];
    } else if (this.isAuctions) {
      this.models = AUCTION_SUBCATEGORIES[b.key] ?? []; // ✅ subcategories
    } else {
      this.models = [];
    }

    this.step = 2;
  }

  // ✅ Device: model -> close
  // ✅ Auctions: subcategory -> close
  // ✅ Cars: model -> year step
  chooseModel(m: CatItem) {
    this.selectedModel = m;
    this.modelKey = m.key;

    if (this.isDevice || this.isAuctions) {
      // ✅ close for device/auctions (no year)
      this.modalCtrl.dismiss(
        {
          sectionKey: this.selectedSection?.key ?? null,
          section: this.selectedSection,

          brandKey: this.selectedBrand?.key ?? null,
          brand: this.selectedBrand,

          modelKey: m.key,
          model: m,

          year: null,
        },
        'confirm'
      );
      return;
    }

    // ✅ cars -> go year
    this.searchYear = '';
    this.yearKey = null;

    this.buildYears(1971);
    this.step = 3;
  }

  // ✅ cars only
  selectYearAndClose(y: CatItem) {
    this.yearKey = y.key;

    this.modalCtrl.dismiss(
      {
        sectionKey: this.selectedSection?.key ?? null,
        section: this.selectedSection,

        brandKey: this.selectedBrand?.key ?? null,
        brand: this.selectedBrand,

        modelKey: this.selectedModel?.key ?? null,
        model: this.selectedModel,

        year: Number(y.key),
      },
      'confirm'
    );
  }

  // -------- filters --------
  get filteredSections(): CatItem[] {
    const q = (this.searchSection || '').toLowerCase().trim();
    if (!q) return this.sections;
    return this.sections.filter(x => {
      const en = (x.en || '').toLowerCase();
      const ar = (x.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q) || x.key.toLowerCase().includes(q);
    });
  }

  get filteredBrands(): CatItem[] {
    const q = (this.searchBrand || '').toLowerCase().trim();
    if (!q) return this.brands;
    return this.brands.filter(x => {
      const en = (x.en || '').toLowerCase();
      const ar = (x.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q) || x.key.toLowerCase().includes(q);
    });
  }

  get filteredModels(): CatItem[] {
    const q = (this.searchModel || '').toLowerCase().trim();
    if (!q) return this.models;
    return this.models.filter(x => {
      const en = (x.en || '').toLowerCase();
      const ar = (x.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q) || x.key.toLowerCase().includes(q);
    });
  }

  get filteredYears(): CatItem[] {
    const q = (this.searchYear || '').toLowerCase().trim();
    if (!q) return this.years;
    return this.years.filter(x => (x.en || '').toLowerCase().includes(q));
  }

  label(x: CatItem): string {
    return this.lang === 'ar' ? x.ar : x.en;
  }
}
