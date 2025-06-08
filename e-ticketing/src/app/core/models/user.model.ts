export enum UserType {
  USER = 1,
  SELLER = 2,
  ADMIN = 3,
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  user_type: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  user_type: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  user_type: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  surname?: string;
  username?: string;
}