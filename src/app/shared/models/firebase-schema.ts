/**
 * FIREBASE REALTIME DATABASE STRUCTURE
 * Rajee Marketplace App
 * 
 * Root Database URL: https://rajee-198a5-default-rtdb.firebaseio.com
 */

/**
 * DATABASE COLLECTIONS/NODES STRUCTURE:
 * 
 * /users/{uid}
 * ├── uid: string
 * ├── name: string
 * ├── email: string
 * ├── phone: string
 * ├── photoURL: string (optional)
 * ├── bio: string (optional)
 * ├── rating: number (0-5)
 * ├── totalRatings: number
 * ├── joinDate: number (timestamp)
 * ├── accountStatus: string (active|suspended|banned|pendingVerification)
 * ├── city: string
 * ├── province: string
 * ├── language: string (ar|en)
 * ├── isVerified: boolean
 * ├── verificationType: string (optional: individual|business|commercial)
 * ├── businessName: string (optional)
 * ├── totalAdsPosted: number
 * └── updatedAt: number
 * 
 * ============================================
 * /ads/{adId}
 * ├── id: string
 * ├── uid: string (seller UID)
 * ├── title: string
 * ├── description: string
 * ├── price: number
 * ├── categoryId: string
 * ├── subCategoryId: string (optional)
 * ├── dealType: string (sell|waiver|rent)
 * ├── city: string
 * ├── province: string
 * ├── coordinates: {lat, lng} (optional)
 * ├── images: string[] (URLs)
 * ├── status: string (active|sold|expired|archived|pendingApproval|rejected)
 * ├── createdAt: number
 * ├── expiresAt: number
 * ├── renewalCount: number
 * ├── isFeatured: boolean
 * ├── viewCount: number
 * ├── favoriteCount: number
 * ├── specifications: {key: value} (car: make, model, year, etc.)
 * ├── sellerName: string (denormalized)
 * ├── sellerRating: number (denormalized)
 * └── isReported: boolean
 * 
 * ============================================
 * /categories/{categoryId}
 * ├── id: string
 * ├── name: {ar: string, en: string}
 * ├── description: {ar: string, en: string} (optional)
 * ├── icon: string (icon name or URL)
 * ├── parentCategoryId: string (optional - for subcategories)
 * ├── displayOrder: number
 * ├── enabled: boolean
 * ├── requiresApproval: boolean
 * ├── customFields: array of {fieldName, labelAr, labelEn, type, required, options}
 * ├── adCount: number
 * └── updatedAt: number
 * 
 * ============================================
 * /favorites/{userId}/{favoriteId}
 * ├── id: string
 * ├── userId: string
 * ├── adId: string
 * ├── adTitle: string (denormalized)
 * ├── adPrice: number (denormalized)
 * ├── adImage: string (denormalized)
 * └── addedAt: number
 * 
 * ============================================
 * /reviews/{reviewId}
 * ├── id: string
 * ├── fromUserId: string
 * ├── toUserId: string
 * ├── adId: string
 * ├── rating: number (1-5)
 * ├── comment: string (optional)
 * ├── sellerResponse: string
 * ├── isVerifiedTransaction: boolean
 * ├── helpful: number
 * ├── createdAt: number
 * └── updatedAt: number
 * 
 * ============================================
 * /chats/{chatRoomId}/messages/{messageId}
 * ├── id: string
 * ├── chatRoomId: string
 * ├── senderId: string
 * ├── receiverId: string
 * ├── content: string
 * ├── messageType: string (text|image|file|offer)
 * ├── isRead: boolean
 * ├── status: string (sent|delivered|read)
 * ├── relatedAdId: string (optional)
 * └── timestamp: number
 * 
 * ============================================
 * /chatRooms/{chatRoomId}
 * ├── id: string
 * ├── participants: string[] (sorted: [uid1, uid2])
 * ├── lastMessage: string
 * ├── lastMessageTime: number
 * ├── lastMessageSenderId: string
 * ├── unreadCount: {userId: number, ...}
 * ├── relatedAdId: string (optional)
 * ├── createdAt: number
 * └── updatedAt: number
 * 
 * ============================================
 * /reports/{reportId}
 * ├── id: string
 * ├── reporterId: string
 * ├── reportType: string (ad|user|review|message)
 * ├── reportedItemId: string
 * ├── reason: string (spam|inappropriate|scam|offensive|counterfeit|other)
 * ├── description: string
 * ├── evidence: string[] (optional - image URLs)
 * ├── status: string (open|underReview|resolved|dismissed)
 * ├── actionTaken: string (optional: none|warning|adRemoved|userSuspended|userBanned)
 * ├── createdAt: number
 * └── updatedAt: number
 * 
 * ============================================
 * /notifications/{userId}/{notificationId}
 * ├── id: string
 * ├── userId: string
 * ├── type: string (newMessage|adViewed|adFavorited|adExpiring|adApproved|etc)
 * ├── title: string
 * ├── message: string
 * ├── relatedAdId: string (optional)
 * ├── relatedUserId: string (optional)
 * ├── isRead: boolean
 * ├── actionUrl: string (optional)
 * └── createdAt: number
 * 
 * ============================================
 * /follows/{followId}
 * ├── id: string
 * ├── followerId: string
 * ├── followingId: string
 * ├── followerName: string (denormalized - optional)
 * ├── followingName: string (denormalized - optional)
 * └── createdAt: number
 * 
 * Alternative structure for faster queries:
 * /userFollowers/{userId}/{followerId}
 * /userFollowing/{userId}/{followingId}
 * 
 * ============================================
 * /subscriptions/{subscriptionId}
 * ├── id: string
 * ├── userId: string
 * ├── planType: string (free|basic|premium|business)
 * ├── status: string (active|cancelled|expired)
 * ├── startDate: number
 * ├── endDate: number
 * ├── features: {maxAdsPerMonth, promotedAdsPerMonth, ...}
 * └── createdAt: number
 * 
 * ============================================
 * /promotions/{promotionId}
 * ├── id: string
 * ├── adId: string
 * ├── userId: string
 * ├── type: string (featured|highlighted|sponsored|bumped)
 * ├── tier: string (basic|premium|vip)
 * ├── startDate: number
 * ├── endDate: number
 * ├── status: string (active|expired|cancelled)
 * └── createdAt: number
 * 
 * ============================================
 * /searchHistory/{userId}/{searchId}
 * ├── id: string
 * ├── userId: string
 * ├── query: string
 * ├── categoryId: string (optional)
 * ├── filters: {categoryId, city, priceMin, priceMax, ...}
 * ├── resultsCount: number
 * └── timestamp: number
 * 
 * ============================================
 * /viewHistory/{userId}/{viewId}
 * ├── id: string
 * ├── userId: string
 * ├── adId: string
 * ├── adTitle: string (denormalized)
 * ├── adPrice: number (denormalized)
 * └── viewedAt: number
 * 
 * ============================================
 * /savedSearches/{userId}/{searchId}
 * ├── id: string
 * ├── userId: string
 * ├── name: string
 * ├── filters: {categoryId, city, priceMin, priceMax, ...}
 * ├── notifyOnNewResults: boolean
 * └── createdAt: number
 * 
 * ============================================
 * /config/categories
 * └── [Contains all categories - master list]
 * 
 * /config/provinces
 * └── [Saudi provinces list]
 * 
 * /config/cities
 * └── [Cities organized by province]
 * 
 * ============================================
 * FIREBASE STORAGE STRUCTURE:
 * 
 * storage/
 * ├── users/{uid}/profile/{fileName}
 * ├── ads/{adId}/{fileName}  (ad images)
 * ├── reviews/{reviewId}/{fileName}  (proof images)
 * └── reports/{reportId}/{fileName}  (evidence images)
 * 
 * ============================================
 * FIRESTORE INDEXES (if using Cloud Firestore):
 * 
 * 1. ads: (status, createdAt DESC)
 * 2. ads: (categoryId, status, createdAt DESC)
 * 3. ads: (city, status, createdAt DESC)
 * 4. ads: (uid, status)
 * 5. ads: (isFeatured, createdAt DESC) - for featured ads
 * 6. reviews: (toUserId, createdAt DESC)
 * 7. favorites: (userId, addedAt DESC)
 * 8. userFollowing: (followerId, createdAt DESC)
 * 9. userFollowers: (followingId, createdAt DESC)
 * 10. notifications: (userId, isRead, createdAt DESC)
 * 
 * ============================================
 * SECURITY RULES NOTES:
 * 
 * - Users can only read/write their own data
 * - Ads are publicly readable, writable only by owner or admin
 * - Messages/chats: only participants can access
 * - Reviews/Reports: admin-controlled
 * - Notifications: user-specific
 * - Categories/Config: publicly readable, admin-writable
 * 
 */

export const FIREBASE_STRUCTURE = {
  COLLECTIONS: {
    USERS: 'users',
    ADS: 'ads',
    CATEGORIES: 'categories',
    FAVORITES: 'favorites',
    REVIEWS: 'reviews',
    CHATS: 'chats',
    CHAT_ROOMS: 'chatRooms',
    REPORTS: 'reports',
    NOTIFICATIONS: 'notifications',
    FOLLOWS: 'follows',
    USER_FOLLOWERS: 'userFollowers',
    USER_FOLLOWING: 'userFollowing',
    SUBSCRIPTIONS: 'subscriptions',
    PROMOTIONS: 'promotions',
    SEARCH_HISTORY: 'searchHistory',
    VIEW_HISTORY: 'viewHistory',
    SAVED_SEARCHES: 'savedSearches',
    CONFIG: 'config'
  },
  
  STORAGE_PATHS: {
    USER_PROFILE: 'users/{uid}/profile',
    AD_IMAGES: 'ads/{adId}',
    REVIEW_IMAGES: 'reviews/{reviewId}',
    REPORT_EVIDENCE: 'reports/{reportId}'
  },
  
  SUBCOLLECTIONS: {
    MESSAGES: 'messages',
    UNREAD_COUNT: 'unreadCount'
  }
};
