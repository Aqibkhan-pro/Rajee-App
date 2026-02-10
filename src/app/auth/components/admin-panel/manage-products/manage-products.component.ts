import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface FirebaseProductRaw {
  subject?: string;
  extraInfo?: string;
  price?: number;
  phone?: string;
  createdAt?: number;

  images?: string[];

  location?: {
    displayText?: { en?: string; ar?: string };
  };

  selection?: {
    displayText?: { en?: string; ar?: string };
    section?: { key?: string; en?: string; ar?: string };
  };

  carDetails?: any;

  [key: string]: any;
}

interface FirebaseProductView extends FirebaseProductRaw {
  id: string;

  // ✅ computed fields for UI
  coverImage: string;
  displaySubject: string;
  displayExtraInfo: string;
  displayCategory: string;
  displayLocation: string;
  priceDisplay: string;
}

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
  standalone: false,
})
export class ManageProductsComponent implements OnInit {
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  products: FirebaseProductView[] = [];
  filteredProducts: FirebaseProductView[] = [];
  loading = false;

  searchText = '';
  idToken: string | null = null;

  // ✅ UI language (for en/ar)
  currentLang: 'en' | 'ar' = 'en';

  // ✅ Language support
  translations: any = {
    en: {
      manageProducts: 'Manage Products',
      searchPlaceholder: 'Search products...',
      loadingProducts: 'Loading products...',
      noPendingProducts: 'No pending products',
      approve: 'Approve',
      reject: 'Reject',
      approvedSuccess: 'Approved ✅ moved to approvedProducts',
      rejectedSuccess: 'Rejected ❌ removed from products',
      approvedFailed: 'Approve failed',
      rejectedFailed: 'Reject failed',
      loginRequired: 'Login required to perform this action',
      failedToLoad: 'Failed to load products'
    },
    ar: {
      manageProducts: 'إدارة المنتجات',
      searchPlaceholder: 'البحث عن المنتجات...',
      loadingProducts: 'جاري تحميل المنتجات...',
      noPendingProducts: 'لا توجد منتجات قيد الانتظار',
      approve: 'الموافقة',
      reject: 'رفض',
      approvedSuccess: 'تمت الموافقة ✅ تم نقله إلى المنتجات المعتمدة',
      rejectedSuccess: 'تم الرفض ❌ تم حذفه من المنتجات',
      approvedFailed: 'فشلت الموافقة',
      rejectedFailed: 'فشل الرفض',
      loginRequired: 'يجب تسجيل الدخول لإجراء هذا الإجراء',
      failedToLoad: 'فشل تحميل المنتجات'
    }
  };

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    // ✅ Load language from localStorage
    this.currentLang = (localStorage.getItem('lang') || 'en') as 'en' | 'ar';

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.idToken = userData?.idToken;

    // NOTE: your products.read=true so auth not required for load.
    // but approve/reject write needs auth.
    this.loadProducts();
  }

  // ✅ Get translation by key
  t(key: string): string {
    return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
  }

  onSearch(event: any) {
    this.searchText = event?.target?.value?.toLowerCase() || '';
    this.applySearch();
  }

  private applySearch() {
    if (!this.searchText) {
      this.filteredProducts = [...this.products];
      return;
    }

    const q = this.searchText;

    this.filteredProducts = this.products.filter(p => {
      const subject = (p.displaySubject || '').toLowerCase();
      const desc = (p.displayExtraInfo || '').toLowerCase();
      const cat = (p.displayCategory || '').toLowerCase();
      const loc = (p.displayLocation || '').toLowerCase();
      const section = (p.selection?.section?.key || '').toLowerCase();
      return (
        subject.includes(q) ||
        desc.includes(q) ||
        cat.includes(q) ||
        loc.includes(q) ||
        section.includes(q)
      );
    });
  }

  async loadProducts() {
    this.loading = true;
    try {
      // ✅ read is public according to your rules
      const url = `${this.FIREBASE_DB_URL}/products.json`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data) {
        this.products = [];
        this.filteredProducts = [];
        return;
      }

      const arr: FirebaseProductView[] = Object.keys(data).map((key) => {
        const raw: FirebaseProductRaw = data[key] || {};
        return this.mapToView(key, raw);
      });

      // newest first
      arr.sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)));

      this.products = arr;
      this.applySearch();
    } catch (e: any) {
      console.error(e);
      this.showToast(this.t('failedToLoad'), 'danger');
    } finally {
      this.loading = false;
    }
  }

  private mapToView(id: string, raw: FirebaseProductRaw): FirebaseProductView {
    const lang = this.currentLang;

    const coverImage =
      raw?.images?.[0] ||
      (raw as any)?.image ||
      'assets/imgs/placeholder.png';

    const displaySubject = (raw?.subject ?? '').trim();

    const displayExtraInfo = (raw?.extraInfo ?? '').trim();

    const displayCategory =
      raw?.selection?.displayText?.[lang] ||
      raw?.selection?.displayText?.en ||
      '';

    const displayLocation =
      raw?.location?.displayText?.[lang] ||
      raw?.location?.displayText?.en ||
      '';

    const priceDisplay =
      raw?.price === null || raw?.price === undefined
        ? 'N/A'
        : String(raw.price);

    return {
      id,
      ...raw,
      coverImage,
      displaySubject,
      displayExtraInfo,
      displayCategory,
      displayLocation,
      priceDisplay,
    };
  }

  // ✅ APPROVE: copy to approvedProducts then delete from products
  async approve(p: FirebaseProductView) {
    try {
      if (!this.idToken) {
        this.showToast(this.t('loginRequired'), 'danger');
        return;
      }

      const approvedPayload = {
        ...p,
        approvedAt: Date.now(),
        status: 'approved',
      };

      const putUrl = `${this.FIREBASE_DB_URL}/approvedProducts/${p.id}.json?auth=${this.idToken}`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approvedPayload),
      });
      if (!putRes.ok) throw new Error(await putRes.text());

      await this.deleteFromProducts(p.id);

      this.products = this.products.filter((x) => x.id !== p.id);
      this.applySearch();

      this.showToast(this.t('approvedSuccess'), 'success');
    } catch (e: any) {
      console.error(e);
      this.showToast(e.message || this.t('approvedFailed'), 'danger');
    }
  }

  async reject(p: FirebaseProductView) {
    try {
      if (!this.idToken) {
        this.showToast(this.t('loginRequired'), 'danger');
        return;
      }

      await this.deleteFromProducts(p.id);

      this.products = this.products.filter((x) => x.id !== p.id);
      this.applySearch();

      this.showToast(this.t('rejectedSuccess'), 'medium');
    } catch (e: any) {
      console.error(e);
      this.showToast(e.message || this.t('rejectedFailed'), 'danger');
    }
  }

  private async deleteFromProducts(productId: string) {
    const delUrl = `${this.FIREBASE_DB_URL}/products/${productId}.json?auth=${this.idToken}`;
    const delRes = await fetch(delUrl, { method: 'DELETE' });
    if (!delRes.ok) throw new Error(await delRes.text());
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
