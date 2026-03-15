import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Ad } from '../../../shared/models/marketplace.models';
import { CategoryService } from '../../../services/category.service';
import { AdService } from '../../../services/ad.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  allCategories: Category[] = [];
  mainCategories: Category[] = [];
  filteredCategories: Category[] = [];
  
  categoryStats: { [key: string]: { count: number; recentAds: Ad[] } } = {};
  
  searchTerm: string = '';
  isLoading: boolean = false;
  selectedCategory: Category | null = null;
  
  // Sorting & filtering
  sortBy: string = 'displayOrder';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private categoryService: CategoryService,
    private adService: AdService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  /**
   * Load all categories
   */
  loadCategories() {
    this.isLoading = true;
    this.categoryService.getMainCategories().subscribe({
      next: (categories) => {
        this.mainCategories = categories;
        this.filteredCategories = categories;
        this.loadCategoryStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.toastService.showToast('Failed to load categories', 'danger' as any);
        this.isLoading = false;
      }
    });
  }

  /**
   * Load statistics for each category
   */
  private loadCategoryStats() {
    this.mainCategories.forEach(category => {
      this.adService.getCategoryAds(category.id!, 5).subscribe({
        next: (ads) => {
          this.categoryStats[category.id!] = {
            count: category.adCount || 0,
            recentAds: ads
          };
        },
        error: (err) => console.warn('Could not load ads for category:', category.id)
      });
    });
  }

  /**
   * Search categories
   */
  onSearch(event: any) {
    this.searchTerm = event.detail.value?.toLowerCase() || '';
    this.filterCategories();
  }

  /**
   * Filter categories based on search term
   */
  private filterCategories() {
    if (!this.searchTerm) {
      this.filteredCategories = this.mainCategories;
    } else {
      this.filteredCategories = this.mainCategories.filter(cat =>
        cat.name.en.toLowerCase().includes(this.searchTerm) ||
        cat.name.ar.includes(this.searchTerm)
      );
    }
    this.applySorting();
  }

  /**
   * Apply sorting
   */
  applySorting() {
    const sorted = [...this.filteredCategories];
    
    switch (this.sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.en.localeCompare(b.name.en));
        break;
      case 'adCount':
        sorted.sort((a, b) => (b.adCount || 0) - (a.adCount || 0));
        break;
      case 'displayOrder':
      default:
        sorted.sort((a, b) => a.displayOrder - b.displayOrder);
    }
    
    this.filteredCategories = sorted;
  }

  /**
   * Toggle sort
   */
  onSortChange(sort: string) {
    this.sortBy = sort;
    this.applySorting();
  }

  /**
   * Toggle view mode
   */
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Open category to browse ads
   */
  openCategory(category: Category) {
    this.selectedCategory = category;
    this.router.navigate(['/main/category-ads'], {
      queryParams: { categoryId: category.id, categoryName: category.name.en }
    });
  }

  /**
   * Toggle subcategories (if any)
   */
  toggleSubcategories(category: Category) {
    if (!category.parentCategoryId) {
      // Load subcategories
      this.categoryService.getSubCategories(category.id!).subscribe({
        next: (subs) => {
          if (subs.length > 0) {
            const idx = this.filteredCategories.indexOf(category);
            this.filteredCategories.splice(idx + 1, 0, ...subs);
          }
        }
      });
    }
  }

  /**
   * Refresh categories
   */
  onRefresh(event: any) {
    this.loadCategories();
    setTimeout(() => {
      event.detail.complete();
    }, 1000);
  }

  /**
   * Clear search
   */
  clearSearch() {
    this.searchTerm = '';
    this.filterCategories();
  }

  /**
   * Get ad count for display
   */
  getAdCount(categoryId: string): number {
    return this.categoryStats[categoryId]?.count || 0;
  }

  /**
   * Get category color (for styling)
   */
  getCategoryColor(category: Category): string {
    return category.color || '#1f2937';
  }

  /**
   * Navigate directly to post ad in category
   */
  postInCategory(category: Category, event: any) {
    event.stopPropagation();
    this.router.navigate(['/add-product'], {
      queryParams: { categoryId: category.id }
    });
  }
}
