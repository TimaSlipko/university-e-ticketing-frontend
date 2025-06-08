import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, 
  UpdateProfileRequest, 
  ChangePasswordRequest,
  SystemStats,
  SellerStats,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  // User profile endpoints
  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/users/profile`);
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/users/profile`, profileData);
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.API_URL}/users/password`, passwordData);
  }

  deleteAccount(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/users/profile`);
  }

  // Seller specific endpoints
  getSellerProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/seller/profile`);
  }

  updateSellerProfile(profileData: UpdateProfileRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/seller/profile`, profileData);
  }

  changeSellerPassword(passwordData: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.API_URL}/seller/password`, passwordData);
  }

  getSellerStats(): Observable<ApiResponse<SellerStats>> {
    return this.http.get<ApiResponse<SellerStats>>(`${this.API_URL}/seller/stats`);
  }

  deleteSellerAccount(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/seller/profile`);
  }

  // Admin specific endpoints
  getAdminProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/admin/profile`);
  }

  updateAdminProfile(profileData: UpdateProfileRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/admin/profile`, profileData);
  }

  changeAdminPassword(passwordData: ChangePasswordRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.API_URL}/admin/password`, passwordData);
  }

  getSystemStats(): Observable<ApiResponse<SystemStats>> {
    return this.http.get<ApiResponse<SystemStats>>(`${this.API_URL}/admin/stats`);
  }
}