// Profile models
export interface ProfileInfo {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  user_type: string;
  admin_role?: number; // Only for admin
}

export interface UpdateProfileRequest {
  username?: string;
  name?: string;
  surname?: string;
}

// Stats models
export interface SystemStats {
  total_users: number;
  total_sellers: number;
  total_admins: number;
  pending_events: number;
  approved_events: number;
  total_revenue: number;
  total_transactions: number;
}

export interface SellerStats {
  total_events: number;
  approved_events: number;
  pending_events: number;
  total_revenue: number;
  events_sold: number;
}

// Event models
export interface EventResponse {
  id: number;
  title: string;
  description: string;
  date: string;
  address: string;
  data: any;
  status: string;
  seller_id: number;
  seller_name: string;
}

// Pagination
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}