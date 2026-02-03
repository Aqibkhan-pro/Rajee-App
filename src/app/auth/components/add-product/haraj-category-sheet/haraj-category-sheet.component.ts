
  import { Component, OnInit } from '@angular/core';
  import { ModalController } from '@ionic/angular';
  import { TranslateService } from '@ngx-translate/core';

  interface CategoryOption {
    key: string;
    ar: string;
    en: string;
  }

  interface SubCategoryOption {
    key: string;
    ar: string;
    en: string;
  }

@Component({
  selector: 'app-haraj-category-sheet',
  templateUrl: './haraj-category-sheet.component.html',
  styleUrls: ['./haraj-category-sheet.component.scss'],
  standalone:false
})
export class HarajCategorySheetComponent implements OnInit {

    searchQuery = '';
    selectedLanguage = 'en';

    // ✅ Track expanded sections
    expandedSections: { [key: string]: boolean } = {};

    // ✅ Track selected category and subcategory
    selectedCategory: string | null = null;
    selectedSubCategory: string | null = null;

    categories: CategoryOption[] = [];

    subCategoriesMap: Record<string, SubCategoryOption[]> = {};

    // Filtered lists based on search
    filteredCategories: CategoryOption[] = [];

    constructor(
      private modalCtrl: ModalController,
      private translate: TranslateService
    ) {}

    ngOnInit() {
      const savedLang = localStorage.getItem('lang');
      if (savedLang) this.selectedLanguage = savedLang;

      // ✅ Initialize categories (same as your add-product page)
      this.categories = [
        { key: 'cars', ar: 'رجيع السيارات', en: 'Cars & Vehicles' },
        { key: 'electronics', ar: 'رجيع الأجهزة', en: 'Electronics & Devices' },
        { key: 'furniture', ar: 'رجيع الأثاث', en: 'Furniture' },
        { key: 'personal_items', ar: 'مستلزمات شخصية', en: 'Personal Items & Accessories' },
        { key: 'services', ar: 'خدمات', en: 'Services' },
        { key: 'jobs', ar: 'وظائف', en: 'Jobs' },
        { key: 'games', ar: 'ألعاب وترفيه', en: 'Games & Entertainment' },
        { key: 'others', ar: 'قسم غير مصنف', en: 'Uncategorized / Other' },
      ];

      // ✅ Initialize subcategories map (same as your add-product page)
      this.subCategoriesMap = {
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

      this.filteredCategories = [...this.categories];
    }

    // ✅ Handle search filtering
    onSearchChange(event: any) {
      const query = event.detail.value?.toLowerCase() || '';
      this.searchQuery = query;

      if (!query) {
        this.filteredCategories = [...this.categories];
        return;
      }

      // Filter categories by name
      this.filteredCategories = this.categories.filter((cat) => {
        const catName = this.selectedLanguage === 'en' ? cat.en : cat.ar;
        const matchesCategory = catName.toLowerCase().includes(query);

        // Also check if any subcategory matches
        const subCats = this.subCategoriesMap[cat.key] || [];
        const matchesSubCategory = subCats.some((sub) => {
          const subName = this.selectedLanguage === 'en' ? sub.en : sub.ar;
          return subName.toLowerCase().includes(query);
        });

        return matchesCategory || matchesSubCategory;
      });
    }

    // ✅ Toggle section expansion
    toggleSection(categoryKey: string) {
      this.expandedSections[categoryKey] = !this.expandedSections[categoryKey];
    }

    // ✅ Check if section is expanded
    isSectionExpanded(categoryKey: string): boolean {
      return this.expandedSections[categoryKey] || false;
    }

    // ✅ Select subcategory (final selection)
    selectSubCategory(categoryKey: string, subCategoryKey: string) {
      this.selectedCategory = categoryKey;
      this.selectedSubCategory = subCategoryKey;
    }

    // ✅ Close with selection
    confirmSelection() {
      if (this.selectedCategory && this.selectedSubCategory) {
        this.modalCtrl.dismiss({
          category: this.selectedCategory,
          subCategory: this.selectedSubCategory,
        });
      }
    }

    // ✅ Close without selection
    dismiss() {
      this.modalCtrl.dismiss();
    }

    // ✅ Get display name based on language
    getCategoryName(category: CategoryOption): string {
      return this.selectedLanguage === 'en' ? category.en : category.ar;
    }

    getSubCategoryName(subCategory: SubCategoryOption): string {
      return this.selectedLanguage === 'en' ? subCategory.en : subCategory.ar;
    }

    // ✅ Get filtered subcategories for a category
    getFilteredSubCategories(categoryKey: string): SubCategoryOption[] {
      const subCats = this.subCategoriesMap[categoryKey] || [];

      if (!this.searchQuery) {
        return subCats;
      }

      return subCats.filter((sub) => {
        const subName = this.selectedLanguage === 'en' ? sub.en : sub.ar;
        return subName.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }
