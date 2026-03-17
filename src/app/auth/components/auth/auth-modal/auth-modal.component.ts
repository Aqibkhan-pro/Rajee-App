import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { RAuthService } from 'src/app/services/r-auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';
import { ToastType } from 'src/app/shared/enums/common.enum';
import { constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
  standalone: false,
})
export class AuthModalComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  selectedLanguage: string = 'ar';

  showPassword = false;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: RAuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    const savedLang = localStorage.getItem('lang');
    if (savedLang) this.selectedLanguage = savedLang;
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  creatAccount() {
    this.modalCtrl.dismiss(null, 'warning');
    this.navCtrl.navigateForward(['auth/signup']);
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'close');
  }

  // ✅ FORGOT PASSWORD (OTP API)
  forgotPassword() {
    this.submitted = true;

    const email = (this.email?.value || '').trim();

    if (!email) {
      this.translate.get('email_enter_first').subscribe((msg) => {
        this.toastService.showToast(msg, ToastType.ERROR);
      });
      return;
    }

    if (this.email.invalid) {
      this.translate.get('email_invalid_format').subscribe((msg) => {
        this.toastService.showToast(msg, ToastType.ERROR);
      });
      return;
    }

    this.isLoading = true;

    // Sends OTP for password reset (no Firebase reset-link email)
    this.authService
      .resetPassword(email)
      .then(() => {
        this.translate.get('password_reset_sent').subscribe((msg) => {
          this.toastService.showToast(msg, ToastType.SUCCESS);
        });
      })
      .catch((err: any) => {
        console.error('Reset password error:', err);

        const code = err?.code;
        if (code === 'auth/user-not-found') {
          this.translate.get('user_not_found').subscribe((msg) => {
            this.toastService.showToast(msg, ToastType.ERROR);
          });
        } else if (code === 'auth/invalid-email') {
          this.translate.get('invalid_email_error').subscribe((msg) => {
            this.toastService.showToast(msg, ToastType.ERROR);
          });
        } else if (code === 'auth/too-many-requests') {
          this.translate.get('too_many_requests').subscribe((msg) => {
            this.toastService.showToast(msg, ToastType.ERROR);
          });
        } else {
          this.translate.get('unable_to_send_reset').subscribe((msg) => {
            this.toastService.showToast(err?.message || msg, ToastType.ERROR);
          });
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  // ✅ LOGIN
  callDetailUserApi() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.authService
      .loginWithEmail(email, password)
      .then(async (res) => {
        try {
          const idToken = await res.user?.getIdToken();
          if (!res?.user?.uid) throw new Error('UID missing');

          const dbUser = await this.userService.getUserByIdWithToken(res.user.uid, idToken || '');
          const isAdmin = !!(dbUser as any)?.is_admin || !!(dbUser as any)?.isAdmin || (dbUser as any)?.role === 'admin';

          const userData = {
            uid: res.user.uid,
            email: res.user.email,
            name: dbUser?.name || res.user.displayName,
            photoURL: res.user.photoURL,
            emailVerified: res.user.emailVerified,
            loginTime: new Date().toISOString(),
            idToken,
            is_admin: isAdmin,
            isAdmin,
            role: isAdmin ? 'admin' : 'user'
          };

          this.storageService.setItem('userData', userData);
          this.storageService.setItem('isLoggedIn', true);
          this.storageService.setItem(constants.Started, true);

          this.translate.get('login_successful').subscribe((msg) => {
            this.toastService.showToast(msg, ToastType.SUCCESS);
          });
          this.modalCtrl.dismiss(null, 'success');
        } catch (err: any) {
          console.error('Login ok, but token/profile failed:', err);
          this.translate.get('unable_to_load_profile').subscribe((msg) => {
            this.toastService.showToast(
              err?.message || msg,
              ToastType.ERROR
            );
          });
          return;
        } finally {
          this.isLoading = false;
        }
      })
      .catch((err) => {
        this.isLoading = false;
        console.error('Firebase login error:', err);
        this.translate.get('login_failed_retry').subscribe((msg) => {
          this.toastService.showToast(msg, ToastType.ERROR);
          // Optional: Show alert if needed
          // alert(err?.message || msg);
        });
      });
  }
}
