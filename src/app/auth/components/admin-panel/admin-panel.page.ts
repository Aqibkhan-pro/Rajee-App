import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ReportService } from '../../../services/report.service';
import { UserService } from '../../../services/user.service';
import { AdService } from '../../../services/ad.service';
import { StorageService } from '../../../services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  openReports: number;
  resolvedReports: number;
  totalReports: number;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
  standalone: false
})
export class AdminPanelPage implements OnInit, OnDestroy {
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  // Stats
  stats: AdminStats = {
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    openReports: 0,
    resolvedReports: 0,
    totalReports: 0
  };

  // Tabs
  currentTab = 'dashboard'; // 'dashboard', 'reports', 'users', 'ads', 'categories'
  isLoading = false;

  // Reports data
  openReports: any[] = [];
  selectedReport: any = null;

  private destroy$ = new Subject<void>();

  // Language support
  currentLang: string = 'en';
  translations: any = {
    en: {
      adminPanel: 'Admin Panel',
      dashboard: 'Dashboard',
      reports: 'Reports',
      users: 'Users',
      ads: 'Ads',
      categories: 'Categories',
      totalUsers: 'Total Users',
      activeUsers: 'Active Users',
      suspendedUsers: 'Suspended Users',
      totalAds: 'Total Ads',
      activeAds: 'Active Ads',
      pendingAds: 'Pending Ads',
      openReports: 'Open Reports',
      resolvedReports: 'Resolved Reports',
      manageUsers: 'Manage Users',
      manageAds: 'Manage Ads',
      moderationQueue: 'Moderation Queue',
      analytics: 'Analytics'
    },
    ar: {
      adminPanel: 'لوحة التحكم',
      dashboard: 'لوحة المعلومات',
      reports: 'التقارير',
      users: 'المستخدمون',
      ads: 'الإعلانات',
      categories: 'الفئات',
      totalUsers: 'إجمالي المستخدمين',
      activeUsers: 'المستخدمون النشطون',
      suspendedUsers: 'المستخدمون المعلقون',
      totalAds: 'إجمالي الإعلانات',
      activeAds: 'الإعلانات النشطة',
      pendingAds: 'الإعلانات قيد الانتظار',
      openReports: 'التقارير المفتوحة',
      resolvedReports: 'التقارير المحلولة',
      manageUsers: 'إدارة المستخدمين',
      manageAds: 'إدارة الإعلانات',
      moderationQueue: 'قائمة الاعتدال',
      analytics: 'التحليلات'
    }
  };

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private reportService: ReportService,
    private userService: UserService,
    private adService: AdService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAdminAccess();
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.loadDashboardStats();
    this.loadOpenReports();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if user is admin
   */
  checkAdminAccess() {
    // Check if user has admin role from localStorage
    const userData = this.storageService.getItem('userData');
    const userRole = userData?.role || 'user';
    
    if (userRole !== 'admin') {
      this.showToast('You do not have admin access', 'danger');
      this.router.navigate(['/main/home']);
    }
  }

  /**
   * Get translation
   */
  t(key: string): string {
    return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
  }

  /**
   * Load dashboard statistics
   */
  async loadDashboardStats() {
    try {
      this.isLoading = true;

      // Get users
      const users = await this.userService.loadAllUsers();
      this.stats.totalUsers = users.length;
      this.stats.activeUsers = users.filter((u: any) => u.accountStatus === 'active').length;
      this.stats.suspendedUsers = users.filter((u: any) => u.accountStatus === 'suspended').length;

      // Get ads - using active ads observable
      this.adService.getAllActiveAds(1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe((ads: any) => {
          this.stats.totalAds = ads.length;
          this.stats.activeAds = ads.filter((ad: any) => ad.status === 'active').length;
          this.stats.pendingAds = ads.filter((ad: any) => ad.status === 'pendingApproval').length;
        });

      // Get reports
      this.reportService.getAllReports()
        .pipe(takeUntil(this.destroy$))
        .subscribe((reports: any) => {
          this.stats.totalReports = reports.length;
          this.stats.openReports = reports.filter((r: any) => r.status === 'open').length;
          this.stats.resolvedReports = reports.filter((r: any) => r.status === 'resolved').length;
        });

      this.isLoading = false;
    } catch (error) {
      console.error('❌ Error loading dashboard stats:', error);
      this.showToast('Error loading statistics', 'danger');
      this.isLoading = false;
    }
  }

  /**
   * Load open reports
   */
  async loadOpenReports() {
    try {
      this.reportService.getOpenReports()
        .pipe(takeUntil(this.destroy$))
        .subscribe((reports) => {
          this.openReports = reports.slice(0, 10); // Show top 10
        });
    } catch (error) {
      console.error('❌ Error loading reports:', error);
    }
  }

  /**
   * Switch admin tab
   */
  switchTab(tab: string) {
    this.currentTab = tab;

    if (tab === 'reports') {
      this.loadOpenReports();
    } else if (tab === 'dashboard') {
      this.loadDashboardStats();
    }
  }

  /**
   * View report details
   */
  async viewReportDetails(report: any) {
    this.selectedReport = report;

    const alert = await this.alertController.create({
      header: 'Report Details',
      subHeader: `Report ID: ${report.id}`,
      message: `
        Reason: ${report.reason}<br>
        Status: ${report.status}<br>
        Created: ${new Date(report.createdAt).toLocaleDateString()}
      `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Resolve',
          handler: () => this.resolveReport(report)
        },
        {
          text: 'Dismiss',
          handler: () => this.dismissReport(report)
        }
      ]
    });

    await alert.present();
  }

  /**
   * Resolve report
   */
  async resolveReport(report: any) {
    const alert = await this.alertController.create({
      header: 'Resolve Report',
      message: 'Select action to take:',
      inputs: [
        {
          name: 'action',
          type: 'radio',
          label: 'Remove Ad',
          value: 'remove_ad'
        },
        {
          name: 'action',
          type: 'radio',
          label: 'Suspend User',
          value: 'suspend_user',
          checked: true
        },
        {
          name: 'action',
          type: 'radio',
          label: 'Warning',
          value: 'warning'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: async (action) => {
            const loading = await this.loadingController.create({
              message: 'Processing...'
            });
            await loading.present();

            try {
              const userData = this.storageService.getItem('userData');
              const adminId = userData?.id || 'system';
              await this.reportService.resolveReport(report.id, `Action: ${action}`, action, adminId);
              await loading.dismiss();
              this.showToast('Report resolved', 'success');
              this.loadOpenReports();
            } catch (error) {
              console.error('❌ Error resolving report:', error);
              await loading.dismiss();
              this.showToast('Error resolving report', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Dismiss report
   */
  async dismissReport(report: any) {
    const userData = this.storageService.getItem('userData');
    const adminId = userData?.id || 'system';
    
    const loading = await this.loadingController.create({
      message: 'Dismissing report...'
    });
    await loading.present();

    try {
      await this.reportService.dismissReport(report.id, 'Dismissed by admin', adminId);
      await loading.dismiss();
      this.showToast('Report dismissed', 'success');
      this.loadOpenReports();
    } catch (error) {
      console.error('❌ Error dismissing report:', error);
      await loading.dismiss();
      this.showToast('Error dismissing report', 'danger');
    }
  }

  /**
   * Navigate sections
   */
  navigateToUsers() {
    this.navCtrl.navigateForward(['/auth/admin-panel/manage-users']);
  }

  navigateToAds() {
    this.navCtrl.navigateForward(['/auth/admin-panel/manage-ads']);
  }

  navigateToCategories() {
    this.navCtrl.navigateForward(['/auth/admin-panel/manage-categories']);
  }

  /**
   * Show toast
   */
  private showToast(message: string, color: string = 'primary') {
    this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'bottom'
    }).then(toast => toast.present());
  }
}
