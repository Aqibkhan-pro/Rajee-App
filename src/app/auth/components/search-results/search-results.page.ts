import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad, Category } from '../../../shared/models/marketplace.models';
import { AdService, AdFilter, AdSearchResult } from '../../../services/ad.service';
import { CategoryService } from '../../../services/category.service';
import { FavoriteService } from '../../../services/favorite.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';
import { ToastType } from '../../../shared/enums/common.enum';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.page.html',
  styleUrls: ['./search-results.page.scss'],
})
export class SearchResultsPage implements OnInit {
  searchResults: Ad[] = [];
  filteredResults: Ad[] = [];
  
  // Filter options
  filters: AdFilter = {};
  categories: Category[] = [];
  cities: string[] = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'Tabuk', 'Abha', 'Taif', 'Hail', 'Najran'];
  
  // UI state
  isLoading: boolean = false;
  isFilterOpen: boolean = false;
  viewMode: 'grid' | 'list' = 'list';
  sortBy: string = 'newest';
  
  // Favorite tracking
  favoriteIds: Set<string> = new Set();
  currentUserId: string | null = null;
  
  // Pagination
  pageSize: number = 20;
  currentPage: number = 1;
  totalCount: number = 0;
  hasMore: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adService: AdService,
    private categoryService: CategoryService,
    private favoriteService: FavoriteService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {
    this.currentUserId = this.storageService.getItem('userData')?.uid || null;
  }

  ngOnInit() {
    this.loadCategories();
    this.initializeFromQueryParams();
  }

  /**
   * Load categories for filter
   */
  private loadCategories() {
    this.categoryService.getMainCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  /**
   * Initialize search from query parameters
   */
  private initializeFromQueryParams() {
    this.route.queryParams.subscribe(params => {
      // Set filters from query params
      if (params['q']) this.filters.searchTerm = params['q'];
      if (params['categoryId']) this.filters.categoryId = params['categoryId'];
      if (params['city']) this.filters.city = params['city'];
      if (params['priceMin']) this.filters.priceMin = parseFloat(params['priceMin']);
      if (params['priceMax']) this.filters.priceMax = parseFloat(params['priceMax']);
      
      // Execute search
      this.performSearch();
    });
  }

  /**
   * Perform search with current filters
   */
  performSearch() {
    this.isLoading = true;
    this.filters.sortBy = this.sortBy as any;
    this.filters.limit = this.pageSize;

    this.adService.advancedSearch(this.filters).subscribe({
      next: (result: AdSearchResult) => {
        this.searchResults = result.ads;
        this.filteredResults = result.ads;
        this.totalCount = result.totalCount;
        this.hasMore = result.hasMore;
        
        // Load favorite statuses
        if (this.currentUserId) {
          this.loadFavoriteStatuses();
        }
        
        this.isLoading = false;

        if (result.ads.length === 0) {
          this.toastService.showToast('No ads found matching your criteria', ToastType.WARNING);
        }
      },
      error: (err) => {
        console.error('Search error:', err);
        this.toastService.showToast('Search failed. Please try again.', ToastType.ERROR);
        this.isLoading = false;
      }
    });
  }

  /**
   * Load favorite statuses for all results
   */
  private loadFavoriteStatuses() {
    if (!this.currentUserId) return;

    this.searchResults.forEach(ad => {
      this.favoriteService.isAdInFavorites(this.currentUserId!, ad.id).subscribe({
        next: (isFav) => {
          if (isFav) {
            this.favoriteIds.add(ad.id);
          }
        }
      });
    });
  }

  /**
   * Update results with new sort
   */
  onSortChange(sort: string) {
    this.sortBy = sort;
    this.performSearch();
  }

  /**
   * Toggle filter panel
   */
  toggleFilters() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  /**
   * Apply filters
   */
  applyFilters() {
    this.currentPage = 1;
    this.performSearch();
    this.isFilterOpen = false;
  }

  /**
   * Reset filters
   */
  resetFilters() {
    this.filters = {};
    this.performSearch();
    this.isFilterOpen = false;
  }

  /**
   * Toggle view mode
   */
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Toggle favorite
   */
  async toggleFavorite(ad: Ad, event: any) {
    event.stopPropagation();

    if (!this.currentUserId) {
      this.toastService.showToast('Please login to save favorites', ToastType.WARNING);
      this.router.navigate(['/auth/login']);
      return;
    }

    try {
      const isFavorited = await this.favoriteService.toggleFavorite(this.currentUserId, ad);
      
      if (isFavorited) {
        this.favoriteIds.add(ad.id);
        this.toastService.showToast('Added to favorites', ToastType.SUCCESS);
      } else {
        this.favoriteIds.delete(ad.id);
        this.toastService.showToast('Removed from favorites', ToastType.WARNING);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      this.toastService.showToast('Failed to update favorite', ToastType.ERROR);
    }
  }

  /**
   * Check if ad is favorited
   */
  isFavorited(adId: string): boolean {
    return this.favoriteIds.has(adId);
  }

  /**
   * Open ad details
   */
  openAdDetails(adId: string) {
    this.router.navigate(['/product-details', adId]);
  }

  /**
   * Share ad
   */
  shareAd(ad: Ad, event: any) {
    event.stopPropagation();
    
    const shareText = `Check out this ad: ${ad.title} - ${ad.price} SAR`;
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: shareText,
        url: window.location.href
      }).catch(err => console.log('Share error:', err));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      this.toastService.showToast('Ad link copied to clipboard', ToastType.SUCCESS);
    }
  }

  /**
   * Load more results (pagination)
   */
  loadMore() {
    if (this.hasMore) {
      this.currentPage++;
      this.filters.limit = this.pageSize * this.currentPage;
      this.performSearch();
    }
  }

  /**
   * Refresh search
   */
  onRefresh(event: any) {
    this.currentPage = 1;
    this.performSearch();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  }

  /**
   * Clear search
   */
  clearSearch() {
    this.filters = {};
    this.performSearch();
  }

  /**
   * Get category name by ID
   */
  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const cat = this.categories.find(c => c.id === categoryId);
    return cat?.name.en || '';
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US').format(price);
  }

  /**
   * Format date for display
   */
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
}
