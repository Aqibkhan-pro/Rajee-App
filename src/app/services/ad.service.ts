/**
 * Ad/Listing Service
 * Handles all ad-related operations: create, read, update, delete, search, filter, sort
 */

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';
import { Ad } from '../shared/models/marketplace.models';
import { StorageService } from '../services/storage.service';

export interface AdFilter {
  categoryId?: string;
  city?: string;
  province?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: string;
  dealType?: string;
  searchTerm?: string;
  sortBy?: 'newest' | 'oldest' | 'priceLow' | 'priceHigh' | 'popular';
  status?: string;
  isFeatured?: boolean;
  limit?: number;
}

export interface AdSearchResult {
  ads: Ad[];
  totalCount: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private baseUrl = 'https://rajee-198a5-default-rtdb.firebaseio.com';
  private idToken: string | null = null;
  private adsCache$ = new BehaviorSubject<Ad[]>([]);
  private filteredAds$ = new BehaviorSubject<Ad[]>([]);

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private storageService: StorageService
  ) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const userData = this.storageService.getItem('userData');
    this.idToken = userData?.idToken;
  }

  /**
   * Create a new ad
   */
  async createAd(adData: Partial<Ad>): Promise<Ad> {
    try {
      const newAdRef = this.db.list('ads').push({
        ...adData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'pendingApproval',
        viewCount: 0,
        favoriteCount: 0,
        shareCount: 0,
        renewalCount: 0,
        isReported: false,
        reportCount: 0
      });

      const id = newAdRef.key;
      console.log('✅ Ad created successfully:', id);
      return { id, ...adData, createdAt: Date.now(), updatedAt: Date.now(), status: 'pendingApproval', viewCount: 0, favoriteCount: 0, shareCount: 0, renewalCount: 0, isReported: false, reportCount: 0 } as any as Ad;
    } catch (error) {
      console.error('❌ Error creating ad:', error);
      throw error;
    }
  }

  /**
   * Get single ad by ID
   */
  getAdById(adId: string): Observable<Ad | null> {
    return this.db.object<Ad>(`ads/${adId}`).valueChanges().pipe(
      map(ad => ad ? { ...ad, id: adId } : null),
      catchError(err => {
        console.error('Error fetching ad:', err);
        return Promise.resolve(null);
      })
    );
  }

  /**
   * Get all active ads (for home page)
   */
  getAllActiveAds(limit: number = 100): Observable<Ad[]> {
    return this.db.list<Ad>('ads', ref =>
      ref.orderByChild('status')
        .equalTo('active')
    ).valueChanges().pipe(
      map(ads => ads.slice(0, limit)),
      tap(ads => this.adsCache$.next(ads))
    );
  }

  /**
   * Get user's ads
   */
  getUserAds(userId: string): Observable<Ad[]> {
    return this.db.list<Ad>('ads', ref =>
      ref.orderByChild('uid').equalTo(userId)
    ).valueChanges();
  }

  /**
   * Search ads with filter
   */
  searchAds(filters: AdFilter): Observable<Ad[]> {
    let query = this.db.list<Ad>('ads', ref => {
      let ref2 = ref.orderByChild('status').equalTo('active');
      return ref2;
    }).valueChanges();

    return query.pipe(
      map(ads => this.applyFilters(ads, filters)),
      map(ads => this.applySorting(ads, filters.sortBy || 'newest')),
      tap(ads => this.filteredAds$.next(ads))
    );
  }

  /**
   * Advanced search with multiple criteria
   */
  advancedSearch(filters: AdFilter): Observable<AdSearchResult> {
    return this.getAllActiveAds(1000).pipe(
      map(ads => {
        const filtered = this.applyFilters(ads, filters);
        const sorted = this.applySorting(filtered, filters.sortBy || 'newest');
        const limited = sorted.slice(0, filters.limit || 50);

        return {
          ads: limited,
          totalCount: filtered.length,
          hasMore: filtered.length > (filters.limit || 50)
        };
      })
    );
  }

  /**
   * Get featured ads
   */
  getFeaturedAds(limit: number = 10): Observable<Ad[]> {
    return this.db.list<Ad>('ads', ref =>
      ref.orderByChild('isFeatured').equalTo(true)
    ).valueChanges().pipe(
      map(ads => ads
        .filter(ad => ad.status === 'active')
        .sort((a, b) => (b.featuredUntil || 0) - (a.featuredUntil || 0))
        .slice(0, limit)
      )
    );
  }

  /**
   * Get category ads
   */
  getCategoryAds(categoryId: string, limit: number = 50): Observable<Ad[]> {
    return this.db.list<Ad>('ads').valueChanges().pipe(
      map(ads => ads
        .filter(ad => ad.categoryId === categoryId && ad.status === 'active')
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit)
      )
    );
  }

  /**
   * Get city ads
   */
  getCityAds(city: string, limit: number = 50): Observable<Ad[]> {
    return this.db.list<Ad>('ads').valueChanges().pipe(
      map(ads => ads
        .filter(ad => ad.city === city && ad.status === 'active')
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit)
      )
    );
  }

  /**
   * Update ad
   */
  async updateAd(adId: string, updates: Partial<Ad>): Promise<void> {
    try {
      await this.db.object(`ads/${adId}`).update({
        ...updates,
        updatedAt: Date.now()
      });
      console.log('✅ Ad updated successfully');
    } catch (error) {
      console.error('❌ Error updating ad:', error);
      throw error;
    }
  }

  /**
   * Delete ad
   */
  async deleteAd(adId: string): Promise<void> {
    try {
      // Delete images from storage
      const ad = await this.getAdById(adId).pipe(take(1)).toPromise();
      if (ad && ad.images) {
        for (const imageUrl of ad.images) {
          try {
            const ref = this.storage.refFromURL(imageUrl);
            await ref.delete().toPromise();
          } catch (err) {
            console.warn('Could not delete image:', imageUrl);
          }
        }
      }

      // Delete ad from database
      await this.db.object(`ads/${adId}`).remove();
      console.log('✅ Ad deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting ad:', error);
      throw error;
    }
  }

  /**
   * Renew ad (extend expiration date)
   */
  async renewAd(adId: string): Promise<void> {
    try {
      const thirtyDaysFromNow = Date.now() + (30 * 24 * 60 * 60 * 1000);
      await this.updateAd(adId, {
        expiresAt: thirtyDaysFromNow,
        renewalCount: null as any, // Will increment
        lastRenewedAt: Date.now()
      });
      console.log('✅ Ad renewed successfully');
    } catch (error) {
      console.error('❌ Error renewing ad:', error);
      throw error;
    }
  }

  /**
   * Promote ad to featured
   */
  async promoteAd(adId: string, durationDays: number = 7): Promise<void> {
    try {
      const until = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
      await this.updateAd(adId, {
        isFeatured: true,
        featuredUntil: until
      });
      console.log('✅ Ad promoted successfully');
    } catch (error) {
      console.error('❌ Error promoting ad:', error);
      throw error;
    }
  }

  /**
   * Increment view count
   */
  async incrementViewCount(adId: string): Promise<void> {
    try {
      const ad = await this.getAdById(adId).pipe(take(1)).toPromise();
      if (ad) {
        const newCount = (ad.viewCount || 0) + 1;
        await this.db.object(`ads/${adId}/viewCount`).set(newCount);
      }
    } catch (error) {
      console.warn('Could not increment view count:', error);
    }
  }

  /**
   * Mark ad as sold
   */
  async markAsSold(adId: string, buyerId?: string): Promise<void> {
    try {
      await this.updateAd(adId, {
        status: 'sold',
        isSold: true,
        soldAt: Date.now(),
        soldTo: buyerId
      });
      console.log('✅ Ad marked as sold');
    } catch (error) {
      console.error('❌ Error marking ad as sold:', error);
      throw error;
    }
  }

  /**
   * Upload ad images
   */
  async uploadAdImages(adId: string, files: File[]): Promise<string[]> {
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const path = `ads/${adId}/${fileName}`;
        
        const uploadTask = this.storage.upload(path, file);
        const downloadUrl = await uploadTask.snapshotChanges()
          .pipe(
            switchMap(snapshot => this.storage.ref(path).getDownloadURL()),
            take(1)
          ).toPromise();

        if (downloadUrl) {
          uploadedUrls.push(downloadUrl);
        }
      }

      console.log('✅ Images uploaded successfully:', uploadedUrls.length);
      return uploadedUrls;
    } catch (error) {
      console.error('❌ Error uploading images:', error);
      throw error;
    }
  }

  /**
   * Apply filters to ads
   */
  private applyFilters(ads: Ad[], filters: AdFilter): Ad[] {
    return ads.filter(ad => {
      // Category filter
      if (filters.categoryId && ad.categoryId !== filters.categoryId) {
        return false;
      }

      // City filter
      if (filters.city && ad.city !== filters.city) {
        return false;
      }

      // Province filter
      if (filters.province && ad.province !== filters.province) {
        return false;
      }

      // Price range filter
      if (filters.priceMin && ad.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && ad.price > filters.priceMax) {
        return false;
      }

      // Deal type filter
      if (filters.dealType && ad.dealType !== filters.dealType) {
        return false;
      }

      // Search term (searches title and description)
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (!ad.title.toLowerCase().includes(term) &&
            !ad.description.toLowerCase().includes(term)) {
          return false;
        }
      }

      // Featured filter
      if (filters.isFeatured !== undefined && ad.isFeatured !== filters.isFeatured) {
        return false;
      }

      return true;
    });
  }

  /**
   * Apply sorting to ads
   */
  private applySorting(ads: Ad[], sortBy: string): Ad[] {
    const sorted = [...ads];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'oldest':
        return sorted.sort((a, b) => a.createdAt - b.createdAt);
      case 'priceLow':
        return sorted.sort((a, b) => a.price - b.price);
      case 'priceHigh':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popular':
        return sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      default:
        return sorted;
    }
  }

  /**
   * Get filtered ads observable
   */
  getFilteredAds(): Observable<Ad[]> {
    return this.filteredAds$.asObservable();
  }

  /**
   * Get ads cache observable
   */
  getAdsCache(): Observable<Ad[]> {
    return this.adsCache$.asObservable();
  }

  /**
   * Get expired ads (for admin)
   */
  getExpiredAds(): Observable<Ad[]> {
    const now = Date.now();
    return this.db.list<Ad>('ads').valueChanges().pipe(
      map(ads => ads.filter(ad =>
        ad.status === 'active' && ad.expiresAt < now
      ))
    );
  }

  /**
   * Auto-expire old ads (to be run periodically)
   */
  async expireOldAds(): Promise<void> {
    try {
      const expiredAds = await this.getExpiredAds().pipe(take(1)).toPromise();
      if (expiredAds) {
        for (const ad of expiredAds) {
          await this.updateAd(ad.id, { status: 'expired' });
        }
        console.log(`✅ Expired ${expiredAds.length} old ads`);
      }
    } catch (error) {
      console.error('❌ Error expiring old ads:', error);
    }
  }
}
