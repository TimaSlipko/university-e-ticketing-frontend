import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path as needed

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';
        const isAuthEndpoint = request.url.includes('/auth/');

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Bad Request';
              break;
            case 401:
              if (isAuthEndpoint) {
                // For auth endpoints (login/register), use the actual error message
                errorMessage = error.error?.message || error.error?.error || 'Invalid credentials';
              } else {
                // For other endpoints, use generic unauthorized message
                errorMessage = 'Unauthorized. Please log in again.';
              }
              break;
            case 403:
              errorMessage = 'Access forbidden. You do not have permission.';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflict occurred';
              break;
            case 422:
              errorMessage = error.error?.message || 'Validation failed';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service unavailable. Please try again later.';
              break;
            default:
              errorMessage = error.error?.message || `Error Code: ${error.status}`;
          }
        }

        // Log error to console for debugging
        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          error: error.error,
          url: request.url,
          isAuthEndpoint
        });

        return throwError(() => ({ 
          ...error, 
          error: { 
            ...error.error, 
            message: errorMessage 
          } 
        }));
      })
    );
  }
}