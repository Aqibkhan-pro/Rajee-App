import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface AppNotification {
  id: number;
  type: NotificationType;
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  createdAt: Date;
  read: boolean;
  link?: string;
}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: false
})
export class NotificationsComponent implements OnInit {


  filter: 'all' | 'unread' = 'all';

  notifications: AppNotification[] = [
    {
      id: 1,
      type: 'success',
      titleKey: 'notifications.payment_received_title',
      messageKey: 'notifications.payment_received_message',
      messageParams: { invoice: 'INV-1023' },
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'info',
      titleKey: 'notifications.new_message_title',
      messageKey: 'notifications.new_message_message',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'warning',
      titleKey: 'notifications.storage_full_title',
      messageKey: 'notifications.storage_full_message',
      messageParams: { percent: 90 },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'danger',
      titleKey: 'notifications.login_alert_title',
      messageKey: 'notifications.login_alert_message',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true
    }
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get filteredNotifications(): AppNotification[] {
    const list = this.filter === 'unread'
      ? this.notifications.filter(n => !n.read)
      : this.notifications;

    // newest on top
    return [...list].sort((a, b) => +b.createdAt - +a.createdAt);
  }

  setFilter(value: 'all' | 'unread') {
    this.filter = value;
  }

  markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  markAsRead(item: AppNotification) {
    if (item.read) return;
    this.notifications = this.notifications.map(n =>
      n.id === item.id ? { ...n, read: true } : n
    );
  }

  remove(item: AppNotification, ev?: MouseEvent) {
    ev?.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== item.id);
  }

  clearAll() {
    this.notifications = [];
  }

  trackById(_: number, item: AppNotification) {
    return item.id;
  }

  // Simple "time ago"
  timeAgo(date: Date): string {
    const diff = Math.max(0, Date.now() - new Date(date).getTime());
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (sec < 45) return this.translate.instant('notifications.just_now');
    if (min < 60) return this.translate.instant('notifications.min_ago', { value: min });
    if (hr < 24) return this.translate.instant('notifications.hour_ago', { value: hr });
    if (day < 7) return this.translate.instant('notifications.day_ago', { value: day });

    return new Date(date).toLocaleDateString();
  }
}
