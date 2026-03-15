/**
 * Favorite Service
 * Handles user favorites: add, remove, get favorites
 */

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Favorite } from '../shared/models/marketplace.models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesCache$ = new BehaviorSubject<Favorite[]>([]);
  private currentUserId: string | null = null;

  constructor(
    private db: AngularFireDatabase,
    private storageService: StorageService
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const userData = this.storageService.getItem('userData');
    this.currentUserId = userData?.uid;
  }

  /**
   * Add ad to favorites
   */
  async addToFavorites(userId: string, adData: any): Promise<void> {
    try {
      const newFavRef = this.db.list(`favorites/${userId}`).push({
        adId: adData.id,
        adTitle: adData.title,
        adPrice: adData.price,
        adImage: adData.thumbnail || (adData.images && adData.images[0]),
        adStatus: adData.status,
        addedAt: Date.now()
      });

      console.log('✅ Ad added to favorites');
      // Refresh cache
      if (this.currentUserId === userId) {
        this.loadUserFavorites(userId).subscribe();
      }
    } catch (error) {
      console.error('❌ Error adding to favorites:', error);
      throw error;
    }
  }

  /**
   * Remove ad from favorites
   */
  async removeFromFavorites(userId: string, adId: string): Promise<void> {
    try {
      const favorites = await this.db.list<Favorite>(`favorites/${userId}`, ref =>
        ref.orderByChild('adId').equalTo(adId)
      ).valueChanges().toPromise();

      if (favorites && favorites.length > 0) {
        const favoriteId = (favorites[0] as any).$key;
        await this.db.object(`favorites/${userId}/${favoriteId}`).remove();
        console.log('✅ Ad removed from favorites');
        
        // Refresh cache
        if (this.currentUserId === userId) {
          this.loadUserFavorites(userId).subscribe();
        }
      }
    } catch (error) {
      console.error('❌ Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Check if ad is in favorites
   */
  isAdInFavorites(userId: string, adId: string): Observable<boolean> {
    return this.db.list<Favorite>(`favorites/${userId}`, ref =>
      ref.orderByChild('adId').equalTo(adId)
    ).valueChanges().pipe(
      map(favorites => (favorites && favorites.length > 0) ? true : false),
      catchError(err => {
        console.error('Error checking favorite:', err);
        return Promise.resolve(false);
      })
    );
  }

  /**
   * Get user's favorites
   */
  getUserFavorites(userId: string): Observable<Favorite[]> {
    return this.db.list<Favorite>(`favorites/${userId}`).valueChanges().pipe(
      map(favorites => 
        Array.isArray(favorites) ? 
          favorites.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)) 
          : []
      ),
      tap(favorites => this.favoritesCache$.next(favorites)),
      catchError(err => {
        console.error('Error fetching favorites:', err);
        return Promise.resolve([]);
      })
    );
  }

  /**
   * Load user's favorites (for caching)
   */
  private loadUserFavorites(userId: string): Observable<Favorite[]> {
    return this.getUserFavorites(userId);
  }

  /**
   * Get cached favorites
   */
  getCachedFavorites(): Observable<Favorite[]> {
    return this.favoritesCache$.asObservable();
  }

  /**
   * Clear user's favorites cache
   */
  clearCache(): void {
    this.favoritesCache$.next([]);
  }

  /**
   * Get favorite count for current user
   */
  getFavoriteCount(userId: string): Observable<number> {
    return this.getUserFavorites(userId).pipe(
      map(favorites => favorites.length)
    );
  }

  /**
   * Get favorites for display on home page
   */
  getHomeFavorites(userId: string, limit: number = 10): Observable<Favorite[]> {
    return this.getUserFavorites(userId).pipe(
      map(favorites => favorites.slice(0, limit))
    );
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(userId: string, adData: any): Promise<boolean> {
    const isFavorited = await this.isAdInFavorites(userId, adData.id).toPromise();
    
    if (isFavorited) {
      await this.removeFromFavorites(userId, adData.id);
      return false;
    } else {
      await this.addToFavorites(userId, adData);
      return true;
    }
  }

  /**
   * Bulk add to favorites (for importing)
   */
  async bulkAddToFavorites(userId: string, adIds: string[]): Promise<void> {
    try {
      for (const adId of adIds) {
        // In real scenario, fetch ad details first
        await this.db.list(`favorites/${userId}`).push({
          adId: adId,
          addedAt: Date.now()
        });
      }
      console.log('✅ Ads added to favorites in bulk');
      this.loadUserFavorites(userId).subscribe();
    } catch (error) {
      console.error('❌ Error bulk adding to favorites:', error);
      throw error;
    }
  }

  /**
   * Clear all favorites (user action - handle confirmation)
   */
  async clearAllFavorites(userId: string): Promise<void> {
    try {
      await this.db.object(`favorites/${userId}`).remove();
      console.log('✅ All favorites cleared');
      this.favoritesCache$.next([]);
    } catch (error) {
      console.error('❌ Error clearing favorites:', error);
      throw error;
    }
  }

  /**
   * Export favorites (for backup)
   */
  async exportFavorites(userId: string): Promise<string> {
    try {
      const favorites = await this.getUserFavorites(userId).toPromise();
      return JSON.stringify(favorites, null, 2);
    } catch (error) {
      console.error('Error exporting favorites:', error);
      throw error;
    }
  }

  /**
   * Get favorite statistics
   */
  async getFavoriteStats(userId: string): Promise<{
    totalFavorites: number;
    recentlyAdded: number;
    soldAds: number;
  }> {
    try {
      const favorites = await this.getUserFavorites(userId).toPromise();
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const sold = favorites?.filter(f => f.adStatus === 'sold').length || 0;
      const recent = favorites?.filter(f => (f.addedAt || 0) > weekAgo).length || 0;

      return {
        totalFavorites: favorites?.length || 0,
        recentlyAdded: recent,
        soldAds: sold
      };
    } catch (error) {
      console.error('Error getting favorite stats:', error);
      return { totalFavorites: 0, recentlyAdded: 0, soldAds: 0 };
    }
  }
}
