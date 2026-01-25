import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface FirebaseProduct {
  id: string; // firebase key
  title?: string;
  image?: string;
  images?: string[];
  price?: string;
  description?: string;
  createdAt?: number;
  time?: number;
  section?: string;
  user?: any;
  location?: any;
  comments?: any[];
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

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.idToken = userData?.idToken;

    if (!this.idToken) {
      this.showToast('User not authenticated', 'danger');
      return;
    }

    this.loadApprovedProducts();
  }

  trackById(_: number, item: FirebaseProduct) {
    return item.id;
  }

  onSearch(ev: any) {
    // ion-searchbar uses ev.detail.value
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
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.section || '').toLowerCase().includes(q) ||
      (p.user?.name || '').toLowerCase().includes(q)
    );
  }

  async doRefresh(event: any) {
    await this.loadApprovedProducts();
    event?.target?.complete?.();
  }

  getProductTime(p: FirebaseProduct): number {
    return (p?.createdAt || p?.time || Date.now());
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
      header: 'Remove product?',
      message: `This will permanently remove <b>${p.title || 'this product'}</b> from approvedProducts.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
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

      // remove locally
      this.products = this.products.filter(x => x.id !== p.id);
      this.applySearch();

      this.showToast('Removed from approvedProducts ✅', 'success');
    } catch (e: any) {
      console.error(e);
      this.showToast(e?.message || 'Remove failed', 'danger');
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
