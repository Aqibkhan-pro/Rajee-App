import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { locationAnim } from 'src/app/shared/utils/anim';
import {
  CatItem,
  CATEGORIES,
  getCategoryByKey,
  getSubCategoriesByCategory
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
  @Input() categoryKey: string | null = null;
  @Input() subCategoryKey: string | null = null;

  step = 0;

  categories: CatItem[] = CATEGORIES;
  subCategories: CatItem[] = [];

  searchCategory = '';
  searchSub = '';

  selectedCategory: CatItem | null = null;

  ngOnInit() {
    if (this.categoryKey) {
      const cat = getCategoryByKey(this.categoryKey);
      if (cat) {
        this.selectedCategory = cat;
        this.subCategories = getSubCategoriesByCategory(cat.key);

        // if already category but no sub => go step 1
        if (!this.subCategoryKey) this.step = 1;
      }
    }
  }

  constructor(private modalCtrl: ModalController) {}

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

  chooseCategory(c: CatItem) {
    this.selectedCategory = c;
    this.categoryKey = c.key;

    this.subCategories = getSubCategoriesByCategory(c.key);
    this.searchSub = '';
    this.subCategoryKey = null;

    this.step = 1;
  }

  // ✅ click subcategory => close modal + send to parent
  selectSubAndClose(s: CatItem) {
    this.subCategoryKey = s.key;

    if (!this.selectedCategory) return;

    this.modalCtrl.dismiss(
      {
        categoryKey: this.selectedCategory.key,
        subCategoryKey: s.key,
        category: this.selectedCategory,
        subCategory: s,
      },
      'confirm'
    );
  }

  get filteredCategories(): CatItem[] {
    const q = (this.searchCategory || '').toLowerCase().trim();
    if (!q) return this.categories;
    return this.categories.filter(x => {
      const en = (x.en || '').toLowerCase();
      const ar = (x.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q);
    });
  }

  get filteredSubCategories(): CatItem[] {
    const q = (this.searchSub || '').toLowerCase().trim();
    if (!q) return this.subCategories;
    return this.subCategories.filter(x => {
      const en = (x.en || '').toLowerCase();
      const ar = (x.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q);
    });
  }

  label(x: CatItem): string {
    return this.lang === 'ar' ? x.ar : x.en;
  }
}
