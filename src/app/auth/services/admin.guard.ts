import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const userData = this.storageService.getItem('userData') || {};
    const uid = userData?.uid;
    const token = userData?.idToken;

    if (!uid || !token) {
      this.router.navigate(['/main']);
      return false;
    }

    const user = await this.userService.getUserByIdWithToken(uid, token);
    const isAdmin = !!(user as any)?.is_admin || !!(user as any)?.isAdmin || (user as any)?.role === 'admin';

    if (!isAdmin) {
      this.router.navigate(['/main']);
      return false;
    }

    this.storageService.setItem('userData', {
      ...userData,
      ...user,
      is_admin: true,
      isAdmin: true,
      role: 'admin'
    });

    return true;
  }
}
