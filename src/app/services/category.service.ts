/**
 * Category Service
 * Handles category management: read, create, update, delete
 */

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Category } from '../shared/models/marketplace.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCache$ = new BehaviorSubject<Category[]>([]);

  constructor(private db: AngularFireDatabase) {
    this.loadCategories();
  }

  /**
   * Load all categories
   */
  private loadCategories(): void {
    this.getAllCategories()
      .subscribe(categories => {
        this.categoriesCache$.next(categories);
      });
  }

  /**
   * Get all categories (main + subcategories)
   */
  getAllCategories(): Observable<Category[]> {
    return this.db.list<Category>('categories').valueChanges().pipe(
      map(categories => categories.sort((a, b) => a.displayOrder - b.displayOrder)),
      catchError(err => {
        console.error('Error fetching categories:', err);
        return Promise.resolve([]);
      })
    );
  }

  /**
   * Get main categories only
   */
  getMainCategories(): Observable<Category[]> {
    return this.getAllCategories().pipe(
      map(categories => categories.filter(cat => !cat.parentCategoryId))
    );
  }

  /**
   * Get subcategories for a main category
   */
  getSubCategories(parentCategoryId: string): Observable<Category[]> {
    return this.getAllCategories().pipe(
      map(categories => categories.filter(cat => cat.parentCategoryId === parentCategoryId))
    );
  }

  /**
   * Get category by ID
   */
  getCategoryById(categoryId: string): Observable<Category | null> {
    return this.db.object<Category>(`categories/${categoryId}`)
      .valueChanges()
      .pipe(
        map(cat => cat || null),
        catchError(err => {
          console.error('Error fetching category:', err);
          return Promise.resolve(null);
        })
      );
  }

  /**
   * Create new category (admin only)
   */
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    try {
      const newCatRef = this.db.list('categories').push({
        ...categoryData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        adCount: 0,
        enabled: true,
        requiresApproval: false
      });

      const id = newCatRef.key;
      console.log('✅ Category created:', id);
      return { id, ...categoryData } as Category;
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category (admin only)
   */
  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    try {
      await this.db.object(`categories/${categoryId}`).update({
        ...updates,
        updatedAt: Date.now()
      });
      console.log('✅ Category updated');
      this.loadCategories(); // Refresh cache
    } catch (error) {
      console.error('❌ Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category (admin only)
   */
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await this.db.object(`categories/${categoryId}`).remove();
      console.log('✅ Category deleted');
      this.loadCategories(); // Refresh cache
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      throw error;
    }
  }

  /**
   * Get cached categories
   */
  getCachedCategories(): Observable<Category[]> {
    return this.categoriesCache$.asObservable();
  }

  /**
   * Search categories by name
   */
  searchCategories(searchTerm: string, language: 'ar' | 'en' = 'en'): Observable<Category[]> {
    return this.getAllCategories().pipe(
      map(categories => {
        const term = searchTerm.toLowerCase();
        return categories.filter(cat => {
          const name = language === 'ar' ? cat.name.ar : cat.name.en;
          return name.toLowerCase().includes(term);
        });
      })
    );
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(categoryId: string): Promise<{
    totalAds: number;
    activeAds: number;
    soldAds: number;
  }> {
    try {
      const category = await this.getCategoryById(categoryId).toPromise();
      if (!category) {
        return { totalAds: 0, activeAds: 0, soldAds: 0 };
      }

      // This would typically be a more efficient aggregation query
      return {
        totalAds: category.adCount || 0,
        activeAds: category.adCount || 0,
        soldAds: 0
      };
    } catch (error) {
      console.error('Error getting category stats:', error);
      return { totalAds: 0, activeAds: 0, soldAds: 0 };
    }
  }

  /**
   * Bulk create categories
   */
  async bulkCreateCategories(categories: Partial<Category>[]): Promise<void> {
    try {
      for (const cat of categories) {
        await this.createCategory(cat);
      }
      console.log('✅ Categories created in bulk');
      this.loadCategories(); // Refresh cache
    } catch (error) {
      console.error('❌ Error bulk creating categories:', error);
      throw error;
    }
  }
}

/**
 * Default categories for Rajee (similar to Haraj)
 */
export const DEFAULT_CATEGORIES: Partial<Category>[] = [
  {
    id: 'cars',
    name: { ar: 'السيارات', en: 'Cars' },
    icon: 'car-icon',
    displayOrder: 1,
    customFields: [
      { fieldName: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true },
      { fieldName: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true },
      { fieldName: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true },
      { fieldName: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true,
        options: [
          { ar: 'جديدة', en: 'New' },
          { ar: 'مستعملة', en: 'Used' },
          { ar: 'متضررة', en: 'Damaged' }
        ]
      }
    ]
  },
  {
    id: 'realestate',
    name: { ar: 'العقارات', en: 'Real Estate' },
    icon: 'home-icon',
    displayOrder: 2
  },
  {
    id: 'electronics',
    name: { ar: 'الأجهزة الإلكترونية', en: 'Electronics' },
    icon: 'phone-icon',
    displayOrder: 3
  },
  {
    id: 'furniture',
    name: { ar: 'الأثاث', en: 'Furniture' },
    icon: 'furniture-icon',
    displayOrder: 4
  },
  {
    id: 'animals',
    name: { ar: 'الحيوانات والطيور', en: 'Animals & Birds' },
    icon: 'pet-icon',
    displayOrder: 5
  },
  {
    id: 'jobs',
    name: { ar: 'الوظائف', en: 'Jobs' },
    icon: 'job-icon',
    displayOrder: 6
  },
  {
    id: 'services',
    name: { ar: 'الخدمات', en: 'Services' },
    icon: 'services-icon',
    displayOrder: 7
  },
  {
    id: 'miscellaneous',
    name: { ar: 'متفرقات', en: 'Miscellaneous' },
    icon: 'misc-icon',
    displayOrder: 8
  }
];
