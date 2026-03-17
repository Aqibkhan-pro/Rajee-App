import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RAuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private storageService: StorageService
  ) {}

  // ✅ Forgot Password / Reset Password via Resend OTP (Firebase Cloud Function)
  async resetPassword(email: string) {
    const endpoint = 'https://us-central1-rajee-198a5.cloudfunctions.net/sendResetOtp';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      await res.text();
      throw new Error('OTP service unavailable. Please try again later.');
    }

    const result = await res.json();
    if (result?.success) {
      return result;
    }

    throw new Error(result?.message || 'Failed to send password reset OTP');
  }

  // Firebase email/password login
  loginWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Optional: logout
  logout() {
    this.storageService.removeItem('userData');
    this.storageService.removeItem('isLoggedIn');
    this.storageService.removeItem('userEmail');
    return this.afAuth.signOut();
  }

  // Optional: register
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async getIdToken() {
    const user = await this.afAuth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }
}
