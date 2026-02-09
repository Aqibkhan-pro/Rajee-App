import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subscription, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

type SegTab = 'followers' | 'following';

interface UserProfile {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: number;
}

interface FollowRow {
  uid: string;
  followedAt: number;
}

interface FollowItem extends UserProfile {
  followedAt: number;
}

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
  standalone: false
})
export class FollowersComponent implements OnInit, OnDestroy {

  selectedTab: SegTab = 'followers';

  currentUserId = '';
  loadingFollowers = true;
  loadingFollowing = true;

  followers: FollowItem[] = [];
  following: FollowItem[] = [];

  private followersSub?: Subscription;
  private followingSub?: Subscription;

  private userCache: Record<string, UserProfile> = {};

  constructor(private db: AngularFireDatabase) {}

  async ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.currentUserId = userData?.uid || '';

    if (!this.currentUserId) {
      this.loadingFollowers = false;
      this.loadingFollowing = false;
      return;
    }

    this.listenFollowers(this.currentUserId);
    this.listenFollowing(this.currentUserId);
  }

  ngOnDestroy(): void {
    this.followersSub?.unsubscribe();
    this.followingSub?.unsubscribe();
  }

  onSegmentChange(ev: any) {
    this.selectedTab = ev?.detail?.value as SegTab;
  }

  // -------------------- Realtime listeners --------------------

  private listenFollowers(uid: string) {
    this.loadingFollowers = true;

    this.followersSub = this.db
      .list(`followers/${uid}`)
      .snapshotChanges()
      .subscribe(async (snaps) => {
        const base: FollowRow[] = snaps
          .map(s => {
            const key = s.key || '';
            const val: any = s.payload.val() || {};
            return {
              uid: key,
              followedAt: Number(val?.followedAt || 0)
            };
          })
          .filter(x => !!x.uid);

        this.followers = await this.hydrateUsers(base);
        this.loadingFollowers = false;
      });
  }

  private listenFollowing(uid: string) {
    this.loadingFollowing = true;

    this.followingSub = this.db
      .list(`following/${uid}`)
      .snapshotChanges()
      .subscribe(async (snaps) => {
        const base: FollowRow[] = snaps
          .map(s => {
            const key = s.key || '';
            const val: any = s.payload.val() || {};
            return {
              uid: key,
              followedAt: Number(val?.followedAt || 0)
            };
          })
          .filter(x => !!x.uid);

        this.following = await this.hydrateUsers(base);
        this.loadingFollowing = false;
      });
  }

  // -------------------- Helpers --------------------

  private async hydrateUsers(rows: FollowRow[]): Promise<FollowItem[]> {
    const items = await Promise.all(
      rows.map(async (r) => {
        const cached = this.userCache[r.uid];
        if (cached) return { ...cached, followedAt: r.followedAt } as FollowItem;

        const profile = await firstValueFrom(
          this.db.object<UserProfile>(`users/${r.uid}`).valueChanges().pipe(take(1))
        );

        const normalized: UserProfile = {
          uid: r.uid,
          name: profile?.name || 'Unknown',
          email: profile?.email || '',
          phone: profile?.phone || '',
          createdAt: Number(profile?.createdAt || 0)
        };

        this.userCache[r.uid] = normalized;
        return { ...normalized, followedAt: r.followedAt } as FollowItem;
      })
    );

    // sort by latest follow time
    return items
      .filter(Boolean)
      .sort((a, b) => (b.followedAt || 0) - (a.followedAt || 0));
  }

  getInitial(name?: string) {
    return (name || 'U').trim().charAt(0).toUpperCase();
  }

  formatTime(timestamp: number): string {
    if (!timestamp) return '';

    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString();
  }

  // optional pull to refresh (realtime already, but feels nice)
  doRefresh(ev: any) {
    setTimeout(() => ev?.target?.complete(), 500);
  }
}
