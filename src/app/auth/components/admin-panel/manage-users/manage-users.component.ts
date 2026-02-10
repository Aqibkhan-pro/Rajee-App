import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface AppUser {
  key: string;      // Firebase node key
  uid: string;
  name: string;
  email: string;
  phone: string;
  createdAt: number;
  status?: 'active' | 'inactive'; // we will write this field
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  standalone: false
})
export class ManageUsersComponent implements OnInit {
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  users: AppUser[] = [];
  filteredUsers: AppUser[] = [];
  loading = false;
  searchText = '';
  idToken: string | null = null;

  // ✅ Language support
  currentLang: string = 'en';
  translations: any = {
    en: {
      manageUsers: 'Manage Users',
      searchPlaceholder: 'Search name / email / phone...',
      loadingUsers: 'Loading users...',
      noUsersFound: 'No users found',
      active: 'Active',
      inactive: 'Inactive',
      deactivate: 'Deactivate',
      activate: 'Activate',
      deactivateUserTitle: 'Deactivate User?',
      activateUserTitle: 'Activate User?',
      setUserTo: 'Set "{name}" to {status}?',
      cancel: 'Cancel',
      yes: 'Yes',
      userIsNow: 'User is now {status}',
      failedLoadUsers: 'Failed to load users',
      noEmail: 'No email',
      noPhone: 'No phone'
    },
    ar: {
      manageUsers: 'إدارة المستخدمين',
      searchPlaceholder: 'البحث عن الاسم / البريد الإلكتروني / الهاتف...',
      loadingUsers: 'جاري تحميل المستخدمين...',
      noUsersFound: 'لم يتم العثور على مستخدمين',
      active: 'نشط',
      inactive: 'غير نشط',
      deactivate: 'إلغاء التفعيل',
      activate: 'تفعيل',
      deactivateUserTitle: 'إلغاء تفعيل المستخدم؟',
      activateUserTitle: 'تفعيل المستخدم؟',
      setUserTo: 'تعيين "{name}" إلى {status}؟',
      cancel: 'إلغاء',
      yes: 'نعم',
      userIsNow: 'المستخدم الآن {status}',
      failedLoadUsers: 'فشل تحميل المستخدمين',
      noEmail: 'لا يوجد بريد إلكتروني',
      noPhone: 'لا يوجد هاتف'
    }
  };

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.idToken = userData?.idToken;
    if (!this.idToken) throw new Error('User not authenticated');

    // ✅ Load language from localStorage
    this.currentLang = localStorage.getItem('lang') || 'en';
    
    this.loadUsers();
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

  onSearch(ev: any) {
    this.searchText = ev.target.value?.toLowerCase() || '';
    this.applySearch();
  }

  applySearch() {
    if (!this.searchText) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      return name.includes(this.searchText) || email.includes(this.searchText) || phone.includes(this.searchText);
    });
  }

  async loadUsers() {
    this.loading = true;
    try {
      const url = `${this.FIREBASE_DB_URL}/users.json?auth=${this.idToken}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      const arr: AppUser[] = data
        ? Object.keys(data).map(key => ({
          key,
          ...data[key],
          status: data[key]?.status || 'active'
        }))
        : [];

      // sort newest first
      arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      this.users = arr;
      this.applySearch();
    } catch (e: any) {
      console.error(e);
      this.showToast(this.t('failedLoadUsers'), 'danger');
    } finally {
      this.loading = false;
    }
  }

  async toggleUserStatus(user: AppUser) {
    const current = user.status || 'active';
    const next: 'active' | 'inactive' = current === 'active' ? 'inactive' : 'active';
    const statusLabel = next === 'active' ? this.t('active').toUpperCase() : this.t('inactive').toUpperCase();

    const alert = await this.alertController.create({
      header: next === 'inactive' ? this.t('deactivateUserTitle') : this.t('activateUserTitle'),
      message: this.t('setUserTo', { name: user.name, status: statusLabel }),
      buttons: [
        { text: this.t('cancel'), role: 'cancel' },
        {
          text: this.t('yes'),
          handler: async () => {
            await this.updateUserStatus(user.key, next);

            // update locally
            this.users = this.users.map(u => u.key === user.key ? { ...u, status: next } : u);
            this.applySearch();

            this.showToast(this.t('userIsNow', { status: next === 'active' ? this.t('active') : this.t('inactive') }), 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  private async updateUserStatus(userKey: string, status: 'active' | 'inactive') {
    const url = `${this.FIREBASE_DB_URL}/users/${userKey}.json?auth=${this.idToken}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        updatedAt: Date.now()
      })
    });

    if (!res.ok) throw new Error(await res.text());
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

  getInitial(name: string): string {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }

  getAvatarGradient(name?: string): string {
    const str = (name || 'user').trim().toLowerCase();

    // simple hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);

    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 40) % 360;

    return `linear-gradient(135deg, hsl(${hue1}, 80%, 45%), hsl(${hue2}, 85%, 55%))`;
  }
}
