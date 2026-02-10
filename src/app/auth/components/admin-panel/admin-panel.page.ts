import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
  standalone: false
})
export class AdminPanelPage implements OnInit {

  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  // ✅ counts
  totalUsers = 0;
  activeUsers = 0;
  deactiveUsers = 0;

  pendingProducts = 0;
  approvedProducts = 0;
  rejectedProducts = 0;
  totalProducts = 0;

  // ✅ Language support
  currentLang: string = 'en';
  translations: any = {
    en: {
      adminPanel: 'Admin Panel',
      manageUsers: 'Manage Users',
      usersDesc: 'Add, edit, delete and view all user accounts in the system',
      totalUsers: 'Total Users',
      manageProducts: 'Manage Products',
      productsDesc: 'Approved and Rejected products in Rajee.',
      totalProducts: 'Total Products',
      removeProducts: 'Remove Products',
      removeDesc: 'Remove products in Rajee.',
      products: 'Products',
      open: 'Open'
    },
    ar: {
      adminPanel: 'لوحة التحكم',
      manageUsers: 'إدارة المستخدمين',
      usersDesc: 'إضافة وتعديل وحذف وعرض جميع حسابات المستخدمين في النظام',
      totalUsers: 'إجمالي المستخدمين',
      manageProducts: 'إدارة المنتجات',
      productsDesc: 'المنتجات المعتمدة والمرفوضة في راجي.',
      totalProducts: 'إجمالي المنتجات',
      removeProducts: 'حذف المنتجات',
      removeDesc: 'حذف المنتجات في راجي.',
      products: 'المنتجات',
      open: 'فتح'
    }
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  idToken: string | null = null;
  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.idToken = userData?.idToken;
    if (!this.idToken) throw new Error('User not authenticated');
    
    // ✅ Load language from localStorage
    this.currentLang = localStorage.getItem('lang') || 'en';
    console.log('AdminPanelPage initialized with language:', this.currentLang);
    
    this.loadCounts();
  }

  // ✅ Get translation by key
  t(key: string): string {
    return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
  }

  openUsers() {
    this.navCtrl.navigateForward(['/admin-panel/manage-users']);
  }

  openProducts() {
    this.navCtrl.navigateForward(['/admin-panel/manage-products']);
  }

  openRemoveProduct() {
    this.navCtrl.navigateForward(['/admin-panel/delete-products']);
  }

  // ----------------- ✅ COUNTS -----------------

  async loadCounts() {
    try {
      const [users, pending, approved, rejected] = await Promise.all([
        this.fetchObject('/users'),
        this.fetchObject('/products'),
        this.fetchObject('/approvedProducts'),
        this.fetchObject('/rejectedProducts'),
      ]);

      const usersArr = this.objToArray(users);
      this.totalUsers = usersArr.length;

      this.activeUsers = usersArr.filter(u =>
        u?.status === 'active' || u?.isActive === true
      ).length;

      this.deactiveUsers = this.totalUsers - this.activeUsers;

      this.pendingProducts = this.countObject(pending);
      this.approvedProducts = this.countObject(approved);
      this.rejectedProducts = this.countObject(rejected);

      this.totalProducts = this.pendingProducts + this.approvedProducts;

    } catch (e: any) {
      console.error(e);
      this.showToast(e?.message || 'Failed to load counts', 'danger');
    }
  }

  private async fetchObject(path: string): Promise<any> {
    const url = `${this.FIREBASE_DB_URL}${path}.json?auth=${this.idToken}`;
    const res = await fetch(url);

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Firebase error (${path}): ${txt}`);
    }

    return await res.json();
  }

  private countObject(data: any): number {
    return Object.keys(data || {}).length;
  }

  private objToArray(data: any): any[] {
    if (!data) return [];
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
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
