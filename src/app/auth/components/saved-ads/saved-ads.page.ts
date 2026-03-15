import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Ad } from '../../../shared/models/marketplace.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FavoriteService } from '../../../services/favorite.service';
import { AdService } from '../../../services/ad.service';
import { CategoryService } from '../../../services/category.service';
import { StorageService } from '../../../services/storage.service';

interface FavoritesStats {
  total: number;
  byCategory: { [key: string]: number };
  recentlyAdded: number;
  soldAds: number;
}

@Component({
  selector: 'app-saved-ads',
  templateUrl: './saved-ads.page.html',
  styleUrls: ['./saved-ads.page.scss'],
})
export class SavedAdsPage implements OnInit, OnDestroy {
  favoriteAds: Ad[] = [];
  filteredAds: Ad[] = [];
  isLoading = false;
  isEmpty = false;
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery = '';
  selectedCity = '';
  selectedCategory = '';
  sortBy = 'newest';
  
  categories: any[] = [];
  cities = [
    'Riyadh',
    'Jeddah',
    'Dammam',
    'Mecca',
    'Medina',
    'Taif',
    'Abha',
    'Tabuk',
    'Yanbu',
    'Khobar'
  ];

  stats: FavoritesStats = {
    total: 0,
    byCategory: {},
    recentlyAdded: 0,
    soldAds: 0
  };

  showFilterPanel = false;
  private destroy$ = new Subject<void>();

  constructor(
    private favoriteService: FavoriteService,
    private adService: AdService,
    private categoryService: CategoryService,
    private storageService: StorageService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadFavorites();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load categories
   */
  loadCategories() {
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  /**
   * Load user's favorite ads
   */
  async loadFavorites() {
    try {
      this.isLoading = true;
      const userId = this.storageService.getItem('userData')?.uid;
      
      if (!userId) {
        this.isEmpty = true;
        return;
      }

      this.favoriteService.getUserFavorites(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((favs: any[]) => {
          this.favoriteAds = favs.map(f => f.ad || f) as Ad[];
          this.calculateStats();
          this.applyFilters();
          this.isEmpty = this.favoriteAds.length === 0;
          this.isLoading = false;
        });
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
      this.showToast('Error loading saved ads', 'danger');
      this.isLoading = false;
    }
  }

  /**
   * Calculate statistics from favorites
   */
  calculateStats() {
    this.stats.total = this.favoriteAds.length;
    this.stats.byCategory = {};
    this.stats.recentlyAdded = 0;
    this.stats.soldAds = 0;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    this.favoriteAds.forEach(ad => {
      // Count by category
      if (!this.stats.byCategory[ad.categoryId]) {
        this.stats.byCategory[ad.categoryId] = 0;
      }
      this.stats.byCategory[ad.categoryId]++;

      // Count recently added
      if (new Date(ad.createdAt) > sevenDaysAgo) {
        this.stats.recentlyAdded++;
      }

      // Count sold ads
      if (ad.status === 'sold') {
        this.stats.soldAds++;
      }
    });
  }

  /**
   * Apply filters and sorting
   */
  applyFilters() {
    this.filteredAds = this.favoriteAds.filter(ad => {
      // City filter
      if (this.selectedCity && ad.city !== this.selectedCity) {
        return false;
      }

      // Category filter
      if (this.selectedCategory && ad.categoryId !== this.selectedCategory) {
        return false;
      }

      // Search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        return ad.title.toLowerCase().includes(query) ||
               ad.description?.toLowerCase().includes(query);
      }

      return true;
    });

    // Apply sorting
    this.applySort();
  }

  /**
   * Apply sorting
   */
  applySort() {
    switch (this.sortBy) {
      case 'newest':
        this.filteredAds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        this.filteredAds.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'priceLow':
        this.filteredAds.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        this.filteredAds.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        this.filteredAds.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
    }
  }

  /**
   * Handle search input
   */
  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.applyFilters();
  }

  /**
   * Clear search
   */
  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  /**
   * Handle sort change
   */
  onSortChange(value: string) {
    this.sortBy = value;
    this.applyFilters();
  }

  /**
   * Toggle filter panel
   */
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  /**
   * Reset filters
   */
  resetFilters() {
    this.selectedCity = '';
    this.selectedCategory = '';
    this.sortBy = 'newest';
    this.searchQuery = '';
    this.showFilterPanel = false;
    this.applyFilters();
  }

  /**
   * Toggle view mode
   */
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Open ad details
   */
  openAdDetails(adId: string) {
    this.router.navigate(['/main/ad-details', adId]);
  }

  /**
   * Remove from favorites
   */
  async removeFavorite(ad: Ad, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    try {
      const userId = this.storageService.getItem('userData')?.uid;
      await this.favoriteService.removeFromFavorites(userId, ad.id);
      this.showToast('Removed from saved ads', 'success');
      this.loadFavorites();
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
      this.showToast('Error removing from saved ads', 'danger');
    }
  }

  /**
   * Remove all favorites with confirmation
   */
  async clearAllFavorites() {
    const alert = await this.alertController.create({
      header: 'Clear Saved Ads',
      message: `Are you sure you want to remove all ${this.favoriteAds.length} saved ads? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove All',
          role: 'destructive',
          handler: async () => {
            try {
              const userId = this.storageService.getItem('userData')?.uid;
              await this.favoriteService.clearAllFavorites(userId);
              this.showToast('All saved ads removed', 'success');
              this.loadFavorites();
            } catch (error) {
              console.error('❌ Error clearing favorites:', error);
              this.showToast('Error clearing saved ads', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Share ad
   */
  async shareAd(ad: Ad, event: Event) {
    event.stopPropagation();

    const adUrl = `${window.location.origin}/main/ad-details/${ad.id}`;
    const shareText = `Check out this amazing ${this.getCategoryName(ad.categoryId)} on Rajee:\n\n${ad.title}\n${ad.price} SAR\n\n${adUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: shareText,
          url: adUrl
        });
      } catch (error) {
        console.error('❌ Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        this.showToast('Copied to clipboard', 'success');
      } catch (error) {
        console.error('❌ Error copying to clipboard:', error);
        this.showToast('Error sharing ad', 'danger');
      }
    }
  }

  /**
   * Get category name
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name.en : 'Uncategorized';
  }

  /**
   * Format price
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price);
  }

  /**
   * Format date
   */
  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   * Show toast message
   */
  private showToast(message: string, color: string = 'primary') {
    this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'bottom'
    }).then(toast => toast.present());
  }

  /**
   * Handle refresh
   */
  onRefresh(event: any) {
    this.loadFavorites();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  }
}
