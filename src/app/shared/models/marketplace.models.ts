/**
 * Rajee Marketplace Database Models
 * All interfaces for Firestore/Realtime DB structure
 */

// ============================================
// 1. USER MODEL
// ============================================
export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  bio?: string;
  
  // Rating & Reputation
  rating: number; // Average rating (0-5)
  totalRatings: number;
  totalReviews: number;
  
  // Account Info
  joinDate: number; // Timestamp
  lastActiveAt?: number;
  accountStatus: 'active' | 'suspended' | 'banned' | 'pendingVerification';
  emailVerified: boolean;
  phoneVerified: boolean;
  
  // Location
  city: string;
  province: string;
  
  // Preferences
  language: 'ar' | 'en';
  notificationsEnabled: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  
  // Statistics
  totalAdsPosted: number;
  totalAdsSold?: number;
  responseRate?: number; // Percentage
  responseTime?: number; // Average time in minutes
  
  // Verification (for future company registration)
  isVerified: boolean;
  verificationDate?: number;
  verificationType?: 'individual' | 'business' | 'commercial';
  businessName?: string;
  businessLicense?: string;
  
  updatedAt: number;
}

// ============================================
// 2. AD/LISTING MODEL
// ============================================
export interface Ad {
  id: string;
  uid: string; // Seller's UID
  
  // Basic Info
  title: string;
  description: string;
  price: number;
  
  // Category & Type
  categoryId: string;
  subCategoryId?: string;
  dealType: 'sell' | 'waiver' | 'rent' | 'buyRequest'; // Buy request for future
  
  // Location
  city: string;
  province: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Images
  images: string[]; // Array of image URLs (min 1, max 12)
  thumbnail?: string; // First image
  
  // Status & Lifecycle
  status: 'active' | 'sold' | 'expired' | 'archived' | 'pendingApproval' | 'rejected';
  createdAt: number;
  updatedAt: number;
  expiresAt: number; // Auto-expire after 30-60 days
  renewalCount: number;
  lastRenewedAt?: number;
  
  // Promotion
  isFeatured: boolean;
  featuredUntil?: number;
  promotionTier?: 'basic' | 'premium' | 'vip'; // For future
  
  // Engagement Metrics
  viewCount: number;
  favoriteCount: number;
  shareCount: number;
  messagesSent: number;
  
  // Ad-specific fields (depends on category)
  specifications?: {
    [key: string]: string | number | boolean;
  }; // Car: make, model, year, condition, etc.
  
  // Seller Info (denormalized for quick access)
  sellerName: string;
  sellerRating: number;
  sellerPhone: string;
  
  // Flags
  isReported: boolean;
  reportCount: number;
  isSold: boolean;
  soldAt?: number;
  soldTo?: string; // UID of buyer (optional - not always tracked)
}

// ============================================
// 3. CATEGORY MODEL
// ============================================
export interface Category {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  icon: string; // Icon URL or icon name
  color?: string;
  
  // Hierarchy
  parentCategoryId?: string; // For subcategories
  displayOrder: number;
  
  // Configuration
  enabled: boolean;
  requiresApproval: boolean; // Ads in this category need approval
  needsLocation: boolean;
  customFields?: CategoryCustomField[];
  
  // Metrics
  adCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface CategoryCustomField {
  fieldName: string;
  labelAr: string;
  labelEn: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox';
  required: boolean;
  options?: { ar: string; en: string }[];
}

// ============================================
// 4. FAVORITE MODEL
// ============================================
export interface Favorite {
  id: string;
  userId: string; // User who favorited
  adId: string;
  
  // Ad snapshot (denormalized)
  adTitle: string;
  adPrice: number;
  adImage?: string;
  adStatus: string;
  
  addedAt: number;
}

// ============================================
// 5. RATING & REVIEW MODEL
// ============================================
export interface Review {
  id: string;
  fromUserId: string; // Who gave the review
  toUserId: string; // Who received the review
  adId: string; // Related ad
  
  // Review Content
  rating: number; // 1-5 stars
  comment?: string;
  
  // Review Aspects
  sellerResponse?: 'quick' | 'medium' | 'slow' | 'notResponded';
  productCondition?: 'asDescribed' | 'betterThanExpected' | 'worseOrDifferent' | 'notReceived';
  buyerBehavior?: 'professional' | 'respectful' | 'rude' | 'scammer'; // For seller reviews of buyer
  
  // Flags
  isVerifiedTransaction: boolean;
  helpful: number; // Upvotes
  unhelpful: number; // Downvotes
  
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
}

// ============================================
// 6. MESSAGE MODEL
// ============================================
export interface Message {
  id: string;
  chatRoomId: string; // Used for grouping
  senderId: string;
  receiverId: string;
  
  // Message Content
  content: string;
  messageType: 'text' | 'image' | 'file' | 'offer'; // For future file uploads
  
  // Status
  status: 'sent' | 'delivered' | 'read'; // Delivery tracking
  isRead: boolean;
  readAt?: number;
  
  // Context
  relatedAdId?: string; // If message is related to specific ad
  
  timestamp: number;
}

export interface ChatRoom {
  id: string; // Usually: userId1_userId2 (sorted)
  participants: string[]; // [uid1, uid2]
  
  // Last Message Info
  lastMessage?: string;
  lastMessageTime?: number;
  lastMessageSenderId?: string;
  
  // Unread count for each participant
  unreadCount: {
    [uid: string]: number;
  };
  
  // Related context
  relatedAdId?: string;
  
  createdAt: number;
  updatedAt: number;
}

// ============================================
// 7. REPORT MODEL
// ============================================
export interface Report {
  id: string;
  reporterId: string;
  
  // What is being reported
  reportType: 'ad' | 'user' | 'review' | 'message';
  reportedItemId: string; // Ad ID, User ID, Review ID, etc.
  reportedUserId?: string; // If reporting a user directly
  
  // Report Details
  reason: 'spam' | 'inappropriate' | 'scam' | 'offensive' | 'counterfeit' | 'other';
  description: string;
  evidence?: string[]; // Image URLs of evidence
  
  // Status
  status: 'open' | 'underReview' | 'resolved' | 'dismissed';
  resolution?: string; // Decision by admin
  resolvedBy?: string; // Admin UID
  resolvedAt?: number;
  
  // Action Taken
  actionTaken?: 'none' | 'warning' | 'adRemoved' | 'userSuspended' | 'userBanned';
  
  createdAt: number;
  updatedAt: number;
}

// ============================================
// 8. NOTIFICATION MODEL
// ============================================
export interface Notification {
  id: string;
  userId: string;
  
  // Notification Content
  type: 'newMessage' | 'adViewed' | 'adFavorited' | 'adExpiring' | 'adApproved' | 'adRejected' | 'newReview' | 'followRequest' | 'promotionAvailable' | 'system';
  title: string;
  message: string;
  
  // Context
  relatedAdId?: string;
  relatedUserId?: string;
  relatedReviewId?: string;
  
  // Status
  isRead: boolean;
  readAt?: number;
  
  // Action
  actionUrl?: string; // Deep link to navigate
  
  createdAt: number;
}

// ============================================
// 9. FOLLOW RELATIONSHIP MODEL
// ============================================
export interface Follow {
  id: string;
  followerId: string; // User doing the following
  followingId: string; // User being followed
  
  // Denormalized data for quick access
  followerName?: string;
  followingName?: string;
  
  createdAt: number;
}

// ============================================
// 10. SUBSCRIPTION/PROMOTION MODEL (Future)
// ============================================
export interface Subscription {
  id: string;
  userId: string;
  
  // Plan Info
  planType: 'free' | 'basic' | 'premium' | 'business';
  planName: string;
  
  // Pricing
  price: number;
  currency: 'SAR' | 'USD';
  
  // Status
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startDate: number;
  endDate: number;
  renewalDate?: number;
  
  // Features
  features: {
    maxAdsPerMonth: number;
    promotedAdsPerMonth: number;
    featuredAdsPerMonth: number;
    prioritySupport: boolean;
    customBranding?: boolean; // For business
  };
  
  // Payment Info (when integrated)
  paymentMethod?: string; // Card ID or payment provider
  
  createdAt: number;
  updatedAt: number;
}

// ============================================
// 11. PROMOTION/FEATURED AD MODEL
// ============================================
export interface Promotion {
  id: string;
  adId: string;
  userId: string;
  
  // Promotion Type
  type: 'featured' | 'highlighted' | 'sponsored' | 'bumped';
  tier: 'basic' | 'premium' | 'vip';
  
  // Duration
  startDate: number;
  endDate: number;
  duration: number; // in days
  
  // Cost (when payment integrated)
  cost?: number;
  status: 'active' | 'expired' | 'cancelled';
  
  // Metrics
  impressions?: number;
  clicks?: number;
  
  createdAt: number;
}

// ============================================
// 12. SEARCH HISTORY MODEL (Optional)
// ============================================
export interface SearchHistory {
  id: string;
  userId: string;
  
  // Search Query
  query: string;
  categoryId?: string;
  filters?: {
    [key: string]: any;
  };
  
  resultsCount: number;
  timestamp: number;
}

// ============================================
// 13. VIEW HISTORY MODEL (Optional)
// ============================================
export interface ViewHistory {
  id: string;
  userId: string;
  adId: string;
  
  // Ad info (denormalized)
  adTitle: string;
  adPrice: number;
  adImage?: string;
  
  viewedAt: number;
}

// ============================================
// 14. SAVED SEARCH MODEL (Optional)
// ============================================
export interface SavedSearch {
  id: string;
  userId: string;
  
  // Search Details
  name: string;
  query?: string;
  filters: {
    categoryId?: string;
    subCategoryId?: string;
    city?: string;
    priceMin?: number;
    priceMax?: number;
    condition?: string;
    sortBy?: string;
    [key: string]: any;
  };
  
  // Notifications
  notifyOnNewResults: boolean;
  
  createdAt: number;
}
