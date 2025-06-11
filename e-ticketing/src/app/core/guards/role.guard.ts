// src/app/core/guards/role.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    const requiredRoles: number[] = route.data['roles'];
    
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const userType = this.authService.userType;
    
    if (requiredRoles && userType && requiredRoles.includes(userType)) {
      return true;
    }

    this.redirectToAuthorizedRoute(userType);
    return false;
  }

  private redirectToAuthorizedRoute(userType: number | null): void {
    switch (userType) {
      // case 3:
      //   this.router.navigate(['/dashboard/admin']);
      //   break;
      case 2:
        this.router.navigate(['/dashboard/seller']);
        break;
      case 1:
        this.router.navigate(['/dashboard/user']);
        break;
      default:
        this.router.navigate(['/events']);
    }
  }
}