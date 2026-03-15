/**
 * Report Service
 * Handles reporting ads, users, reviews - part of marketplace safety
 */

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Report } from '../shared/models/marketplace.models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportsCache$ = new BehaviorSubject<Report[]>([]);

  constructor(private db: AngularFireDatabase) {}

  /**
   * Create a report (user submits)
   */
  async submitReport(reportData: Partial<Report>): Promise<Report> {
    try {
      const newReportRef = this.db.list('reports').push({
        ...reportData,
        status: 'open',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const id = newReportRef.key;
      console.log('✅ Report submitted successfully:', id);
      
      return { id, ...reportData } as Report;
    } catch (error) {
      console.error('❌ Error submitting report:', error);
      throw error;
    }
  }

  /**
   * Get all reports (admin only)
   */
  getAllReports(): Observable<Report[]> {
    return this.db.list<Report>('reports').valueChanges().pipe(
      map(reports => reports.sort((a, b) => b.createdAt - a.createdAt)),
      tap(reports => this.reportsCache$.next(reports)),
      catchError(err => {
        console.error('Error fetching reports:', err);
        return Promise.resolve([]);
      })
    );
  }

  /**
   * Get open reports (admin - for moderation queue)
   */
  getOpenReports(): Observable<Report[]> {
    return this.getAllReports().pipe(
      map(reports => reports.filter(r => r.status === 'open'))
    );
  }

  /**
   * Get reports for specific ad
   */
  getAdReports(adId: string): Observable<Report[]> {
    return this.getAllReports().pipe(
      map(reports => reports.filter(r => 
        r.reportType === 'ad' && r.reportedItemId === adId
      ))
    );
  }

  /**
   * Get reports for specific user
   */
  getUserReports(userId: string): Observable<Report[]> {
    return this.getAllReports().pipe(
      map(reports => reports.filter(r => 
        r.reportedUserId === userId || r.reporterId === userId
      ))
    );
  }

  /**
   * Get single report by ID
   */
  getReportById(reportId: string): Observable<Report | null> {
    return this.db.object<Report>(`reports/${reportId}`)
      .valueChanges()
      .pipe(
        map(report => report || null),
        catchError(err => {
          console.error('Error fetching report:', err);
          return Promise.resolve(null);
        })
      );
  }

  /**
   * Update report status (admin resolves)
   */
  async resolveReport(
    reportId: string,
    resolution: string,
    actionTaken: 'none' | 'warning' | 'adRemoved' | 'userSuspended' | 'userBanned',
    adminId: string
  ): Promise<void> {
    try {
      await this.db.object(`reports/${reportId}`).update({
        status: 'resolved',
        resolution: resolution,
        actionTaken: actionTaken,
        resolvedBy: adminId,
        resolvedAt: Date.now(),
        updatedAt: Date.now()
      });
      console.log('✅ Report resolved');
    } catch (error) {
      console.error('❌ Error resolving report:', error);
      throw error;
    }
  }

  /**
   * Dismiss report (admin finds it not valid)
   */
  async dismissReport(reportId: string, reason: string, adminId: string): Promise<void> {
    try {
      await this.db.object(`reports/${reportId}`).update({
        status: 'dismissed',
        resolution: reason,
        resolvedBy: adminId,
        resolvedAt: Date.now(),
        updatedAt: Date.now()
      });
      console.log('✅ Report dismissed');
    } catch (error) {
      console.error('❌ Error dismissing report:', error);
      throw error;
    }
  }

  /**
   * Put report under review (admin is investigating)
   */
  async putUnderReview(reportId: string, adminId: string): Promise<void> {
    try {
      await this.db.object(`reports/${reportId}`).update({
        status: 'underReview',
        resolvedBy: adminId,
        updatedAt: Date.now()
      });
      console.log('✅ Report put under review');
    } catch (error) {
      console.error('❌ Error putting report under review:', error);
      throw error;
    }
  }

  /**
   * Check if user has already reported this item
   */
  hasUserReported(userId: string, itemId: string, reportType: string): Observable<boolean> {
    return this.getAllReports().pipe(
      map(reports => {
        return reports.some(r =>
          r.reporterId === userId &&
          r.reportedItemId === itemId &&
          r.reportType === reportType &&
          (r.status === 'open' || r.status === 'underReview')
        );
      })
    );
  }

  /**
   * Get report count by reason
   */
  getReportStatistics(): Observable<{
    [key: string]: number;
  }> {
    return this.getAllReports().pipe(
      map(reports => {
        const stats: { [key: string]: number } = {};
        reports.forEach(r => {
          stats[r.reason] = (stats[r.reason] || 0) + 1;
        });
        return stats;
      })
    );
  }

  /**
   * Get most reported items
   */
  getMostReportedItems(limit: number = 10): Observable<any[]> {
    return this.getAllReports().pipe(
      map(reports => {
        const itemReports: { [key: string]: number } = {};
        reports.forEach(r => {
          if (r.status === 'open' || r.status === 'underReview') {
            const key = `${r.reportType}:${r.reportedItemId}`;
            itemReports[key] = (itemReports[key] || 0) + 1;
          }
        });

        return Object.entries(itemReports)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([key, count]) => {
            const [type, id] = key.split(':');
            return { type, id, reportCount: count };
          });
      })
    );
  }

  /**
   * Get report trends (reports over time)
   */
  getReportTrends(days: number = 30): Observable<any[]> {
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.getAllReports().pipe(
      map(reports => {
        const trends: { [key: string]: number } = {};

        reports
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
   * Get cached reports
   */
  getCachedReports(): Observable<Report[]> {
    return this.reportsCache$.asObservable();
  }

  /**
   * Check report status for an ad (for deletion warnings)
   */
  getAdReportStatus(adId: string): Observable<{
    totalReports: number;
    pendingReports: number;
    reportedCount: number;
    shouldRemove: boolean;
  }> {
    return this.getAdReports(adId).pipe(
      map(reports => {
        const total = reports.length;
        const pending = reports.filter(r => r.status === 'open' || r.status === 'underReview').length;

        // Remove ad if it has 3+ reports and no dismissals
        const shouldRemove = pending >= 3;

        return {
          totalReports: total,
          pendingReports: pending,
          reportedCount: total,
          shouldRemove: shouldRemove
        };
      })
    );
  }

  /**
   * Auto-action on high reports (runs periodically)
   */
  async processHighReportAds(): Promise<void> {
    try {
      const reports = await this.getAllReports().toPromise();
      if (!reports) return;

      // Group by ad
      const adReports: { [key: string]: Report[] } = {};
      reports.forEach(r => {
        if (r.reportType === 'ad' && (r.status === 'open' || r.status === 'underReview')) {
          if (!adReports[r.reportedItemId]) {
            adReports[r.reportedItemId] = [];
          }
          adReports[r.reportedItemId].push(r);
        }
      });

      // Action on high report count
      for (const [adId, adReportList] of Object.entries(adReports)) {
        if (adReportList.length >= 5) {
          // Auto-remove ad with high report count
          // This would trigger ad removal and report resolution
          console.log(`⚠️ Ad ${adId} has ${adReportList.length} reports - should be reviewed`);
        }
      }
    } catch (error) {
      console.error('Error processing reports:', error);
    }
  }

  /**
   * Export reports (for backup/analysis)
   */
  async exportReports(): Promise<string> {
    try {
      const reports = await this.getAllReports().toPromise();
      return JSON.stringify(reports, null, 2);
    } catch (error) {
      console.error('Error exporting reports:', error);
      throw error;
    }
  }
}
