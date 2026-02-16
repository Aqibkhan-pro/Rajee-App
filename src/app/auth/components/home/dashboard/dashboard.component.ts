import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonSearchbar, NavController, ToastController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Subject, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Product } from 'src/app/shared/common.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { AuthModalComponent } from '../../auth/auth-modal/auth-modal.component';
import { UserService } from 'src/app/services/user.service';
import { ALL_AUCTION_CATEGORIES } from 'src/app/shared/category-data';

import { HttpClient, HttpParams } from '@angular/common/http';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  // ✅ Pagination
  pageSize = 15;
  oldestCursor: number | null = null;
  hasMore = true;
  loadingMore = false;

  // ✅ Loading flags
  productsLoading = true;
  storiesLoading = true;

  get pageLoading(): boolean {
    return this.productsLoading || this.storiesLoading;
  }

  // ✅ Search (debounced)
  private search$ = new Subject<string>();
  searchText = '';

  // ✅ Section filter
  selectedSectionKey: string = 'all';
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

  skeletonCards = Array.from({ length: 8 });
  skeletonStories = Array.from({ length: 5 });

  private langSub?: Subscription;

  // ✅ Time-ago refresh
  nowTs: number = Date.now();
  private nowTimer: any;

  // ✅ scroll container
  @ViewChild('listScroll', { read: ElementRef }) listScroll!: ElementRef<HTMLElement>;
  @ViewChild('searchbar', { static: false }) searchbar!: IonSearchbar;

  // ✅ Chips
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

  // ✅ legacy map
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

  // scroll throttle
  private lastScrollCheck = 0;

  // =========================
  // ✅ CACHE (stale-while-revalidate)
  // =========================
  private CACHE_PRODUCTS_KEY = 'dash_products_v1';
  private CACHE_STORIES_KEY = 'dash_stories_v1';
  private CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  hasCachedProducts = false;
  hasCachedStories = false;

  private productsCacheWriteTimer: any;
  private storiesCacheWriteTimer: any;

  get hasCachedContent(): boolean {
    return this.hasCachedProducts || this.hasCachedStories;
  }

  constructor(
    private navCtrl: NavController,
    private translate: TranslateService,
    private userService: UserService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) this.selectedLanguage = savedLang;

    // ✅ debounce search
    this.search$
      .pipe(debounceTime(150), distinctUntilChanged())
      .subscribe((txt) => {
        this.searchText = (txt || '').toLowerCase();
        this.applyFilters();
        this.cdr.markForCheck();
      });

    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.selectedLanguage = this.translate.currentLang;
      this.refreshSubCategoryOptionsFromData(true);
      this.applyFilters();
      this.cdr.markForCheck();
    });

    const userData = this.getLocalUserData();
    this.currentUserId = userData?.uid || userData?.userId || 'guest';
    this.currentUserName = userData?.name || userData?.full_name || 'You';
    this.currentUserAvatar = userData?.photoURL || userData?.avatar || userData?.profile || '';

    // ✅ 1) Load cache FIRST (instant UI)
    this.restoreCacheInstant();

    // ✅ 2) Fetch from API (NO realtime)
    void this.fetchProductsFirstPage();
    void this.fetchStoriesFast();

    // ✅ refresh time-ago every 30s
    this.nowTimer = setInterval(() => {
      this.nowTs = Date.now();
      this.cdr.markForCheck();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.nowTimer) clearInterval(this.nowTimer);
    this.langSub?.unsubscribe();
    this.search$.complete();

    clearTimeout(this.productsCacheWriteTimer);
    clearTimeout(this.storiesCacheWriteTimer);
  }

  // -------------------- ✅ UI --------------------
  toggleLayout() {
    this.isGrid = !this.isGrid;
    this.cdr.markForCheck();
  }
  toggleStories() {
    this.storiesCollapsed = !this.storiesCollapsed;
    this.cdr.markForCheck();
  }

  // -------------------- ✅ FILTERS --------------------
  onCategorySelect(category: Category) {
    this.categories.forEach((c) => (c.selected = false));
    category.selected = true;

    this.selectedSectionKey = category.key;
    this.selectedSubCategoryKey = 'all';

    this.refreshSubCategoryOptionsFromData(true);
    this.applyFilters();
    this.cdr.markForCheck();
  }

  onSubCategorySelect(key: string) {
    this.selectedSubCategoryKey = key || 'all';
    this.applyFilters();
    this.cdr.markForCheck();
  }

  onSearch(event: any) {
    const value = event?.detail?.value ?? event?.target?.value ?? '';
    this.search$.next(value);
  }

  applyFilters() {
    const sectionKey = (this.selectedSectionKey || 'all').toLowerCase();
    const subKey = (this.selectedSubCategoryKey || 'all').toLowerCase();
    const q = this.searchText.trim();

    // ✅ Fast path: no filters applied
    if (sectionKey === 'all' && !q) {
      this.filteredItems = this.items;
      return;
    }

    this.filteredItems = this.items.filter((item: any) => {
      const itemSectionKey = String(item?.sectionKey || '').toLowerCase();
      if (sectionKey !== 'all' && itemSectionKey !== sectionKey) return false;

      if (sectionKey !== 'all' && subKey !== 'all') {
        const itemSubKey = String(this.getItemSubKey(item) || '').toLowerCase();
        if (itemSubKey !== subKey) return false;
      }

      if (!q) return true;

      return (
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.user?.name || '').toLowerCase().includes(q)
      );
    });
  }

  // -------------------- ✅ PRODUCTS --------------------

  onCardClick(product: Product) {
    const navigationExtras: NavigationExtras = { state: { product } };
    this.navCtrl.navigateForward([`/product-details/${(product as any).id}`], navigationExtras);
  }

  /** ✅ API token for private DB (optional) */
  private getAuthToken(): string {
    const u = this.getLocalUserData();
    return u?.idToken || u?.token || '';
  }

  /** ✅ Fetch first page via Firebase REST (NO realtime) */
  private async fetchProductsFirstPage() {
    if (this.items.length === 0) this.productsLoading = true;
    this.cdr.markForCheck();

    try {
      const token = this.getAuthToken();
      let params = new HttpParams()
        .set('orderBy', '"createdAt"')
        .set('limitToLast', String(this.pageSize));

      if (token) params = params.set('auth', token);

      const url = `${this.FIREBASE_DB_URL}/approvedProducts.json`;
      const data = await firstValueFrom(this.http.get<Record<string, any>>(url, { params }));

      const products = Object.entries(data || {}).map(([id, v]) => ({ id, ...(v as any) }));
      const mapped = products.map((p) => this.mapApprovedProductToItem(p));

      mapped.sort((a, b) => Number(b.time || 0) - Number(a.time || 0));
      const oldest = mapped.length ? Number(mapped[mapped.length - 1].time || 0) : null;

      this.items = mapped;
      this.oldestCursor = oldest;
      this.hasMore = mapped.length >= this.pageSize;

      this.refreshSubCategoryOptionsFromData(true);
      this.applyFilters();

      this.productsLoading = false;
      this.hasCachedProducts = this.items.length > 0;

      this.saveProductsCacheDebounced(this.items, this.oldestCursor);
    } catch (e) {
      console.error(e);
      this.productsLoading = false;
      this.showToast('Products fetch failed', 'danger');
    } finally {
      this.cdr.markForCheck();
    }
  }

  /** ✅ Load older page via REST (pagination) */
  async loadMoreProducts() {
    if (this.loadingMore || !this.hasMore || !this.oldestCursor) return;

    try {
      this.loadingMore = true;
      this.cdr.markForCheck();

      const token = this.getAuthToken();
      let params = new HttpParams()
        .set('orderBy', '"createdAt"')
        .set('endAt', String(this.oldestCursor - 1))
        .set('limitToLast', String(this.pageSize));

      if (token) params = params.set('auth', token);

      const url = `${this.FIREBASE_DB_URL}/approvedProducts.json`;
      const data = await firstValueFrom(this.http.get<Record<string, any>>(url, { params }));

      const products = Object.entries(data || {}).map(([id, v]) => ({ id, ...(v as any) }));
      const mapped = products.map((p) => this.mapApprovedProductToItem(p));
      mapped.sort((a, b) => Number(b.time || 0) - Number(a.time || 0));

      const byId = new Map<string, any>(this.items.map((x: any) => [String(x.id), x]));
      for (const it of mapped) byId.set(String(it.id), it);

      const merged = Array.from(byId.values());
      merged.sort((a, b) => Number(b.time || 0) - Number(a.time || 0));

      this.items = merged;
      this.oldestCursor = merged.length ? Number(merged[merged.length - 1].time || 0) : this.oldestCursor;
      this.hasMore = mapped.length >= this.pageSize;

      this.refreshSubCategoryOptionsFromData(true);
      this.applyFilters();

      this.saveProductsCacheDebounced(this.items, this.oldestCursor);
    } catch (e) {
      console.error(e);
      this.showToast('Load more failed', 'danger');
    } finally {
      this.loadingMore = false;
      this.cdr.markForCheck();
    }
  }

  /** ✅ auto-load more when near bottom */
  onListScroll() {
    const now = Date.now();
    if (now - this.lastScrollCheck < 250) return;
    this.lastScrollCheck = now;

    const el = this.listScroll?.nativeElement;
    if (!el || this.loadingMore || !this.hasMore) return;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 320;
    if (nearBottom) this.loadMoreProducts();
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
    const sectionKey = this.normalizeToSectionKey(p?.selection?.section?.key || p?.sectionKey || p?.section);

    const title = (p?.title || p?.subject || '').toString();
    const description = (p?.description || p?.extraInfo || '').toString();
    const createdAt = Number(p?.createdAt || p?.time || Date.now());

    const provinceName = p?.provinceName || p?.location?.provinceName || null;
    const districtName = p?.districtName || p?.location?.districtName || null;

    const images = Array.isArray(p?.images) ? [p.images[0]].filter(Boolean) : [];
    const image = p?.image || '';
    const user = p?.user || { name: p?.userName || 'User' };

    // ✅ small selection only (fast + cache-friendly)
    const selectionMini = {
      model: p?.selection?.model
        ? { key: p.selection.model.key, en: p.selection.model.en, ar: p.selection.model.ar }
        : null,
      brand: p?.selection?.brand
        ? { key: p.selection.brand.key, en: p.selection.brand.en, ar: p.selection.brand.ar }
        : null,
    };

    const subKey =
      p?.subCategory ||
      p?.sub_category ||
      selectionMini?.model?.key ||
      selectionMini?.brand?.key ||
      '';

    return {
      id: p?.id,
      title,
      description,
      time: createdAt,
      provinceName,
      districtName,
      images,
      image,
      user,
      sectionKey,
      price: p?.price,
      subCategory: p?.subCategory,
      sub_category: p?.sub_category,
      selectionMini,
      subKey,
    };
  }

  private getItemSubKey(item: any): string {
    return item?.subKey || item?.subCategory || item?.sub_category || item?.selectionMini?.model?.key || item?.selectionMini?.brand?.key || '';
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

  // ✅ Track last section + items count to avoid wrong “early return”
  private lastSubCategorySection: string = '';
  private lastSubCategoryItemsCount = 0;

  private refreshSubCategoryOptionsFromData(force = false) {
    if (this.selectedSectionKey === 'all') {
      this.subCategoryOptions = [];
      this.lastSubCategorySection = 'all';
      this.lastSubCategoryItemsCount = this.items.length;
      return;
    }

    if (
      !force &&
      this.lastSubCategorySection === this.selectedSectionKey &&
      this.lastSubCategoryItemsCount === this.items.length &&
      this.subCategoryOptions.length > 0
    ) {
      return;
    }

    const sec = this.selectedSectionKey.toLowerCase();
    const list = this.items.filter((x: any) => (x.sectionKey || '').toLowerCase() === sec);

    const map = new Map<string, SubOption>();
    const legacy = this.sectionKeyToLegacyGroup(sec);
    const legacyList = legacy ? this.subCategoriesMap[legacy] || [] : [];

    for (const sc of legacyList) map.set(sc.key, { key: sc.key, en: sc.en, ar: sc.ar });

    for (const item of list) {
      const key = this.getItemSubKey(item);
      if (!key) continue;

      const foundLegacy = legacyList.find((s) => s.key === key);
      if (foundLegacy) {
        map.set(key, { key, en: foundLegacy.en, ar: foundLegacy.ar });
        continue;
      }

      if (item?.selectionMini?.model?.key === key) {
        map.set(key, { key, en: item.selectionMini.model.en || key, ar: item.selectionMini.model.ar || key });
        continue;
      }

      if (item?.selectionMini?.brand?.key === key) {
        map.set(key, { key, en: item.selectionMini.brand.en || key, ar: item.selectionMini.brand.ar || key });
        continue;
      }

      map.set(key, { key, en: key, ar: key });
    }

    this.subCategoryOptions = Array.from(map.values());
    const lang = this.selectedLanguage === 'ar' ? 'ar' : 'en';
    this.subCategoryOptions.sort((a, b) => (a[lang] || '').localeCompare(b[lang] || ''));

    this.lastSubCategorySection = this.selectedSectionKey;
    this.lastSubCategoryItemsCount = this.items.length;
  }

  // -------------------- ✅ STORIES (API fetch) --------------------
  private async fetchStoriesFast() {
    if (this.stories.length === 0) this.storiesLoading = true;
    this.cdr.markForCheck();

    try {
      const token = this.getAuthToken();
      let params = new HttpParams()
        .set('orderBy', '"createdAt"')
        .set('limitToLast', '60');

      if (token) params = params.set('auth', token);

      const url = `${this.FIREBASE_DB_URL}/stories.json`;
      const data = await firstValueFrom(this.http.get<Record<string, any>>(url, { params }));

      const seenMap = new Map(this.stories.map((s) => [s.id, !!s.seen]));

      const arr: Story[] = Object.entries(data || {}).map(([id, v]) => ({
        id,
        ...(v as any),
        seen: seenMap.get(id) ?? false,
      }));

      const last24h = Date.now() - 24 * 60 * 60 * 1000;
      const filtered = arr.filter((s) => Number(s.createdAt || 0) >= last24h);
      filtered.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));

      this.stories = filtered;
      this.storiesLoading = false;
      this.hasCachedStories = this.stories.length > 0;

      this.saveStoriesCacheDebounced(this.stories);
    } catch (e) {
      console.error(e);
      this.storiesLoading = false;
      this.showToast('Stories fetch failed', 'danger');
    } finally {
      this.cdr.markForCheck();
    }
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
    this.cdr.markForCheck();
  }

  closeAddStoryModal() {
    this.isAddStoryOpen = false;
    this.newStoryCaption = '';
    this.pickedStoryPreview = '';
    this.pickedStoryBlob = null;
    this.cdr.markForCheck();
  }

  openStoryViewer(story: Story) {
    this.activeStory = story;
    this.isStoryViewerOpen = true;
    this.stories = this.stories.map((s) => (s.id === story.id ? { ...s, seen: true } : s));
    this.saveStoriesCacheDebounced(this.stories);
    this.cdr.markForCheck();
  }

  closeStoryViewer() {
    this.isStoryViewerOpen = false;
    this.activeStory = null;
    this.cdr.markForCheck();
  }

  /** ✅ FAST picker (no Base64) */
  async pickStoryImage() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      if (!photo?.webPath) return;

      this.pickedStoryPreview = photo.webPath;
      const resp = await fetch(photo.webPath);
      this.pickedStoryBlob = await resp.blob();

      this.cdr.markForCheck();
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
          this.selectedLanguage === 'en' ? 'Please pick an image from gallery' : 'رجاءً اختر صورة من المعرض',
          'danger'
        );
        return;
      }

      this.uploadingStory = true;
      this.cdr.markForCheck();

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

      // ✅ refresh stories quickly after post
      void this.fetchStoriesFast();
    } catch (err: any) {
      console.error(err);
      this.showToast(err?.message || 'Upload failed', 'danger');
    } finally {
      this.uploadingStory = false;
      this.cdr.markForCheck();
    }
  }

  private async uploadStoryImageToStorage(blob: Blob): Promise<string> {
    const storage = getStorage();
    const filePath = `stories/${this.currentUserId}/${Date.now()}.jpg`;
    const refObj = storageRef(storage, filePath);
    await uploadBytes(refObj, blob, { contentType: blob.type || 'image/jpeg' });
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

    const d = new Date(t);
    return isAr
      ? d.toLocaleDateString('ar', { year: 'numeric', month: 'short', day: '2-digit' })
      : d.toLocaleDateString('en', { year: 'numeric', month: 'short', day: '2-digit' });
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

  // -------------------- ✅ trackBy --------------------
  trackByItemId = (_: number, x: any) => x?.id;
  trackByStoryId = (_: number, x: any) => x?.id;
  trackByCategoryKey = (_: number, x: any) => x?.key;
  trackBySubKey = (_: number, x: any) => x?.key;

  // =========================
  // ✅ CACHE METHODS (FULL)
  // =========================

  private restoreCacheInstant() {
    // ✅ PRODUCTS
    try {
      const raw = localStorage.getItem(this.CACHE_PRODUCTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const ts = Number(parsed?.ts || 0);
        const items = parsed?.items;

        if (Array.isArray(items) && items.length) {
          this.items = items;
          this.oldestCursor =
            parsed?.oldestCursor ??
            (this.items.length ? Number(this.items[this.items.length - 1]?.time || 0) : null);

          this.hasMore = this.items.length >= this.pageSize;
          this.productsLoading = false;
          this.hasCachedProducts = true;

          this.refreshSubCategoryOptionsFromData(true);
          this.applyFilters();
        } else {
          this.hasCachedProducts = false;
        }

        // TTL optional (keep cache is fine)
        if (ts && Date.now() - ts > this.CACHE_TTL) {
          // optional clear:
          // localStorage.removeItem(this.CACHE_PRODUCTS_KEY);
        }
      }
    } catch {}

    // ✅ STORIES
    try {
      const raw = localStorage.getItem(this.CACHE_STORIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const ts = Number(parsed?.ts || 0);
        const stories = parsed?.stories;

        if (Array.isArray(stories) && stories.length) {
          this.stories = stories;
          this.storiesLoading = false;
          this.hasCachedStories = true;
        } else {
          this.hasCachedStories = false;
        }

        if (ts && Date.now() - ts > this.CACHE_TTL) {
          // optional clear:
          // localStorage.removeItem(this.CACHE_STORIES_KEY);
        }
      }
    } catch {}

    this.cdr.markForCheck();
  }

  private saveProductsCacheDebounced(items: any[], oldestCursor: number | null) {
    clearTimeout(this.productsCacheWriteTimer);
    this.productsCacheWriteTimer = setTimeout(() => {
      try {
        const minimal = (items || []).slice(0, 180).map((x: any) => ({
          id: x.id,
          title: x.title,
          description: x.description,
          time: x.time,
          price: x.price,
          images: Array.isArray(x.images) ? x.images.slice(0, 1) : [],
          image: x.image,
          user: x.user,
          provinceName: x.provinceName,
          districtName: x.districtName,
          sectionKey: x.sectionKey,
          subCategory: x.subCategory,
          sub_category: x.sub_category,
          subKey: x.subKey,
          selectionMini: x.selectionMini || null,
        }));

        localStorage.setItem(
          this.CACHE_PRODUCTS_KEY,
          JSON.stringify({ ts: Date.now(), items: minimal, oldestCursor })
        );
        this.hasCachedProducts = minimal.length > 0;
      } catch {}
    }, 400);
  }

  private saveStoriesCacheDebounced(stories: Story[]) {
    clearTimeout(this.storiesCacheWriteTimer);
    this.storiesCacheWriteTimer = setTimeout(() => {
      try {
        const minimal = (stories || []).slice(0, 60);
        localStorage.setItem(
          this.CACHE_STORIES_KEY,
          JSON.stringify({ ts: Date.now(), stories: minimal })
        );
        this.hasCachedStories = minimal.length > 0;
      } catch {}
    }, 400);
  }
}