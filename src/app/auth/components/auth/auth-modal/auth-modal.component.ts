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
  standalone: false
})
export class AuthModalComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  isLoading: boolean = false;
  selectedLanguage: string = 'ar';
  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: RAuthService,
    private toastService: ToastService,
    private storageService: StorageService,
    private modalCtrl : ModalController,
    private userService : UserService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.selectedLanguage = savedLang;
    }
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  creatAccount() {
    this.modalCtrl.dismiss(null, 'warning');
    this.navCtrl.navigateForward(['auth/signup']);
  }
  callDetailUserApi() {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.authService.loginWithEmail(email, password)
      .then(async (res) => {
        try {
          // ✅ Wait for token
          const idToken = await res.user?.getIdToken();

          // ✅ Wait for user (and require it)
          if (!res?.user?.uid) throw new Error('UID missing');

          // const pUser = await this.userService.getUserById(res.user.uid);

          // // ✅ If API returns empty, stop
          // if (!pUser) throw new Error('User profile not found');

          // ✅ Only now continue
          const userData = {
            uid: res.user.uid,
            email: res.user.email,
            name: res.user.displayName,
            photoURL: res.user.photoURL,
            emailVerified: res.user.emailVerified,
            loginTime: new Date().toISOString(),
            idToken,
          };

          this.storageService.setItem('userData', userData);
          this.storageService.setItem('isLoggedIn', true);
          this.storageService.setItem(constants.Started, true);

          this.toastService.showToast('Login successful...', ToastType.SUCCESS);
          this.modalCtrl.dismiss(null, 'success');
        } catch (err: any) {
          // ✅ If getUserById fails, DO NOT proceed
          console.error('Login ok, but getUserById/token failed:', err);
          this.toastService.showToast(err?.message || 'Unable to load user profile', ToastType.ERROR);
          return; // stops here
        } finally {
          this.isLoading = false;
        }
      })
      .catch((err) => {
        this.isLoading = false;
        console.error('Firebase login error:', err);
        this.toastService.showToast('Login error', ToastType.ERROR);
        alert(err.message || 'Login failed. Please try again.');
      });
  }

  dismiss(){
    this.modalCtrl.dismiss(null, 'close');
  }



showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

}
