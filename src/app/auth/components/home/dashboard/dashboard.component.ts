import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonSearchbar, NavController, ToastController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Product } from 'src/app/shared/common.interface';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// ✅ IMPORTANT: alias ref to avoid conflict with realtime db ref
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// ✅ Firebase Realtime Database
import { getDatabase, ref as dbRef, onValue, query, orderByChild } from 'firebase/database';

import { Subscription } from 'rxjs';
import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { UserService } from 'src/app/services/user.service';

// ✅ Categories list
import { ALL_AUCTION_CATEGORIES, CatItem } from 'src/app/shared/category-data';

interface Category {
  key: string;
  en: string;
  ar: string;
  icon: string;
  selected: boolean;
}

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  image: string;
  caption?: string;
  createdAt: number;
  seen?: boolean;
}

type SubOption = { key: string; en: string; ar: string };

const SECTION_ICON_MAP: Record<string, string> = {
  cars_section: 'car-outline',
  device_section: 'phone-portrait-outline',
  animals_birds_section: 'paw-outline',
  furniture_section: 'bed-outline',
  personal_accessories_section: 'bag-handle-outline',
  services_section: 'construct-outline',
  food_beverages_section: 'restaurant-outline',
  game_entertainment_section: 'game-controller-outline',
  hunting_tips_section: 'trail-sign-outline',
  cultivation_gardens_section: 'leaf-outline',
  programming_designs_section: 'code-slash-outline',
  parties_events_section: 'balloon-outline',
  library_arts_section: 'color-palette-outline',
  travel_tourism_section: 'airplane-outline',
  uncategorized_auction_section: 'ellipsis-horizontal-outline',
  missing_section: 'help-circle-outline',
  education_training_section: 'school-outline',
  financing_loans_section: 'cash-outline',
  anecdotes_traditions_section: 'chatbubbles-outline',
  projects_investments_section: 'briefcase-outline',
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedLanguage: string = 'en';
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  // ✅ Current user
  currentUserId: string = '';
  currentUserName: string = '';
  currentUserAvatar: string = '';

  // ✅ Products
  items: any[] = [];
  filteredItems: any[] = [];
  searchText: string = '';

  // ✅ Section filter
  selectedSectionKey: string = 'all';

  // ✅ Sub filter
  selectedSubCategoryKey: string = 'all';
  subCategoryOptions: SubOption[] = [];

  // ✅ UI
  isGrid: boolean = false;

  // ✅ Stories
  stories: Story[] = [];
  isAddStoryOpen = false;
  isStoryViewerOpen = false;
  activeStory: Story | null = null;
  storiesCollapsed = false;

  newStoryCaption: string = '';
  uploadingStory: boolean = false;

  pickedStoryPreview: string = '';
  pickedStoryBlob: Blob | null = null;

  private langSub?: Subscription;
  private openLoginSub?: Subscription;

  // ✅ Real-time unsubscribers
  private productsUnsub?: () => void;
  private storiesUnsub?: () => void;

  // ✅ Time-ago refresh
  nowTs: number = Date.now();
  private nowTimer: any;

  @ViewChild('searchbar', { static: false }) searchbar!: IonSearchbar;

  // ✅ Chips from ALL_AUCTION_CATEGORIES (+ Cars + Devices)
  categories: Category[] = [
    { key: 'all', ar: 'الكل', en: 'All', icon: 'grid-outline', selected: true },

    { key: 'cars_section', en: 'Cars', ar: 'السيارات', icon: SECTION_ICON_MAP['cars_section'], selected: false },
    { key: 'device_section', en: 'Devices', ar: 'الأجهزة', icon: SECTION_ICON_MAP['device_section'], selected: false },

    ...ALL_AUCTION_CATEGORIES.map((s) => ({
      key: s.key,
      en: s.en,
      ar: s.ar,
      icon: SECTION_ICON_MAP[s.key] || 'apps-outline',
      selected: false,
    })),
  ];

  // ✅ Optional legacy subCategories fallback
  subCategoriesMap: Record<string, Array<{ key: string; ar: string; en: string }>> = {
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
    ],
    furniture: [
      { key: 'majlis', ar: 'مجالس ومفروشات', en: 'Majlis & Upholstery' },
      { key: 'tables', ar: 'طاولات وكراسي', en: 'Tables & Chairs' },
    ],
    services: [
      { key: 'construction', ar: 'بناء ومقاولات', en: 'Construction & Contracting' },
      { key: 'ac', ar: 'تكييف وتبريد', en: 'AC & Cooling' },
    ],
    others: [{ key: 'misc', ar: 'متنوع', en: 'Miscellaneous' }],
  };

  constructor(
    private navCtrl: NavController,
    private translate: TranslateService,
    private userService: UserService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    // ✅ saved lang
    const savedLang = localStorage.getItem('lang');
    if (savedLang) this.selectedLanguage = savedLang;

    // ✅ Language updates
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.translate.currentLang;
      this.refreshSubCategoryOptionsFromData();
      this.applyFilters();
    });

    // ✅ Open login modal event
    // this.openLoginSub = this.userService.getOpenSubject.subscribe((value) => {
    //   if (value === 'login') this.openLoginModal();
    // });

    // ✅ Current user
    const userData = this.getLocalUserData();
    this.currentUserId = userData?.uid || userData?.userId || 'guest';
    this.currentUserName = userData?.name || userData?.full_name || 'You';
    this.currentUserAvatar = userData?.photoURL || userData?.avatar || userData?.profile || '';

    // ✅ realtime
    this.startProductsRealtime();
    this.startStoriesRealtime();

    // ✅ refresh time-ago every 30s
    this.nowTimer = setInterval(() => {
      this.ngZone.run(() => (this.nowTs = Date.now()));
    }, 30000);
  }

  ngOnDestroy() {
    if (this.productsUnsub) this.productsUnsub();
    if (this.storiesUnsub) this.storiesUnsub();

    if (this.nowTimer) clearInterval(this.nowTimer);

    if (this.langSub) this.langSub.unsubscribe();
    if (this.openLoginSub) this.openLoginSub.unsubscribe();
  }

  // -------------------- ✅ UI --------------------

  toggleLayout() {
    this.isGrid = !this.isGrid;
  }

  toggleStories() {
    this.storiesCollapsed = !this.storiesCollapsed;
  }

  // -------------------- ✅ FILTERS --------------------

  onCategorySelect(category: Category) {
    this.categories.forEach((c) => (c.selected = false));
    category.selected = true;

    this.selectedSectionKey = category.key;
    this.selectedSubCategoryKey = 'all';

    this.refreshSubCategoryOptionsFromData();
    this.applyFilters();
  }

  onSubCategorySelect(key: string) {
    this.selectedSubCategoryKey = key || 'all';
    this.applyFilters();
  }

  onSearch(event: any) {
    const value = event?.detail?.value ?? event?.target?.value ?? '';
    this.searchText = (value || '').toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    const sectionKey = (this.selectedSectionKey || 'all').toLowerCase();
    const subKey = (this.selectedSubCategoryKey || 'all').toLowerCase();

    this.filteredItems = this.items.filter((item: any) => {
      const itemSectionKey = String(item?.sectionKey || '').toLowerCase();
      const itemSubKey = String(this.getItemSubKey(item) || '').toLowerCase();

      const matchesSection = sectionKey === 'all' || itemSectionKey === sectionKey;
      const matchesSub = sectionKey === 'all' || subKey === 'all' || itemSubKey === subKey;

      const matchesSearch =
        !this.searchText ||
        (item.title || '').toLowerCase().includes(this.searchText) ||
        (item.description || '').toLowerCase().includes(this.searchText) ||
        (item.user?.name || '').toLowerCase().includes(this.searchText);

      return matchesSection && matchesSub && matchesSearch;
    });
  }

  // -------------------- ✅ PRODUCTS --------------------

  onCardClick(product: Product) {
    console.log("Product:--", product);
    const navigationExtras: NavigationExtras = { state: { product } };
    this.navCtrl.navigateForward([`/product-details/${product.id}`], navigationExtras);
  }

  // ✅ realtime products: newest on top
  startProductsRealtime() {
    const db = getDatabase();
    const productsRef = dbRef(db, 'approvedProducts');
    const q = query(productsRef, orderByChild('createdAt'));

    this.productsUnsub = onValue(
      q,
      (snapshot) => {
        const data = snapshot.val() || {};
        const products = Object.keys(data).map((id) => ({ id, ...data[id] }));

        const mapped = products.map((p: any) => this.mapApprovedProductToItem(p));

        // ✅ newest first
        mapped.sort((a: any, b: any) => Number(b.time || 0) - Number(a.time || 0));

        this.ngZone.run(() => {
          this.items = mapped;
          this.refreshSubCategoryOptionsFromData();
          this.applyFilters();
        });
      },
      (error) => {
        console.error('Realtime products error:', error);
        this.showToast('Realtime products error', 'danger');
      }
    );
  }

  private normalizeToSectionKey(raw: any): string {
    const k = String(raw || '').trim().toLowerCase();
    if (!k) return 'uncategorized_auction_section';
    if (k.endsWith('_section')) return k;

    const map: Record<string, string> = {
      cars: 'cars_section',
      electronics: 'device_section',
      devices: 'device_section',
      furniture: 'furniture_section',
      personal_items: 'personal_accessories_section',
      services: 'services_section',
      games: 'game_entertainment_section',
      others: 'uncategorized_auction_section',
      uncategorized: 'uncategorized_auction_section',
      jobs: 'services_section',

      animals: 'animals_birds_section',
      birds: 'animals_birds_section',
      food: 'food_beverages_section',
      beverages: 'food_beverages_section',
      hunting: 'hunting_tips_section',
      cultivation: 'cultivation_gardens_section',
      gardens: 'cultivation_gardens_section',
      programming: 'programming_designs_section',
      designs: 'programming_designs_section',
      parties: 'parties_events_section',
      events: 'parties_events_section',
      library: 'library_arts_section',
      arts: 'library_arts_section',
      travel: 'travel_tourism_section',
      tourism: 'travel_tourism_section',
      education: 'education_training_section',
      training: 'education_training_section',
      financing: 'financing_loans_section',
      loans: 'financing_loans_section',
      anecdotes: 'anecdotes_traditions_section',
      traditions: 'anecdotes_traditions_section',
      projects: 'projects_investments_section',
      investments: 'projects_investments_section',
      missing: 'missing_section',
    };

    return map[k] || 'uncategorized_auction_section';
  }

  private mapApprovedProductToItem(p: any): any {
    const sectionKey = this.normalizeToSectionKey(
      p?.selection?.section?.key || p?.sectionKey || p?.section
    );

    const title = (p?.title || p?.subject || '').toString();
    const description = (p?.description || p?.extraInfo || '').toString();

    // ✅ IMPORTANT: make sure each item has numeric timestamp
    const createdAt = Number(p?.createdAt || p?.time || Date.now());

    const provinceName = p?.provinceName || p?.location?.provinceName || null;
    const districtName = p?.districtName || p?.location?.districtName || null;

    const images = Array.isArray(p?.images) ? p.images : [];
    const image = p?.image || '';
    const user = p?.user || { name: p?.userName || 'User' };

    return {
      ...p,
      title,
      description,
      time: createdAt,
      provinceName,
      districtName,
      images,
      image,
      user,
      sectionKey,
    };
  }

  private getItemSubKey(item: any): string {
    return (
      item?.subCategory ||
      item?.sub_category ||
      item?.selection?.model?.key ||
      item?.selection?.brand?.key ||
      ''
    );
  }

  private sectionKeyToLegacyGroup(sectionKey: string): string {
    const k = (sectionKey || '').toLowerCase();
    if (k === 'cars_section') return 'cars';
    if (k === 'device_section') return 'electronics';
    if (k === 'furniture_section') return 'furniture';
    if (k === 'services_section') return 'services';
    if (k === 'uncategorized_auction_section') return 'others';
    return '';
  }

  private refreshSubCategoryOptionsFromData() {
    if (this.selectedSectionKey === 'all') {
      this.subCategoryOptions = [];
      return;
    }

    const sec = this.selectedSectionKey.toLowerCase();
    const list = this.items.filter((x: any) => (x.sectionKey || '').toLowerCase() === sec);

    const map = new Map<string, SubOption>();

    const legacy = this.sectionKeyToLegacyGroup(sec);
    const legacyList = legacy ? this.subCategoriesMap[legacy] || [] : [];

    // legacy
    for (const sc of legacyList) map.set(sc.key, { key: sc.key, en: sc.en, ar: sc.ar });

    // from data
    for (const item of list) {
      const key = this.getItemSubKey(item);
      if (!key) continue;

      const foundLegacy = legacyList.find((s) => s.key === key);
      if (foundLegacy) {
        map.set(key, { key, en: foundLegacy.en, ar: foundLegacy.ar });
        continue;
      }

      if (item?.selection?.model?.key === key) {
        map.set(key, {
          key,
          en: item.selection.model.en || key,
          ar: item.selection.model.ar || key,
        });
        continue;
      }

      if (item?.selection?.brand?.key === key) {
        map.set(key, {
          key,
          en: item.selection.brand.en || key,
          ar: item.selection.brand.ar || key,
        });
        continue;
      }

      map.set(key, { key, en: key, ar: key });
    }

    this.subCategoryOptions = Array.from(map.values());
    const lang = this.selectedLanguage === 'ar' ? 'ar' : 'en';
    this.subCategoryOptions.sort((a, b) => (a[lang] || '').localeCompare(b[lang] || ''));
  }

  // -------------------- ✅ STORIES --------------------

  startStoriesRealtime() {
    const db = getDatabase();
    const storiesRef = dbRef(db, 'stories');
    const q = query(storiesRef, orderByChild('createdAt'));

    this.storiesUnsub = onValue(
      q,
      (snapshot) => {
        const data = snapshot.val() || {};
        const seenMap = new Map(this.stories.map((s) => [s.id, !!s.seen]));

        const arr: Story[] = Object.keys(data).map((id) => ({
          id,
          ...data[id],
          seen: seenMap.get(id) ?? false,
        }));

        const last24h = Date.now() - 24 * 60 * 60 * 1000;
        const filtered = arr.filter((s) => (s.createdAt || 0) >= last24h);
        filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        this.ngZone.run(() => {
          this.stories = filtered;
        });
      },
      (error) => {
        console.error('Realtime stories error:', error);
        this.showToast('Realtime stories error', 'danger');
      }
    );
  }

  async openAddStoryModal() {
    const userData = this.getLocalUserData();
    const uid = userData?.uid;
    const token = userData?.idToken;

    if (!uid || !token) {
      this.userService.setOpenSubject = 'login';
      return;
    }
    this.isAddStoryOpen = true;
  }

  closeAddStoryModal() {
    this.isAddStoryOpen = false;
    this.newStoryCaption = '';
    this.pickedStoryPreview = '';
    this.pickedStoryBlob = null;
  }

  openStoryViewer(story: Story) {
    this.activeStory = story;
    this.isStoryViewerOpen = true;
    this.stories = this.stories.map((s) => (s.id === story.id ? { ...s, seen: true } : s));
  }

  closeStoryViewer() {
    this.isStoryViewerOpen = false;
    this.activeStory = null;
  }

  async pickStoryImage() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (!photo?.base64String) return;

      this.pickedStoryPreview = `data:image/jpeg;base64,${photo.base64String}`;
      this.pickedStoryBlob = this.base64ToBlob(photo.base64String, 'image/jpeg');
    } catch (e) {
      console.log('pickStoryImage cancelled', e);
    }
  }

  async addStory() {
    try {
      const userData = this.getLocalUserData();
      const uid = userData?.uid;

      if (!uid) {
        this.showToast('Please login to post story', 'danger');
        return;
      }

      if (!this.pickedStoryBlob) {
        this.showToast(
          this.selectedLanguage === 'en'
            ? 'Please pick an image from gallery'
            : 'رجاءً اختر صورة من المعرض',
          'danger'
        );
        return;
      }

      this.uploadingStory = true;

      const downloadURL = await this.uploadStoryImageToStorage(this.pickedStoryBlob);

      const payload = {
        userId: this.currentUserId,
        userName: this.currentUserName,
        userAvatar: this.currentUserAvatar,
        image: downloadURL,
        caption: (this.newStoryCaption || '').trim(),
        createdAt: Date.now(),
      };

      const ok = await this.saveStoryToFirebase(payload);
      if (!ok) return;

      this.showToast(this.selectedLanguage === 'en' ? 'Story posted!' : 'تم نشر القصة!', 'success');
      this.closeAddStoryModal();
      // ✅ realtime will update automatically
    } catch (err: any) {
      console.error(err);
      this.showToast(err?.message || 'Upload failed', 'danger');
    } finally {
      this.uploadingStory = false;
    }
  }

  private async uploadStoryImageToStorage(blob: Blob): Promise<string> {
    const storage = getStorage();
    const filePath = `stories/${this.currentUserId}/${Date.now()}.jpg`;
    const refObj = storageRef(storage, filePath);

    await uploadBytes(refObj, blob, { contentType: 'image/jpeg' });
    return await getDownloadURL(refObj);
  }

  async saveStoryToFirebase(payload: any): Promise<boolean> {
    try {
      const url = `${this.FIREBASE_DB_URL}/stories.json`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (err: any) {
      console.error('Save story error:', err);
      this.showToast(err?.message || 'Error saving story', 'danger');
      return false;
    }
  }

  // -------------------- ✅ TIME AGO --------------------

  getTimeAgo(ts: any): string {
    const t = Number(ts || 0);
    const isAr = this.selectedLanguage === 'ar';

    if (!t) return isAr ? 'غير معروف' : 'Unknown';

    const diffMs = Math.max(0, this.nowTs - t);
    const sec = Math.floor(diffMs / 1000);

    if (sec < 10) return isAr ? 'الآن' : 'Just now';
    if (sec < 60) return isAr ? `قبل ${sec} ثانية` : `${sec} sec ago`;

    const min = Math.floor(sec / 60);
    if (min < 60) return isAr ? `قبل ${min} دقيقة` : `${min} min ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return isAr ? `قبل ${hr} ساعة` : `${hr} hr ago`;

    const day = Math.floor(hr / 24);
    if (day === 1) return isAr ? 'أمس' : 'Yesterday';
    if (day < 7) return isAr ? `قبل ${day} أيام` : `${day} days ago`;

    // old posts show date
    const d = new Date(t);
    return isAr
      ? d.toLocaleDateString('ar', { year: 'numeric', month: 'short', day: '2-digit' })
      : d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: '2-digit' });
  }

  // -------------------- ✅ AUTH MODAL --------------------

  async openLoginModal() {
    const modal = await this.modalCtrl.create({
      component: AuthModalComponent,
      cssClass: 'auth-modal',
      mode: 'ios',
      backdropDismiss: true,
    });
    await modal.present();
  }

  // -------------------- ✅ Helpers --------------------

  private getLocalUserData(): any {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }

  getInitial(name?: string): string {
    if (!name) return '?';
    const cleaned = name.trim();
    if (!cleaned) return '?';
    const firstWord = cleaned.split(' ')[0];
    return (firstWord.charAt(0) || '?').toUpperCase();
  }

  private base64ToBlob(base64Data: string, contentType = 'image/jpeg'): Blob {
    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays as BlobPart[], { type: contentType });
  }
}
