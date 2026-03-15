/**
 * RAJEE MARKETPLACE - SERVICES QUICK REFERENCE GUIDE
 * 
 * All core services have been created with full functionality.
 * This guide shows how to use them in your components.
 */

// ============================================
// 1. AD SERVICE USAGE EXAMPLES
// ============================================

import { AdService, AdFilter, AdSearchResult } from '../services/ad.service';

/*
Constructor injection:
constructor(private adService: AdService) {}

// Create a new ad
const newAd: Partial<Ad> = {
  uid: userId,
  title: 'Toyota Camry 2019',
  description: 'Great condition, low mileage',
  price: 45000,
  categoryId: 'cars',
  city: 'Riyadh',
  dealType: 'sell'
};
await this.adService.createAd(newAd);

// Get ad details
this.adService.getAdById(adId).subscribe(ad => {
  console.log('Ad details:', ad);
});

// Get all featured ads
this.adService.getFeaturedAds(10).subscribe(featured => {
  this.featuredAds = featured;
});

// Search with filters
const filters: AdFilter = {
  categoryId: 'cars',
  city: 'Riyadh',
  priceMin: 30000,
  priceMax: 60000,
  sortBy: 'newest',
  limit: 50
};
this.adService.searchAds(filters).subscribe(results => {
  this.searchResults = results;
});

// Advanced search with pagination info
this.adService.advancedSearch(filters).subscribe(result => {
  console.log('Found', result.totalCount, 'ads');
  console.log('Has more:', result.hasMore);
});

// Increment view count when ad is viewed
await this.adService.incrementViewCount(adId);

// Mark ad as sold
await this.adService.markAsSold(adId, buyerId);

// Promote ad to featured
await this.adService.promoteAd(adId, 7); // 7 days

// Upload images
const images = await this.adService.uploadAdImages(adId, [file1, file2]);
*/

// ============================================
// 2. CATEGORY SERVICE USAGE EXAMPLES
// ============================================

import { CategoryService } from '../services/category.service';

/*
Constructor injection:
constructor(private categoryService: CategoryService) {}

// Get main categories for navigation
this.categoryService.getMainCategories().subscribe(categories => {
  this.mainCategories = categories;
});

// Get subcategories for a category
this.categoryService.getSubCategories('cars').subscribe(subs => {
  this.subcategories = subs;
});

// Get ads in a specific category
this.categoryService.getCategoryAds('cars', 20).subscribe(ads => {
  this.categoryAds = ads;
});

// Search categories
this.categoryService.searchCategories('car', 'en').subscribe(results => {
  this.searchResults = results;
});

// Get cached categories (for better performance)
this.categoryService.getCachedCategories().subscribe(cats => {
  this.cachedCategories = cats;
});
*/

// ============================================
// 3. FAVORITE SERVICE USAGE EXAMPLES
// ============================================

import { FavoriteService } from '../services/favorite.service';

/*
Constructor injection:
constructor(private favoriteService: FavoriteService) {}

// Add to favorites
await this.favoriteService.addToFavorites(userId, adData);

// Check if ad is favorite
this.favoriteService.isAdInFavorites(userId, adId).subscribe(isFav => {
  this.isFavorited = isFav;
});

// Toggle favorite
const newStatus = await this.favoriteService.toggleFavorite(userId, adData);
console.log('Now favorited:', newStatus);

// Get user's favorites
this.favoriteService.getUserFavorites(userId).subscribe(favorites => {
  this.myFavorites = favorites;
});

// Get favorite count
this.favoriteService.getFavoriteCount(userId).subscribe(count => {
  this.favoriteCount = count;
});

// Get favorite statistics
const stats = await this.favoriteService.getFavoriteStats(userId);
console.log('Total:', stats.totalFavorites);
console.log('Sold:', stats.soldAds);
*/

// ============================================
// 4. REPORT SERVICE USAGE EXAMPLES
// ============================================

import { ReportService } from '../services/report.service';

/*
Constructor injection:
constructor(private reportService: ReportService) {}

// User submits a report
const report: Partial<Report> = {
  reporterId: userId,
  reportType: 'ad',
  reportedItemId: adId,
  reason: 'scam',
  description: 'This ad looks like a scam'
};
await this.reportService.submitReport(report);

// Check if user already reported
this.reportService.hasUserReported(userId, adId, 'ad').subscribe(hasReported => {
  console.log('Already reported:', hasReported);
});

// ADMIN: Get open reports for review
this.reportService.getOpenReports().subscribe(openReports => {
  this.moderationQueue = openReports;
});

// ADMIN: Resolve a report
await this.reportService.resolveReport(
  reportId,
  'Ad removed - violates policy',
  'adRemoved',
  adminId
);

// Get most reported items (for dashboard)
this.reportService.getMostReportedItems(10).subscribe(items => {
  this.topReported = items;
});

// Get report statistics
this.reportService.getReportStatistics().subscribe(stats => {
  console.log('Reports by reason:', stats);
});

// Get report trends
this.reportService.getReportTrends(30).subscribe(trends => {
  this.reportChart = trends;
});
*/

// ============================================
// 5. REVIEW SERVICE USAGE EXAMPLES
// ============================================

import { ReviewService } from '../services/review.service';

/*
Constructor injection:
constructor(private reviewService: ReviewService) {}

// Submit a review
const review: Partial<Review> = {
  fromUserId: buyerId,
  toUserId: sellerId,
  adId: adId,
  rating: 5,
  comment: 'Great seller! Quick to respond.',
  isVerifiedTransaction: true
};
await this.reviewService.submitReview(review);

// Check if user can review (not duplicate)
this.reviewService.hasUserReviewed(buyerId, sellerId, adId).subscribe(can => {
  this.canReview = !can;
});

// Get user's average rating
this.reviewService.getUserAverageRating(sellerId).subscribe(avg => {
  this.sellerRating = avg;
});

// Get rating breakdown (for displaying chart)
this.reviewService.getRatingBreakdown(sellerId).subscribe(breakdown => {
  console.log('Total reviews:', breakdown.total);
  console.log('Average rating:', breakdown.average);
  console.log('Distribution:', breakdown.distribution);
});

// Get seller statistics
this.reviewService.getSellerStats(sellerId).subscribe(stats => {
  this.reputation = {
    rating: stats.averageRating,
    reviews: stats.totalReviews,
    responseRate: stats.responseRate
  };
});

// Get recent reviews (for profile page)
this.reviewService.getRecentReviews(sellerId, 5).subscribe(reviews => {
  this.recentReviews = reviews;
});

// Check if seller is trusted
this.reviewService.isTrustedSeller(sellerId).subscribe(isTrusted => {
  if (isTrusted) {
    this.showTrustedBadge = true;
  }
});

// Mark review as helpful
await this.reviewService.markHelpful(reviewId);

// Get verified reviews only
this.reviewService.getVerifiedReviews(sellerId).subscribe(verified => {
  this.verifiedReviews = verified;
});

// Get review trends
this.reviewService.getReviewTrends(sellerId, 30).subscribe(trends => {
  this.reviewChart = trends;
});
*/

// ============================================
// INTEGRATION IN COMPONENTS
// ============================================

/*
Example: Home Component with Ads & Featured

import { Component, OnInit } from '@angular/core';
import { AdService } from '../services/ad.service';
import { CategoryService } from '../services/category.service';
import { Ad, Category } from '../shared/models/marketplace.models';

@Component({
  selector: 'app-home',
  template: `
    <ion-content>
      <h2>Featured Ads</h2>
      <ion-card *ngFor="let ad of featuredAds">
        <img [src]="ad.thumbnail" />
        <h3>{{ ad.title }}</h3>
        <p>{{ ad.price | currency }}</p>
      </ion-card>

      <h2>Browse Categories</h2>
      <ion-segment [(ngModel)]="selectedCategory">
        <ion-segment-button *ngFor="let cat of mainCategories" [value]="cat.id">
          {{ cat.name.en }}
        </ion-segment-button>
      </ion-segment>

      <h2>{{ selectedCategory }} Ads</h2>
      <ion-card *ngFor="let ad of categoryAds">
        <img [src]="ad.thumbnail" />
        <h3>{{ ad.title }}</h3>
        <p>{{ ad.price | currency }}</p>
      </ion-card>
    </ion-content>
  `
})
export class HomeComponent implements OnInit {
  featuredAds: Ad[] = [];
  mainCategories: Category[] = [];
  categoryAds: Ad[] = [];
  selectedCategory: string = 'cars';

  constructor(
    private adService: AdService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadFeatured();
    this.loadCategories();
    this.loadCategoryAds();
  }

  loadFeatured() {
    this.adService.getFeaturedAds(10).subscribe(
      ads => this.featuredAds = ads
    );
  }

  loadCategories() {
    this.categoryService.getMainCategories().subscribe(
      cats => this.mainCategories = cats
    );
  }

  loadCategoryAds() {
    this.adService.getCategoryAds(this.selectedCategory, 20).subscribe(
      ads => this.categoryAds = ads
    );
  }

  onCategoryChange() {
    this.loadCategoryAds();
  }
}
*/

// ============================================
// ERROR HANDLING PATTERN
// ============================================

/*
All services include try-catch for error handling:

try {
  await this.adService.createAd(adData);
  this.showSuccess('Ad posted successfully!');
} catch (error) {
  this.showError('Failed to post ad. Please try again.');
  console.error('Error:', error);
}

For observables, use catchError:
this.adService.searchAds(filters).pipe(
  catchError(error => {
    this.showError('Search failed');
    return of([]);
  })
).subscribe(results => {
  // Use results
});
*/

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

/*
1. Use cached data when available:
   - CategoryService caches categories
   - Use getCachedCategories() instead of getAllCategories() when possible

2. Pagination:
   - Use 'limit' parameter in search
   - Check 'hasMore' flag in results
   - Implement virtual scrolling for large lists

3. Image compression:
   - Compress images before upload
   - Use thumbnails for lists
   - Lazy load images below fold

4. Unsubscribe to prevent memory leaks:
   subscription = this.adService.getFeaturedAds().subscribe(...);
   
   ngOnDestroy() {
     this.subscription.unsubscribe();
   }

   Or use async pipe in templates:
   *ngFor="let ad of (adService.getFeaturedAds() | async)"
*/

// ============================================
// DEPENDENCIES TO INSTALL
// ============================================

/*
All services use existing Firebase libraries:
- @angular/fire/compat/database
- @angular/fire/compat/storage
- @angular/fire/compat/auth

These should already be installed in your project.
*/
