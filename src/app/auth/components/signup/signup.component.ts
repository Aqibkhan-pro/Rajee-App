import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

/* ================= OTP Validator ================= */
function otpRequiredLength(length: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.toString().length !== length) {
      return { otpLength: true };
    }
    return null;
  };
}

/* ================= User Interface ================= */
interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string | null;
  createdAt: number;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false
})
export class SignupComponent implements OnInit, OnDestroy {
  selectedLanguage : string = 'ar';
  signupForm!: FormGroup;
  otpForm!: FormGroup;

  submitted = false;
  otpFormSubmitted = false;
  isLoading = false;
  otpSent = false;

  countdown = 60;
  canResend = false;
  private countdownInterval: any;

  // ✅ Firebase Database URL
  FIREBASE_DB_URL = 'https://rajee-198a5-default-rtdb.firebaseio.com';

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private ngZone: NgZone,
    private userService : UserService,
    private translate: TranslateService,
  ) {}

  /* ================= Lifecycle ================= */
  ngOnInit() {
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, otpRequiredLength(6)]],
    });
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.selectedLanguage = savedLang;
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  /* ================= Validators ================= */
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /* ================= Getters ================= */
  get fullName() { return this.signupForm.get('fullName'); }
  get phone() { return this.signupForm.get('phone'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get otp() { return this.otpForm.get('otp'); }

  /* ================= Toast ================= */
  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }

  private async requestOtp(fullName: string, phone: string, email: string, password: string) {
    const endpoint = 'https://us-central1-rajee-198a5.cloudfunctions.net/sendOtp';

    const payload = {
      fullName,
      name: fullName,
      phone,
      email,
      password
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

    throw new Error(result?.message || 'OTP send failed');
  }

  /* ================= Database Helpers via REST API with Auth ================= */

  // ✅ GET user from Realtime Database with token
  async getUserFromDb(uid: string, idToken: string): Promise<User | null> {
    try {
      const url = `${this.FIREBASE_DB_URL}/users/${uid}.json?auth=${idToken}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error('DB GET Error:', res.status, res.statusText);
        throw new Error('Failed to fetch user from DB');
      }

      const data = await res.json();
      return data ? data : null;
    } catch (err) {
      console.error('DB GET Error:', err);
      return null;
    }
  }

  // ✅ SAVE user to Realtime Database with token
  async saveUserToDatabase(userData: User, idToken: string): Promise<void> {
    try {
      const url = `${this.FIREBASE_DB_URL}/users/${userData.uid}.json?auth=${idToken}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('DB SAVE Error:', res.status, errorText);
        throw new Error(`Failed to save user to DB: ${errorText}`);
      }

      console.log('✅ User saved successfully to Realtime Database');
    } catch (err) {
      console.error('❌ DB SAVE Error:', err);
      throw err; // Re-throw to handle in calling function
    }
  }

  /* ================= Send OTP ================= */
  async onSendOtp() {
    this.submitted = true;
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    try {
      const { fullName, phone, email, password } = this.signupForm.value;

      await this.requestOtp(fullName, phone, email, password);

      this.otpSent = true;
      this.startCountdown();
      this.showToast('OTP sent. Check Inbox and Spam folder.', 'success');

    } catch (err: any) {
      this.showToast(err.message || 'OTP send fail');
    } finally {
      this.isLoading = false;
    }
  }

  /* ================= Verify OTP + CREATE / LOGIN USER ================= */
  async onVerifyOtp() {
    this.otpFormSubmitted = true;
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) return;

    this.isLoading = true;

    try {
      const { email, password, fullName, phone } = this.signupForm.value;

      /* 🔹 Step 1: Verify OTP via Firebase Functions */
      const res = await fetch('https://us-central1-rajee-198a5.cloudfunctions.net/verifyOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: String(this.otpForm.value.otp),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        await res.text();
        throw new Error('OTP verify service is not deployed correctly (HTML returned).');
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      console.log('✅ OTP verified successfully');

      /* 🔹 Step 2: Create or Login User in Firebase Auth */
      let cred;
      try {
        cred = await this.afAuth.createUserWithEmailAndPassword(email, password);
        console.log('✅ New user created in Firebase Auth');
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          cred = await this.afAuth.signInWithEmailAndPassword(email, password);
          console.log('✅ Existing user logged in');
        } else {
          throw err;
        }
      }

      if (!cred.user) throw new Error('Firebase Auth failed');

      const uid = cred.user.uid;
      console.log('User UID:', uid);

      /* 🔹 Step 3: Get Firebase ID Token */
      const idToken = await cred.user.getIdToken();
      console.log('✅ ID Token received:', idToken.substring(0, 20) + '...');

      /* 🔹 Step 4: Check if user already exists in DB */
      const existingUser = await this.getUserFromDb(uid, idToken);

      /* 🔹 Step 5: Prepare user data */
      const userData: User = {
        uid,
        name: fullName,
        email,
        phone,
        photoURL: null,
        createdAt: existingUser?.createdAt || Date.now(),
      };

      console.log('Saving user data:', userData);

      /* 🔹 Step 6: Save or Update user in Realtime Database */
      await this.saveUserToDatabase(userData, idToken);

      /* 🔹 Step 7: Sign out Firebase user after saving */
      await this.afAuth.signOut();
      console.log('✅ User signed out after registration');

      /* 🔹 Step 8: Navigate to login */
      this.ngZone.run(() => {
        this.showToast('Account ready! Please login', 'success');
        this.navCtrl.navigateForward('auth/login');
      });

    } catch (err: any) {
      console.error('❌ Signup Error:', err);
      this.showToast(err.message || 'Signup failed');
      this.otpForm.reset();
    } finally {
      this.isLoading = false;
    }
  }

  /* ================= Resend OTP ================= */
  async onResendOtp() {
    if (!this.canResend) return;

    this.isLoading = true;
    this.otpForm.reset();

    try {
      const { fullName, phone, email, password } = this.signupForm.value;

      await this.requestOtp(fullName, phone, email, password);

      this.showToast('Resent OTP', 'success');
      this.startCountdown();

    } catch (err: any) {
      this.showToast(err.message || 'Resend OTP failed');
    } finally {
      this.isLoading = false;
    }
  }

  /* ================= Countdown ================= */
  startCountdown() {
    this.countdown = 60;
    this.canResend = false;

    if (this.countdownInterval) clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  goBack() {
    this.otpSent = false;
    this.submitted = false;
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  goToLogin() {
    this.ngZone.run(() => {
      this.navCtrl.navigateBack('/main');
    });
    setTimeout(() =>{
      this.userService.setOpenSubject = 'login';
  }, 800);
  }
}
