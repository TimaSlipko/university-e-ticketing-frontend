import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
    
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      user_type: [1, [Validators.required]] // Default to user (1)
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = { ...this.loginForm.value };
      // Ensure user_type is a number
      formData.user_type = parseInt(formData.user_type, 10);

      this.authService.login(formData).subscribe({
        next: () => {
          this.isLoading = false;
          // Navigation is handled in AuthService
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          // Handle different error response formats
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.error?.error) {
            this.errorMessage = error.error.error;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.errors?.['required']) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    
    if (field?.errors?.['email']) {
      return 'Please enter a valid email address';
    }
    
    if (field?.errors?.['minlength']) {
      return 'Password must be at least 6 characters long';
    }
    
    return '';
  }
}