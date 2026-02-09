import { Component, OnInit } from '@angular/core';
type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
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
      title: 'Payment received',
      message: 'Your invoice #INV-1023 has been paid successfully.',
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New message',
      message: 'You have a new message from Support team.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Storage almost full',
      message: 'Your storage is 90% used. Consider upgrading your plan.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'danger',
      title: 'Login alert',
      message: 'A new login was detected from a different device.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: true
    }
  ];

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

    if (sec < 45) return 'just now';
    if (min < 60) return `${min} min ago`;
    if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
    if (day < 7) return `${day} day${day > 1 ? 's' : ''} ago`;

    return new Date(date).toLocaleDateString();
  }
}
