import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/auth/services/common.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { ToastType } from 'src/app/shared/enums/common.enum';

// ✅ If you already initialized firebase in firebase-config, this will work.
import { getAuth } from 'firebase/auth';

type StoredUser = {
  uid?: string;
  idToken?: string;
  email?: string;
  name?: string;
  phone?: string;
  phoneNumber?: string;
  photoURL?: string;
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit, OnDestroy {

  profileForm!: FormGroup;
  subScription: Subscription | null = null;

  // ✅ Your database URL
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  // ✅ IMPORTANT: from your screenshot (your users are inside this node)
  USERS_ROOT = 'TpbTCEe9KxbYJa3BtWFbg4W2Nez1';

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private storageService: StorageService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    const userData = this.getStoredUser();

    // ✅ Build form
    this.profileForm = this.fb.group({
      fullName: [userData?.name || '', [Validators.required]],
      email: [{ value: userData?.email || '', disabled: true }],
      phoneNumber: [userData?.phone || userData?.phoneNumber || ''],
      photoURL: [userData?.photoURL || ''],
      language: [localStorage.getItem('selectedLanguage') || 'en']
    });

    // ✅ Always load latest from Firebase
    await this.loadProfileFromFirebase();

    // Subscribe to login success
    this.subScription = this.commonService.loginSuccess$.subscribe(async (isLoggedIn) => {
      if (isLoggedIn) {
        const newUser = this.getStoredUser();
        this.profileForm.patchValue({
          fullName: newUser?.name || '',
          phoneNumber: newUser?.phone || newUser?.phoneNumber || '',
          photoURL: newUser?.photoURL || ''
        });

        await this.loadProfileFromFirebase();
      }
    });
  }

  // ✅ Get userData from storage (string or object)
  private getStoredUser(): StoredUser {
    const raw = this.storageService.getItem('userData');
    if (!raw) return {};
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return {}; }
    }
    return raw as StoredUser;
  }

  // ✅ Get fresh idToken (your old one may be expired)
  private async getFreshIdToken(): Promise<string | null> {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken(true); // force refresh
    } catch (e) {
      console.error('getFreshIdToken error', e);
      return null;
    }
  }

  // ✅ Load user profile from RTDB
  async loadProfileFromFirebase() {
    try {
      const user = this.getStoredUser();
      if (!user?.uid) return;

      const token = await this.getFreshIdToken();
      if (!token) return;

      const url = `${this.FIREBASE_DB_URL}/${this.USERS_ROOT}/${user.uid}.json?auth=${token}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errText = await res.text();
        console.warn('Firebase read failed:', errText);
        return;
      }

      const dbUser = await res.json();

      if (dbUser) {
        this.profileForm.patchValue({
          fullName: dbUser.name || '',
          phoneNumber: dbUser.phone || '',
          photoURL: dbUser.photoURL || '',
          language: dbUser.language || this.profileForm.get('language')?.value
        });

        // ✅ Keep local storage synced too
        this.storageService.setItem('userData', {
          ...user,
          name: dbUser.name ?? user.name,
          phone: dbUser.phone ?? user.phone,
          photoURL: dbUser.photoURL ?? user.photoURL,
          email: dbUser.email ?? user.email,
          uid: dbUser.uid ?? user.uid
        });
      }
    } catch (e) {
      console.error('loadProfileFromFirebase error', e);
    }
  }

  // ✅ Save profile changes to Firebase + local
  async saveProfile() {
    if (this.profileForm.invalid) {
      this.toastService.showToast('Please enter name', ToastType.ERROR);
      return;
    }

    try {
      const stored = this.getStoredUser();
      if (!stored?.uid) {
        this.toastService.showToast('User not logged in', ToastType.ERROR);
        return;
      }

      const token = await this.getFreshIdToken();
      if (!token) {
        this.toastService.showToast('Token expired, please login again', ToastType.ERROR);
        return;
      }

      const val = this.profileForm.getRawValue();

      // ✅ IMPORTANT: Use same keys in DB (name, phone)
      const payload = {
        name: val.fullName || '',
        phone: val.phoneNumber || '',
        photoURL: val.photoURL || '',
        language: val.language || 'en',
        uid: stored.uid,
        email: stored.email || '',
        updatedAt: Date.now()
      };

      const url = `${this.FIREBASE_DB_URL}/${this.USERS_ROOT}/${stored.uid}.json?auth=${token}`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Firebase update failed:', errText);
        this.toastService.showToast(errText, ToastType.ERROR);
        return;
      }

      // ✅ Update local storage
      this.storageService.setItem('userData', {
        ...stored,
        name: payload.name,
        phone: payload.phone,
        photoURL: payload.photoURL
      });

      localStorage.setItem('selectedLanguage', payload.language);

      this.toastService.showToast('Profile updated successfully!', ToastType.SUCCESS);
    } catch (err: any) {
      console.error('saveProfile error', err);
      this.toastService.showToast(err?.message || 'Update failed', ToastType.ERROR);
    }
  }

  onLanguageChange(event: any) {
    localStorage.setItem('selectedLanguage', event.detail.value);
  }

  ngOnDestroy() {
    this.subScription?.unsubscribe();
    this.subScription = null;
  }

  logout() {
    // implement as your app needs
  }

  changeProfilePicture(){}
}
