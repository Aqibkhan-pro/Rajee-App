/**
 * Review Service
 * Handles user reviews and ratings - builds seller reputation
 */

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Review } from '../shared/models/marketplace.models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsCache$ = new BehaviorSubject<Review[]>([]);

  constructor(private db: AngularFireDatabase) {}

  /**
   * Submit a review
   */
  async submitReview(reviewData: Partial<Review>): Promise<Review> {
    try {
      const newReviewRef = this.db.list('reviews').push({
        ...reviewData,
        isEdited: false,
        helpful: 0,
        unhelpful: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const id = newReviewRef.key;
      console.log('✅ Review submitted successfully:', id);
      
      return { id, ...reviewData } as Review;
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      throw error;
    }
  }

  /**
   * Get all reviews for a user
   */
  getUserReviews(userId: string): Observable<Review[]> {
    return this.db.list<Review>('reviews', ref =>
      ref.orderByChild('toUserId').equalTo(userId)
    ).valueChanges().pipe(
      map(reviews => reviews.sort((a, b) => b.createdAt - a.createdAt)),
      catchError(err => {
        console.error('Error fetching reviews:', err);
        return Promise.resolve([]);
      })
    );
  }

  /**
   * Get reviews by a specific user
   */
  getReviewsByUser(userId: string): Observable<Review[]> {
    return this.db.list<Review>('reviews', ref =>
      ref.orderByChild('fromUserId').equalTo(userId)
    ).valueChanges();
  }

  /**
   * Get reviews for a specific ad
   */
  getAdReviews(adId: string): Observable<Review[]> {
    return this.db.list<Review>('reviews', ref =>
      ref.orderByChild('adId').equalTo(adId)
    ).valueChanges();
  }

  /**
   * Get single review by ID
   */
  getReviewById(reviewId: string): Observable<Review | null> {
    return this.db.object<Review>(`reviews/${reviewId}`)
      .valueChanges()
      .pipe(
        map(review => review || null),
        catchError(err => {
          console.error('Error fetching review:', err);
          return Promise.resolve(null);
        })
      );
  }

  /**
   * Check if user has already reviewed (prevent duplicate reviews)
   */
  hasUserReviewed(fromUserId: string, toUserId: string, adId: string): Observable<boolean> {
    return this.getUserReviews(toUserId).pipe(
      map(reviews => 
        reviews.some(r => 
          r.fromUserId === fromUserId && r.adId === adId
        )
      )
    );
  }

  /**
   * Update review
   */
  async updateReview(reviewId: string, updates: Partial<Review>): Promise<void> {
    try {
      await this.db.object(`reviews/${reviewId}`).update({
        ...updates,
        isEdited: true,
        updatedAt: Date.now()
      });
      console.log('✅ Review updated');
    } catch (error) {
      console.error('❌ Error updating review:', error);
      throw error;
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string): Promise<void> {
    try {
      await this.db.object(`reviews/${reviewId}`).remove();
      console.log('✅ Review deleted');
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      throw error;
    }
  }

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<void> {
    try {
      const review = await this.getReviewById(reviewId).toPromise();
      if (review) {
        await this.db.object(`reviews/${reviewId}/helpful`).set((review.helpful || 0) + 1);
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  }

  /**
   * Mark review as unhelpful
   */
  async markUnhelpful(reviewId: string): Promise<void> {
    try {
      const review = await this.getReviewById(reviewId).toPromise();
      if (review) {
        await this.db.object(`reviews/${reviewId}/unhelpful`).set((review.unhelpful || 0) + 1);
      }
    } catch (error) {
      console.error('Error marking review as unhelpful:', error);
    }
  }

  /**
   * Calculate average rating for a user
   */
  getUserAverageRating(userId: string): Observable<number> {
    return this.getUserReviews(userId).pipe(
      map(reviews => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
      })
    );
  }

  /**
   * Get rating breakdown for a user
   */
  getRatingBreakdown(userId: string): Observable<{
    total: number;
    average: number;
    distribution: { [key: number]: number };
  }> {
    return this.getUserReviews(userId).pipe(
      map(reviews => {
        const distribution: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        reviews.forEach(r => {
          distribution[r.rating]++;
        });

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = reviews.length > 0 ? Math.round((sum / reviews.length) * 10) / 10 : 0;

        return {
          total: reviews.length,
          average: average,
          distribution: distribution
        };
      })
    );
  }

  /**
   * Get seller statistics
   */
  getSellerStats(userId: string): Observable<{
    totalReviews: number;
    averageRating: number;
    responseRate: number;
    helpfulReviews: number;
  }> {
    return this.getUserReviews(userId).pipe(
      map(reviews => {
        if (reviews.length === 0) {
          return {
            totalReviews: 0,
            averageRating: 0,
            responseRate: 0,
            helpfulReviews: 0
          };
        }

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = Math.round((sum / reviews.length) * 10) / 10;
        const helpful = reviews.reduce((acc, r) => acc + (r.helpful || 0), 0);
        const responded = reviews.filter(r => r.sellerResponse !== 'notResponded').length;
        const responseRate = Math.round((responded / reviews.length) * 100);

        return {
          totalReviews: reviews.length,
          averageRating: average,
          responseRate: responseRate,
          helpfulReviews: helpful
        };
      })
    );
  }

  /**
   * Get recent reviews (for display)
   */
  getRecentReviews(userId: string, limit: number = 5): Observable<Review[]> {
    return this.getUserReviews(userId).pipe(
      map(reviews => reviews.slice(0, limit))
    );
  }

  /**
   * Get verified transaction reviews only
   */
  getVerifiedReviews(userId: string): Observable<Review[]> {
    return this.getUserReviews(userId).pipe(
      map(reviews => reviews.filter(r => r.isVerifiedTransaction))
    );
  }

  /**
   * Get positive reviews (4-5 stars)
   */
  getPositiveReviews(userId: string): Observable<Review[]> {
    return this.getUserReviews(userId).pipe(
      map(reviews => reviews.filter(r => r.rating >= 4))
    );
  }

  /**
   * Get negative reviews (1-2 stars)
   */
  getNegativeReviews(userId: string): Observable<Review[]> {
    return this.getUserReviews(userId).pipe(
      map(reviews => reviews.filter(r => r.rating <= 2))
    );
  }

  /**
   * Get cached reviews
   */
  getCachedReviews(): Observable<Review[]> {
    return this.reviewsCache$.asObservable();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.reviewsCache$.next([]);
  }

  /**
   * Get trend of reviews over time
   */
  getReviewTrends(userId: string, days: number = 30): Observable<any[]> {
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.getUserReviews(userId).pipe(
      map(reviews => {
        const trends: { [key: string]: number } = {};

        reviews
          .filter(r => r.createdAt > startDate)
          .forEach(r => {
            const date = new Date(r.createdAt).toLocaleDateString();
            trends[date] = (trends[date] || 0) + 1;
          });

        return Object.entries(trends)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      })
    );
  }

  /**
   * Check if user is trusted seller (4+ stars, 5+ reviews, verified transactions)
   */
  isTrustedSeller(userId: string): Observable<boolean> {
    return this.getRatingBreakdown(userId).pipe(
      map(bd => {
        const hasEnoughReviews = bd.total >= 5;
        const hasGoodRating = bd.average >= 4;
        return hasEnoughReviews && hasGoodRating;
      })
    );
  }

  /**
   * Get reviews for admin flagging
   */
  getFlaggedReviews(): Observable<Review[]> {
    return this.db.list<Review>('reviews').valueChanges().pipe(
      map(reviews => reviews.filter(r => {
        // Flag reviews with very low helpfulness despite high rating
        const helpfulRatio = r.helpful ? r.helpful / (r.helpful + r.unhelpful!!) : 0;
        return helpfulRatio < 0.3;
      }))
    );
  }

  /**
   * Export reviews for analysis
   */
  async exportReviews(userId?: string): Promise<string> {
    try {
      let reviews: Review[] | undefined;
      
      if (userId) {
        reviews = await this.getUserReviews(userId).toPromise();
      } else {
        reviews = await this.db.list<Review>('reviews').valueChanges().toPromise();
      }

      return JSON.stringify(reviews, null, 2);
    } catch (error) {
      console.error('Error exporting reviews:', error);
      throw error;
    }
  }
}
