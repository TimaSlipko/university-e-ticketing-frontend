import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChangePasswordRequest } from '../../../../core/models';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password');
    const confirmPassword = form.get('confirm_password');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.valid && !this.loading) {
      this.loading = true;
      this.clearMessages();

      const changePasswordData: ChangePasswordRequest = {
        current_password: this.passwordForm.get('current_password')?.value,
        new_password: this.passwordForm.get('new_password')?.value
      };

      // Use appropriate service method based on user type
      const userType = this.authService.userType;
      let changePasswordService;

      switch (userType) {
        case 1:
          changePasswordService = this.userService.changePassword(changePasswordData);
          break;
        case 2:
          changePasswordService = this.userService.changeSellerPassword(changePasswordData);
          break;
        case 3:
          changePasswordService = this.userService.changeAdminPassword(changePasswordData);
          break;
        default:
          this.loading = false;
          this.errorMessage = 'Invalid user type';
          return;
      }

      changePasswordService.subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Password changed successfully!';
          this.passwordForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to change password. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }

  getFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `Password must be at least 8 characters`;
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    switch (fieldName) {
      case 'current_password': return 'Current password';
      case 'new_password': return 'New password';
      case 'confirm_password': return 'Confirm password';
      default: return fieldName;
    }
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
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