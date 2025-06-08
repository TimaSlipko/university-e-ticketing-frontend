import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html'
})
export class ProfileViewComponent implements OnInit {
  profile: User | null = null;
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = '';

    // Make API call to get fresh profile data
    const userType = this.authService.userType;
    let profileService;

    switch (userType) {
      case 1:
        profileService = this.userService.getProfile();
        break;
      case 2:
        profileService = this.userService.getSellerProfile();
        break;
      case 3:
        profileService = this.userService.getAdminProfile();
        break;
      default:
        this.error = 'Invalid user type';
        this.loading = false;
        return;
    }

    profileService.subscribe({
      next: (response) => {
        this.profile = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  getUserTypeLabel(): string {
    const userType = this.authService.userType;
    switch (userType) {
      case 1:
        return 'Customer';
      case 2:
        return 'Event Organizer';
      case 3:
        return 'Administrator';
      default:
        return 'Unknown';
    }
  }

  getMemberSince(): string {
    // Since we don't have created_at from backend, return a placeholder
    return 'Jan 2024';
  }

  confirmDeleteAccount(): void {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmed) {
      this.deleteAccount();
    }
  }

  deleteAccount(): void {
    const userType = this.authService.userType;
    let deleteService;

    switch (userType) {
      case 1:
        deleteService = this.userService.deleteAccount();
        break;
      case 2:
        deleteService = this.userService.deleteSellerAccount();
        break;
      case 3:
        // Admin accounts typically can't be deleted by themselves
        alert('Admin accounts cannot be self-deleted. Contact system administrator.');
        return;
      default:
        alert('Invalid user type');
        return;
    }

    deleteService.subscribe({
      next: () => {
        alert('Account deleted successfully');
        this.authService.logout();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to delete account');
      }
    });
  }
}