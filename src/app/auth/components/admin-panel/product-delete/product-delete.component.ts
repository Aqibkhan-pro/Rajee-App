import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface FirebaseProduct {
  id: string;
  displaySubject?: string;
  displayExtraInfo?: string;
  displayCategory?: string;
  displayLocation?: string;
  priceDisplay?: string;
  price?: string | number;
  images?: string[];
  coverImage?: string;
  createdAt?: number;
  user?: any;
  [key: string]: any;
}

@Component({
  selector: 'app-product-delete',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.scss'],
  standalone: false
})
export class ProductDeleteComponent implements OnInit {

  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  products: FirebaseProduct[] = [];
  filteredProducts: FirebaseProduct[] = [];
  loading = false;

  searchText = '';
  idToken: string | null = null;

  // ✅ Language support
  currentLang: 'en' | 'ar' = 'en';
  translations: any = {
    en: {
      removeProducts: 'Remove Products',
      searchPlaceholder: 'Search approved products...',
      loadingProducts: 'Loading products...',
      noProductsFound: 'No approved products found',
      approved: 'Approved',
      price: 'Price',
      category: 'Category',
      date: 'Date',
      description: 'Description',
      seller: 'Seller',
      remove: 'Remove',
      removeProduct: 'Remove product?',
      removeMessage: 'This will permanently remove <b>{title}</b> from approvedProducts.',
      cancel: 'Cancel',
      yes: 'Yes, Remove',
      removedSuccess: 'Removed from approvedProducts ✅',
      removeFailed: 'Remove failed',
      notAuthenticated: 'User not authenticated'
    },
    ar: {
      removeProducts: 'حذف المنتجات',
      searchPlaceholder: 'البحث عن المنتجات المعتمدة...',
      loadingProducts: 'جاري تحميل المنتجات...',
      noProductsFound: 'لم يتم العثور على منتجات معتمدة',
      approved: 'معتمد',
      price: 'السعر',
      category: 'الفئة',
      date: 'التاريخ',
      description: 'الوصف',
      seller: 'البائع',
      remove: 'حذف',
      removeProduct: 'هل تريد حذف المنتج؟',
      removeMessage: 'سيؤدي هذا إلى حذف <b>{title}</b> بشكل دائم من المنتجات المعتمدة.',
      cancel: 'إلغاء',
      yes: 'نعم، احذفه',
      removedSuccess: 'تم الحذف من المنتجات المعتمدة ✅',
      removeFailed: 'فشل الحذف',
      notAuthenticated: 'يجب تسجيل الدخول'
    }
  };

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // ✅ Load language from localStorage
    this.currentLang = (localStorage.getItem('lang') || 'en') as 'en' | 'ar';

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.idToken = userData?.idToken;

    if (!this.idToken) {
      this.showToast(this.t('notAuthenticated'), 'danger');
      return;
    }

    this.loadApprovedProducts();
  }

  // ✅ Get translation by key
  t(key: string, replacements?: { [key: string]: string }): string {
    let text = this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach(k => {
        text = text.replace(`{${k}}`, replacements[k]);
      });
    }
    
    return text;
  }

  trackById(_: number, item: FirebaseProduct) {
    return item.id;
  }

  onSearch(ev: any) {
    this.searchText = (ev?.detail?.value || '').toLowerCase();
    this.applySearch();
  }

  applySearch() {
    if (!this.searchText) {
      this.filteredProducts = [...this.products];
      return;
    }

    const q = this.searchText;
    this.filteredProducts = this.products.filter(p =>
      (p.displaySubject || '').toLowerCase().includes(q) ||
      (p.displayExtraInfo || '').toLowerCase().includes(q) ||
      (p.displayCategory || '').toLowerCase().includes(q) ||
      (p.user?.name || '').toLowerCase().includes(q)
    );
  }

  async doRefresh(event: any) {
    await this.loadApprovedProducts();
    event?.target?.complete?.();
  }

  getProductTime(p: FirebaseProduct): number {
    return (p?.createdAt || Date.now());
  }

  onImgError(ev: any) {
    ev.target.src = 'assets/image/four.jpg';
  }

  async loadApprovedProducts() {
    this.loading = true;
    try {
      const url = `${this.FIREBASE_DB_URL}/approvedProducts.json?auth=${this.idToken}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data) {
        this.products = [];
        this.filteredProducts = [];
        return;
      }

      const arr: FirebaseProduct[] = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));

      // newest first
      arr.sort((a, b) => (this.getProductTime(b) - this.getProductTime(a)));

      this.products = arr;
      this.applySearch();
    } catch (e: any) {
      console.error(e);
      this.showToast(e?.message || 'Failed to load approved products', 'danger');
    } finally {
      this.loading = false;
    }
  }

  async confirmDelete(p: FirebaseProduct) {
    const alert = await this.alertController.create({
      header: this.t('removeProduct'),
      message: this.t('removeMessage', { title: p.displaySubject || 'this product' }),
      buttons: [
        { text: this.t('cancel'), role: 'cancel' },
        {
          text: this.t('yes'),
          role: 'destructive',
          handler: () => this.deleteApprovedProduct(p)
        }
      ]
    });

    await alert.present();
  }

  private async deleteApprovedProduct(p: FirebaseProduct) {
    try {
      const delUrl = `${this.FIREBASE_DB_URL}/approvedProducts/${p.id}.json?auth=${this.idToken}`;
      const delRes = await fetch(delUrl, { method: 'DELETE' });

      if (!delRes.ok) throw new Error(await delRes.text());

      this.products = this.products.filter(x => x.id !== p.id);
      this.applySearch();

      this.showToast(this.t('removedSuccess'), 'success');
    } catch (e: any) {
      console.error(e);
      this.showToast(e?.message || this.t('removeFailed'), 'danger');
    }
  }

  private async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }
}
