import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UpdateProfileRequest } from '../../../../core/models';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html'
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  currentUser: any = null;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    // Get fresh data from API based on user type
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
        return;
    }

    profileService.subscribe({
      next: (response) => {
        this.currentUser = response.data;
        this.profileForm.patchValue({
          name: this.currentUser.name,
          surname: this.currentUser.surname,
          username: this.currentUser.username
        });
      },
      error: (error) => {
        console.error('Failed to load user data:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.loading) {
      this.loading = true;
      this.clearMessages();

      const updateData: UpdateProfileRequest = {};
      const formValue = this.profileForm.value;

      // Only include changed fields
      if (formValue.name !== this.currentUser?.name) {
        updateData.name = formValue.name;
      }
      if (formValue.surname !== this.currentUser?.surname) {
        updateData.surname = formValue.surname;
      }
      if (formValue.username !== this.currentUser?.username) {
        updateData.username = formValue.username;
      }

      // If no changes, don't make request
      if (Object.keys(updateData).length === 0) {
        this.loading = false;
        this.successMessage = 'No changes to save.';
        return;
      }

      // Use appropriate update method based on user type
      const userType = this.authService.userType;
      let updateService;

      switch (userType) {
        case 1:
          updateService = this.userService.updateProfile(updateData);
          break;
        case 2:
          updateService = this.userService.updateSellerProfile(updateData);
          break;
        default:
          this.loading = false;
          this.errorMessage = 'Invalid user type';
          return;
      }

      updateService.subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = 'Profile updated successfully!';
          
          // Reload current user to get fresh data
          this.loadCurrentUser();
          
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    switch (fieldName) {
      case 'name': return 'First name';
      case 'surname': return 'Last name';
      case 'username': return 'Username';
      default: return fieldName;
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }
}