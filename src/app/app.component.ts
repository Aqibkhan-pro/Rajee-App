import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from './auth/services/auth.service';
import { constants } from './shared/utils/constants';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onIdTokenChanged, User } from 'firebase/auth';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private userService: UserService,
    private router: Router
  ) {
    this.initThemeAndLanguage();
    this.initializeFirebaseAndKeepTokenFresh();
    this.listenDeepLinks();
  }

    listenDeepLinks() {
      App.addListener('appUrlOpen', (data: any) => {
        const url: string = data?.url || '';

        // Examples:
        // https://yourdomain.com/product/170...
        // myapp://product/170...

        const match = url.match(/\/product\/([^\/\?]+)/);
        if (match && match[1]) {
          const id = match[1];
          this.router.navigateByUrl(`/product/${id}`);
        }
      });
    }

  // =========================
  // THEME + LANGUAGE
  // =========================
  private initThemeAndLanguage() {
    // THEME
    const theme = localStorage.getItem(constants.Theme) || '';
    if (theme) this.authService.changeTheme(theme);

    // LANGUAGE
    let lang = localStorage.getItem('lang');
    if (!lang) {
      lang = 'ar';
      localStorage.setItem('lang', lang);
    }
    this.setLanguage(lang);

    /* LISTEN FOR LANGUAGE CHANGE */
    this.translate.onLangChange.subscribe(event => {
      this.setLanguage(event.lang);
    });
  }

  /**
   * Apply selected language globally
   */
  private setLanguage(lang: string) {
    this.translate.use(lang);
    document.documentElement.lang = lang;
    // document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  // =========================
  // FIREBASE + TOKEN REFRESH
  // =========================
  private initializeFirebaseAndKeepTokenFresh() {
    try {
      // Init firebase once
      if (!getApps().length) {
        initializeApp(environment.firebase);
        console.log('✅ Firebase initialized');
      }

      const auth = getAuth();

      // ✅ IMPORTANT:
      // onIdTokenChanged fires on app start AND whenever Firebase refreshes the token
      onIdTokenChanged(auth, async (user: User | null) => {
        if (!user) {
          console.log('No user logged in');
          // optional: clear token so REST calls won't use old token
          const old = JSON.parse(localStorage.getItem('userData') || '{}');
          old.idToken = '';
          localStorage.setItem('userData', JSON.stringify(old));
          return;
        }

        try {
          // ✅ get latest token (Firebase refreshes automatically)
          const idToken = await user.getIdToken();

          // ✅ save fresh token for your REST calls (Realtime DB .json?auth=)
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          userData.idToken = idToken;
          userData.uid = user.uid;
          userData.email = user.email || '';
          userData.photoURL = user.photoURL || '';

          localStorage.setItem('userData', JSON.stringify(userData));

          // ✅ load profile from your realtime DB (uses token from localStorage in your service)
          const pUser = await this.userService.getUserById(user.uid);

          // If you store users under /users/{uid}, make sure that exists
          if (pUser) {
            userData.name = pUser?.name || user.displayName || '';
            localStorage.setItem('userData', JSON.stringify(userData));
          }

          console.log('✅ Token updated in localStorage for:', user.uid);
        } catch (err) {
          console.error('Token refresh failed:', err);

          const toast = await this.toastCtrl.create({
            message: 'Session expired, please login again',
            duration: 3000,
            color: 'danger',
          });
          toast.present();
        }
      });
    } catch (err) {
      console.error('Firebase initialization failed:', err);
      this.toastCtrl
        .create({
          message: 'Firebase initialization failed',
          duration: 3000,
          color: 'danger',
        })
        .then((t) => t.present());
    }
  }
}
