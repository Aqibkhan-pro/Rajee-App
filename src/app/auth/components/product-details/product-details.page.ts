import { UserData } from './../../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Product, ProductUser, Rating, Comment } from 'src/app/shared/common.interface';
import { InboxService } from '../home/chat-inbox/service/inbox.service';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';
import { CommonService } from '../../services/common.service';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: false
})
export class ProductDetailsPage implements OnInit {

  product!: Product;
  currentUserId!: string;
  isFollowing = false;
  isFavorite = false;

  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';
  productUser: ProductUser | null = null;

  // ✅ NEW: Related products
  relatedProducts: any[] = [];
  loadingRelatedProducts = false;

  // Rating and comment
  newComment = '';
  averageRating = 0;
  userData: any;

  // ✅ Language support
  currentLang: 'en' | 'ar' = 'en';
  translations: any = {
    en: {
      detail: 'Product Details',
      contact: 'Contact',
      sendMessage: 'Send Message',
      call: 'Call',
      ratingReviews: 'Rating & Reviews',
      comments: 'Comments',
      noCommentsYet: 'No comments yet',
      beFirstToShare: 'Be the first to share your thoughts!',
      writeComment: 'Write a comment...',
      rateThisProduct: 'Rate this product?',
      howWouldYouRate: 'How would you rate this product?',
      submitRating: 'Submit Rating',
      allRatings: 'All Ratings',
      relatedProducts: 'Related Products',
      noRelatedProducts: 'No related products found'
    },
    ar: {
      detail: 'تفاصيل المنتج',
      contact: 'تواصل',
      sendMessage: 'إرسال رسالة',
      call: 'اتصال',
      ratingReviews: 'التقييمات والتعليقات',
      comments: 'التعليقات',
      noCommentsYet: 'لا توجد تعليقات بعد',
      beFirstToShare: 'كن أول من يشارك أفكارك!',
      writeComment: 'اكتب تعليقاً...',
      rateThisProduct: 'هل تريد تقييم هذا المنتج؟',
      howWouldYouRate: 'كيف تقيم هذا المنتج؟',
      submitRating: 'إرسال التقييم',
      allRatings: 'جميع التقييمات',
      relatedProducts: 'منتجات ذات صلة',
      noRelatedProducts: 'لم يتم العثور على منتجات ذات صلة'
    }
  };

  // Modal states
  isActionSheetOpen = false;
  isRatingModalOpen = false;
  selectedRating = 0;

  // ✅ Action buttons for action sheet (only rating)
  actionButtons = [
    {
      text: 'Add Rating',
      icon: 'star',
      handler: () => this.openRatingModal()
    },
    {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,           // ✅ ADD
    private navCtrl: NavController,
    private db: AngularFireDatabase,
    private commonService: CommonService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
    // ✅ If came from inside app via state
    const navigation = this.router.getCurrentNavigation();
    const p = navigation?.extras?.state?.['product'];
    if (p) this.product = p;
  }

  async ngOnInit() {
    // ✅ Load language
    this.currentLang = (localStorage.getItem('lang') || 'en') as 'en' | 'ar';

    // ✅ 1) Resolve product first (state OR route id)
    await this.resolveProductFromStateOrRoute();

    // ✅ 2) After product loaded, then run your existing init logic
    await this.initAfterProductLoaded();

    // ✅ 3) Load related products
    await this.loadRelatedProducts();
  }

  // ✅ GET TRANSLATION
  t(key: string): string {
    return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
  }

  // ✅ NEW: Load related products from approvedProducts
  async loadRelatedProducts(): Promise<void> {
    this.loadingRelatedProducts = true;
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const idToken = userData?.idToken;

      if (!idToken) {
        console.log('No auth token, skipping related products');
        this.relatedProducts = [];
        return;
      }

      const url = `${this.FIREBASE_DB_URL}/approvedProducts.json?auth=${idToken}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Failed to fetch approved products');
      }

      const data = await res.json();

      if (!data) {
        this.relatedProducts = [];
        return;
      }

      // Convert to array and map
      let products = Object.keys(data).map(key => ({
        id: key,
        ...data[key],
      }));

      // Filter: exclude current product, optionally same category
      products = products.filter(p => {
        // Exclude current product
        if (p.id === String(this.product?.createdAt)) return false;
        
        // Optional: filter by same category
        // if (p.displayCategory !== this.product?.displayCategory) return false;
        
        return true;
      });

      // Sort newest first
      products.sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)));

      // Take first 5
      this.relatedProducts = products.slice(0, 5);

      console.log('Related products loaded:', this.relatedProducts.length);
    } catch (error) {
      console.error('Error loading related products:', error);
      this.relatedProducts = [];
    } finally {
      this.loadingRelatedProducts = false;
    }
  }

  // ✅ Navigate to product details
  async viewProductDetail(product: any) {
    this.navCtrl.navigateForward(['/product-details', product.id], {
      state: { product }
    });
  }

  // ✅ NEW: Resolve product first (state OR route id)
  private async resolveProductFromStateOrRoute(): Promise<void> {
    try {
      // If already available from state
      if (this.product) return;

      const id = this.route.snapshot.paramMap.get('id'); // /product-details/:id
      if (!id) {
        this.router.navigateByUrl('/home');
        return;
      }

      // Load product from Realtime DB
      const p = await firstValueFrom(
        this.db.object<Product>(`products/${id}`).valueChanges().pipe(take(1))
      );

      if (!p) {
        this.router.navigateByUrl('/home');
        return;
      }

      // createdAt ko id treat kar rahe ho
      this.product = { ...p, createdAt: Number(id) } as any;
    } catch (e) {
      console.error('resolveProductFromStateOrRoute error:', e);
      this.router.navigateByUrl('/home');
    }
  }

  // ✅ NEW: aapka ngOnInit wala code yahan shift
  private async initAfterProductLoaded() {
    this.userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Even if not logged-in, page should show product
    this.currentUserId = this.userData?.uid || '';

    // Rating summary safe
    this.calculateAverageRating();
    this.loadUserRating();

    // User profile of product owner (if you want even without login, you can skip)
    if (this.product?.user?.uid) {
      this.productUser = await this.getSingleUser(this.product.user.uid) as ProductUser;
      console.log('Product user:', this.productUser);
    }

    // Follow/Favorite only if logged in
    if (this.currentUserId) {
      await this.checkIfFollowing();
      await this.checkIfFavorite();
    }
  }

  trackByComment(index: number, item: any) {
    return item?.createdAt || index;
  }

  trackByProduct(index: number, item: any) {
    return item?.id || index;
  }

  // ------------------- USER FETCH -------------------
  async getSingleUser(userId: string): Promise<ProductUser | null> {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const idToken = userData?.idToken;

      // ✅ If token missing, avoid hard error
      if (!idToken) return null;

      const url = `${this.FIREBASE_DB_URL}/users/${userId}.json?auth=${idToken}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch user: ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Get single user error:', error);
      return null;
    }
  }

  async checkIfFollowing(): Promise<void> {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const idToken = userData?.idToken;
      if (!idToken) return;

      const targetUserId = this.product?.user?.uid;
      if (!targetUserId || !this.currentUserId) return;

      const url = `${this.FIREBASE_DB_URL}/following/${this.currentUserId}/${targetUserId}.json?auth=${idToken}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to check follow status');

      const data = await res.json();
      this.isFollowing = data !== null;
    } catch (error) {
      console.error('Error checking if following:', error);
    }
  }

  // ------------------- FAVORITE -------------------
  async toggleFavorite() {
    if (this.isFavorite) await this.removeFavorite();
    else await this.addFavorite();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    toast.present();
  }

  followUser() {
    try {
      const targetUserId = this.product.user.uid;
      if (!this.currentUserId || this.currentUserId === targetUserId) return;

      const time = Date.now();
      const updates: any = {};
      updates[`following/${this.currentUserId}/${targetUserId}`] = { followedAt: time };
      updates[`followers/${targetUserId}/${this.currentUserId}`] = { followedAt: time };

      this.db.database.ref().update(updates);
      this.isFollowing = true;
    } catch (error) {
      console.error('Error following user:', error);
    }
  }

  unfollowUser() {
    try {
      const targetUserId = this.product.user.uid;
      if (!this.currentUserId) return;

      const updates: any = {};
      updates[`following/${this.currentUserId}/${targetUserId}`] = null;
      updates[`followers/${targetUserId}/${this.currentUserId}`] = null;

      this.db.database.ref().update(updates);
      this.isFollowing = false;
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  }

  // ------------------- CHAT -------------------
  getRoomId(user1: string, user2: string, productId: string) {
    return [user1, user2].sort().join('_') + '_' + productId;
  }

  async openChat(product: Product) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData?.uid) return;

    await this.checkIfFollowing();

    const owner = await this.getSingleUser(this.product.user.uid) as ProductUser;
    const currentUser = await this.getSingleUser(userData.uid) as ProductUser;

    const currentUserName = currentUser?.name || 'User';
    const ownerName = owner?.name || 'User';

    const roomId = this.getRoomId(currentUser.uid, owner.uid, String(this.product.createdAt));
    const roomRef = this.db.database.ref(`/chatRooms/${roomId}`);
    const snapshot = await roomRef.get();

    let chatRoom: any;

    if (!snapshot.exists()) {
      chatRoom = {
        id: roomId,
        type: 'product',
        productId: product.createdAt,
        lastMessage: '',
        lastMessageTime: 0,
        participants: {
          [currentUser.uid]: { uid: currentUser.uid, name: currentUserName, unreadCount: 0 },
          [owner.uid]: { uid: owner.uid, name: ownerName, unreadCount: 0 }
        }
      };
      await roomRef.set(chatRoom);
    } else {
      chatRoom = snapshot.val();
    }

    await roomRef.child(`participants/${currentUser.uid}`).update({ unreadCount: 0 });
    this.navCtrl.navigateForward(['/chat'], { state: { chatRoom } });
  }

  // ------------------- ACTION SHEET / MODAL -------------------
  openActionsMenu() { this.isActionSheetOpen = true; }
  openRatingModal() { this.isRatingModalOpen = true; }
  closeRatingModal() { this.isRatingModalOpen = false; this.selectedRating = 0; }

  // ------------------- RATING -------------------
  calculateAverageRating() {
    if (!this.product?.ratings || this.product.ratings.length === 0) {
      this.averageRating = 0;
      return;
    }
    const total = this.product.ratings.reduce((sum: any, r: any) => sum + r.value, 0);
    this.averageRating = total / this.product.ratings.length;
  }

  loadUserRating() {
    if (!this.product?.ratings || !this.currentUserId) return;
    const userRating = this.product.ratings.find((r: any) => r.userId === this.currentUserId);
    if (userRating) this.selectedRating = userRating.value;
  }

  selectRating(value: number) { this.selectedRating = value; }

  getRatingText(rating: number): string {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || '';
  }

  async openLoginModal() {
    const modal = await this.modalCtrl.create({
      component: AuthModalComponent,
      cssClass: 'login-bottom-sheet-modal',
      breakpoints: [0, 0.85],
      initialBreakpoint: 0.85,
      mode: 'ios',
      backdropDismiss: false,
      presentingElement: await this.modalCtrl.getTop(),
    });

    await modal.present();
    const { role } = await modal.onDidDismiss();

    if (role === 'success') this.commonService.notifyLoginSuccess();
  }

  async submitRating() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const uid = userData?.uid;
    const token = userData?.idToken;

    if (!uid || !token) {
      await this.openLoginModal();
      return;
    }
    if (this.selectedRating === 0) return;

    try {
      const userId = this.currentUserId;
      const userName = this.userData?.name;
      const time = Date.now();

      const existingRatingIndex =
        this.product.ratings?.findIndex((r: any) => r.userId === userId) ?? -1;

      if (existingRatingIndex >= 0) {
        this.product.ratings[existingRatingIndex].value = this.selectedRating;
        this.product.ratings[existingRatingIndex].createdAt = time;
      } else {
        this.product.ratings = this.product.ratings || [];
        this.product.ratings.push({ userId, userName, value: this.selectedRating, createdAt: time });
      }

      this.calculateAverageRating();

      const updates: any = {};
      updates[`products/${this.product.createdAt}/ratings`] = this.product.ratings;
      await this.db.database.ref().update(updates);

      this.closeRatingModal();
    } catch (error) {
      console.error('Error rating product:', error);
    }
  }

  getRatingCount(stars: number): number {
    if (!this.product?.ratings) return 0;
    return this.product.ratings.filter((r: any) => r.value === stars).length;
  }

  getRatingPercentage(stars: number): number {
    if (!this.product?.ratings || this.product.ratings.length === 0) return 0;
    const count = this.getRatingCount(stars);
    return (count / this.product.ratings.length) * 100;
  }

  // ------------------- COMMENTS -------------------
  async addComment() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const uid = userData?.uid;
    const token = userData?.idToken;

    if (!uid || !token) {
      await this.openLoginModal();
      return;
    }

    if (!this.newComment?.trim()) return;

    try {
      const comment: Comment = {
        userId: userData.uid,
        userName: userData.name || 'User',
        text: this.newComment.trim(),
        createdAt: Date.now()
      };

      this.product.comments = this.product.comments || [];
      this.product.comments.unshift(comment);

      const updates: any = {};
      updates[`products/${this.product.createdAt}/comments`] = this.product.comments;
      await this.db.database.ref().update(updates);

      this.newComment = '';
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  formatTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString();
  }

  async callUserData(phone: any) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  private getProductId(): string {
    return String(this.product?.createdAt);
  }

  async addFavorite() {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData?.uid) {
        await this.openLoginModal();
        return;
      }

      const uid = this.currentUserId;
      const productId = this.getProductId();

      const updates: any = {};
      updates[`/userFavorites/${uid}/${productId}`] = this.product;
      updates[`/productFavorites/${productId}/${uid}`] = true;

      await this.db.database.ref().update(updates);

      this.isFavorite = true;
      await this.presentToast('Added to favorites', 'success');
    } catch (error) {
      console.error('addFavorite error:', error);
      await this.presentToast('Failed to add favorite', 'danger');
    }
  }

  async removeFavorite() {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData?.uid) {
        await this.openLoginModal();
        return;
      }

      const uid = this.currentUserId;
      const productId = this.getProductId();

      const updates: any = {};
      updates[`/userFavorites/${uid}/${productId}`] = null;
      updates[`/productFavorites/${productId}/${uid}`] = null;

      await this.db.database.ref().update(updates);

      this.isFavorite = false;
      await this.presentToast('Removed from favorites', 'success');
    } catch (error) {
      console.error('removeFavorite error:', error);
      await this.presentToast('Failed to remove favorite', 'danger');
    }
  }

  async checkIfFavorite(): Promise<void> {
    try {
      if (!this.currentUserId || !this.product?.createdAt) {
        this.isFavorite = false;
        return;
      }

      const productId = this.getProductId();
      const ref = this.db.database.ref(`/userFavorites/${this.currentUserId}/${productId}`);
      const snap = await ref.get();
      this.isFavorite = snap.exists();
    } catch (e) {
      console.error('checkIfFavorite error:', e);
    }
  }

  // ✅ Share: link generate dynamically (localhost in dev, domain in prod)
  async shareProduct() {
    try {
      if (!this.product?.createdAt) return;

      const title = this.product?.title || 'Product';
      const price = this.product?.price ? `Price: ${this.product.price}` : '';
      const desc = this.product?.description || '';
      const phone = this.product?.contactPhone ? `Contact: ${this.product.contactPhone}` : '';

      const url = `https://apps.apple.com/us/app/%D8%B1%D8%AC%D9%8A%D8%B9/id6756187788/product-details/${this.product.createdAt}`;

      const text = [title, price, desc, phone, `Open: ${url}`].filter(Boolean).join('\n');

      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Share Product',
      });
    } catch (error) {
      console.error('shareProduct error:', error);
    }
  }
}
