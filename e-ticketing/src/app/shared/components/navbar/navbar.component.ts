import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { UserType } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isCollapsed = true;
  userDropdownOpen = false;
  adminDropdownOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get isAdmin(): boolean {
    return this.currentUser?.user_type === 3;
  }

  get isSeller(): boolean {
    return this.currentUser?.user_type === 2;
  }

  get isUser(): boolean {
    return this.currentUser?.user_type === 1;
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.name} ${this.currentUser.surname}`;
    }
    return '';
  }

  getUserTypeLabel(): string {
    switch (this.currentUser?.user_type) {
      case UserType.ADMIN:
        return 'Administrator';
      case UserType.SELLER:
        return 'Event Organizer';
      case UserType.USER:
        return 'Customer';
      default:
        return '';
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  navigateToDashboard(): void {
    switch (this.currentUser?.user_type) {
      case UserType.ADMIN:
        this.router.navigate(['/dashboard/admin']);
        break;
      case UserType.SELLER:
        this.router.navigate(['/dashboard/seller']);
        break;
      case UserType.USER:
        this.router.navigate(['/dashboard/user']);
        break;
      default:
        this.router.navigate(['/events']);
    }
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleUserDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.userDropdownOpen = !this.userDropdownOpen;
    this.adminDropdownOpen = false; // Close other dropdown
  }

  toggleAdminDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.adminDropdownOpen = !this.adminDropdownOpen;
    this.userDropdownOpen = false; // Close other dropdown
  }

  closeDropdowns(): void {
    this.userDropdownOpen = false;
    this.adminDropdownOpen = false;
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.closeDropdowns();
  }

  // Prevent dropdown from closing when clicking inside it
  onDropdownClick(event: Event): void {
    event.stopPropagation();
  }
}