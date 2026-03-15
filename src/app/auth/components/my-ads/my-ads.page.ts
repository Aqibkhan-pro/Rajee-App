import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { Ad } from '../../../shared/models/marketplace.models';
import { AdService } from '../../../services/ad.service';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type StatusFilter = 'all' | 'active' | 'sold' | 'expired' | 'pending' | 'rejected';

interface AdStats {
  total: number;
  active: number;
  sold: number;
  expired: number;
  pending: number;
  rejected: number;
  totalViews: number;
  totalFavorites: number;
}

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.page.html',
  styleUrls: ['./my-ads.page.scss'],
})
export class MyAdsPage implements OnInit, OnDestroy {
  myAds: Ad[] = [];
  filteredAds: Ad[] = [];
  isLoading = false;
  isEmpty = false;
  viewMode: 'grid' | 'list' = 'grid';
  statusFilter: StatusFilter = 'all';
  searchQuery = '';
  
  stats: AdStats = {
    total: 0,
    active: 0,
    sold: 0,
    expired: 0,
    pending: 0,
    rejected: 0,
    totalViews: 0,
    totalFavorites: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private adService: AdService,
    private storageService: StorageService,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadMyAds();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user's ads
   */
  async loadMyAds() {
    try {
      this.isLoading = true;
      const userId = this.storageService.getItem('userData')?.uid;
      
      if (!userId) {
        this.isEmpty = true;
        return;
      }

      this.adService.getUserAds(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((ads) => {
          this.myAds = ads;
          this.calculateStats();
          this.applyFilters();
          this.isEmpty = this.myAds.length === 0;
          this.isLoading = false;
        });
    } catch (error) {
      console.error('❌ Error loading user ads:', error);
      this.showToast('Error loading your ads', 'danger');
      this.isLoading = false;
    }
  }

  /**
   * Calculate stats from ads
   */
  calculateStats() {
    this.stats = {
      total: this.myAds.length,
      active: this.myAds.filter(ad => ad.status === 'active').length,
      sold: this.myAds.filter(ad => ad.status === 'sold').length,
      expired: this.myAds.filter(ad => ad.status === 'expired').length,
      pending: this.myAds.filter(ad => ad.status === 'pendingApproval').length,
      rejected: this.myAds.filter(ad => ad.status === 'rejected').length,
      totalViews: this.myAds.reduce((sum, ad) => sum + (ad.viewCount || 0), 0),
      totalFavorites: this.myAds.reduce((sum, ad) => sum + (ad.favoriteCount || 0), 0)
    };
  }

  /**
   * Apply status and search filters
   */
  applyFilters() {
    this.filteredAds = this.myAds.filter(ad => {
      // Status filter
      if (this.statusFilter !== 'all' && ad.status !== this.statusFilter) {
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
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(status: StatusFilter) {
    this.statusFilter = status;
    this.applyFilters();
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
   * Toggle view mode
   */
  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  /**
   * Open ad details/edit page
   */
  openAdDetails(adId: string) {
    this.router.navigate(['/auth/edit-ad', adId]);
  }

  /**
   * Show quick actions for ad
   */
  async showAdActions(ad: Ad) {
    const buttons: any[] = [
      {
        text: 'Edit',
        icon: 'create',
        handler: () => this.openAdDetails(ad.id)
      },
      {
        text: 'View',
        icon: 'eye',
        handler: () => this.router.navigate(['/main/ad-details', ad.id])
      }
    ];

    // Add status-specific actions
    if (ad.status === 'active' || ad.status === 'sold') {
      buttons.push({
        text: 'Renew',
        icon: 'refresh',
        handler: () => this.renewAd(ad)
      });
    }

    if (ad.status === 'active') {
      buttons.push({
        text: 'Feature',
        icon: 'star',
        handler: () => this.promoteAd(ad)
      });
    }

    if (ad.status !== 'sold') {
      buttons.push({
        text: 'Mark as Sold',
        icon: 'checkmark-done',
        handler: () => this.markAsSold(ad)
      });
    }

    buttons.push({
      text: 'Delete',
      icon: 'trash',
      role: 'destructive',
      handler: () => this.deleteAd(ad)
    });

    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: ad.title,
      buttons
    });

    await actionSheet.present();
  }

  /**
   * Renew ad (extend expiry date)
   */
  async renewAd(ad: Ad) {
    try {
      this.isLoading = true;
      await this.adService.renewAd(ad.id);
      this.showToast('Ad renewed successfully', 'success');
      this.loadMyAds();
    } catch (error) {
      console.error('❌ Error renewing ad:', error);
      this.showToast('Error renewing ad', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Promote/feature ad
   */
  async promoteAd(ad: Ad) {
    const alert = await this.alertController.create({
      header: 'Feature Ad',
      message: 'Featuring this ad will increase visibility. Choose promotion duration:',
      inputs: [
        {
          name: 'duration',
          type: 'radio',
          label: '7 Days - 50 SAR',
          value: { days: 7, price: 50 }
        },
        {
          name: 'duration',
          type: 'radio',
          label: '14 Days - 90 SAR',
          value: { days: 14, price: 90 },
          checked: true
        },
        {
          name: 'duration',
          type: 'radio',
          label: '30 Days - 150 SAR',
          value: { days: 30, price: 150 }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Promote',
          handler: async (data) => {
            try {
              this.isLoading = true;
              const promotion = {
                type: 'featured',
                startDate: new Date(),
                endDate: new Date(new Date().getTime() + data.days * 24 * 60 * 60 * 1000),
                price: data.price
              };
              await this.adService.updateAd(ad.id, { isFeatured: true, promotionTier: 'premium' as any });
              this.showToast('Ad promoted successfully', 'success');
              this.loadMyAds();
            } catch (error) {
              console.error('❌ Error promoting ad:', error);
              this.showToast('Error promoting ad', 'danger');
            } finally {
              this.isLoading = false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Mark ad as sold
   */
  async markAsSold(ad: Ad) {
    const alert = await this.alertController.create({
      header: 'Mark as Sold',
      message: 'Are you sure you want to mark this ad as sold?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Mark as Sold',
          handler: async () => {
            try {
              this.isLoading = true;
              await this.adService.updateAd(ad.id, { status: 'sold' });
              this.showToast('Ad marked as sold', 'success');
              this.loadMyAds();
            } catch (error) {
              console.error('❌ Error marking ad as sold:', error);
              this.showToast('Error marking ad as sold', 'danger');
            } finally {
              this.isLoading = false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Delete ad
   */
  async deleteAd(ad: Ad) {
    const alert = await this.alertController.create({
      header: 'Delete Ad',
      message: `Are you sure you want to delete "${ad.title}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              this.isLoading = true;
              await this.adService.deleteAd(ad.id);
              this.showToast('Ad deleted successfully', 'success');
              this.loadMyAds();
            } catch (error) {
              console.error('❌ Error deleting ad:', error);
              this.showToast('Error deleting ad', 'danger');
            } finally {
              this.isLoading = false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Navigate to add new ad
   */
  navigateToAddAd() {
    this.router.navigate(['/auth/add-new-product']);
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'sold':
        return 'medium';
      case 'expired':
        return 'danger';
      case 'pendingApproval':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'medium';
    }
  }

  /**
   * Get status label
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'sold':
        return 'Sold';
      case 'expired':
        return 'Expired';
      case 'pendingApproval':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
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
    this.loadMyAds();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  }
}
