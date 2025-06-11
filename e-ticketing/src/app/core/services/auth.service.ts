import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest,
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('accessToken');
  }

  get userType(): number | null {
    return this.currentUserValue?.user_type || null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response);
          this.redirectAfterLogin(response.data.user.user_type);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          this.setAuthData(response);
          this.redirectAfterLogin(response.data.user.user_type);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { refresh_token: refreshToken };
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, request)
      .pipe(
        tap(response => this.setAuthData(response))
      );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refresh_token: refreshToken }).subscribe();
    }

    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.data.access_token);
    localStorage.setItem('refreshToken', authResponse.data.refresh_token);
    localStorage.setItem('currentUser', JSON.stringify(authResponse.data.user));
    this.currentUserSubject.next(authResponse.data.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private redirectAfterLogin(userType: number): void {
    switch (userType) {
      // case 3: // admin
      //   this.router.navigate(['/dashboard/admin']);
      //   break;
      case 2: // seller
        this.router.navigate(['/dashboard/seller']);
        break;
      case 1: // user
        this.router.navigate(['/dashboard/user']);
        break;
      default:
        this.router.navigate(['/events']);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  hasRole(requiredRole: number): boolean {
    return this.userType === requiredRole;
  }
}