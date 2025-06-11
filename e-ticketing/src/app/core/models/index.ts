// User models (from user.model.ts)
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  user_type: number;
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

export interface UpdateProfileRequest {
  name?: string;
  surname?: string;
  username?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Base API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

export interface NestedPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    data: T[] | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

// Event models
export interface Event {
  id: number;
  title: string;
  description: string;
  date: number; // Unix timestamp
  address: string;
  data: string; // JSON string
  seller_id: number;
  status: number; // 1=pending, 2=approved, 3=rejected, 4=cancelled
  seller_name?: string;
  available_tickets?: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: number;
  address: string;
  data?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  date?: number;
  address?: string;
  data?: string;
}

// Sale models
export interface Sale {
  id: number;
  start_date: number; // Unix timestamp
  end_date: number;   // Unix timestamp
  event_id: number;
  is_active: boolean;
  event_info?: {
    title: string;
    description: string;
    date: number;
    address: string;
  };
}

export interface CreateSaleRequest {
  start_date: number;
  end_date: number;
  event_id: number;
}

export interface UpdateSaleRequest {
  start_date?: number;
  end_date?: number;
}

// Ticket models
export interface Ticket {
  id: number;
  price: number;
  is_held: boolean;
  is_sold: boolean;
  type: number; // 1=regular, 2=vip, 3=premium
  is_vip: boolean;
  title: string;
  description: string;
  place: string;
  sale_id: number;
  event_id: number;
}

export interface GroupedTicket {
  price: number;
  type: TicketType;
  is_vip: boolean;
  title: string;
  description: string;
  place: string;
  sale_id: number;
  event_id: number;
  total_amount: number;
  available_amount: number;
  sold_amount: number;
  held_amount: number;
}

export interface CreateTicketRequest {
  price: number;
  type: TicketType;
  is_vip: boolean;
  title: string;
  description: string;
  place: string;
  sale_id: number;
  event_id: number;
  amount: number;
}

export interface UpdateTicketRequest {
  old_ticket: GroupedTicket;
  updates: {
    price?: number;
    type?: TicketType;
    is_vip?: boolean;
    title?: string;
    description?: string;
    place?: string;
    sale_id?: number;
  };
}

export interface PurchasedTicket {
  id: number;
  ticket_id: number;
  title: string;
  description: string;
  place: string;
  price: number;
  event_title: string;
  event_date: number;
  event_id: number;
  is_used: boolean;
}

export interface PurchaseTicketFromGroupRequest {
  event_id: number;
  price: number;
  type: TicketType;
  is_vip: boolean;
  title: string;
  description: string;
  place: string;
  sale_id: number;
  quantity: number;
  payment_method: PaymentType;
}

export interface PurchaseTicketRequest {
  ticket_id: number;
  quantity: number;
  payment_method: number; // 1=card, 2=paypal, 3=googlepay, 4=stripe
}

export interface PurchaseTicketResponse {
  purchased_tickets: PurchasedTicket[];
  payment_info: PaymentResponse;
  total_amount: number;
}

// Payment models
export interface PaymentResponse {
  payment_id: number;
  status: number; // 1=pending, 2=completed, 3=failed, 4=refunded
  amount: number;
  transaction_id?: string;
  message: string;
}

// Transfer models
export interface TransferRequest {
  to_user_email: string;
  purchased_ticket_id: number;
}

export interface Transfer {
  id: number;
  from_user: User;
  to_user: User;
  ticket_info: PurchasedTicket;
  status: number; // 1=pending, 2=accepted, 3=rejected, 4=cancelled
  date: number;
  completed_at?: number;
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

// Enums for status values
export enum EventStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export enum PaymentStatus {
  PENDING = 1,
  COMPLETED = 2,
  FAILED = 3,
  REFUNDED = 4
}

export enum TransferStatus {
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export enum TicketType {
  REGULAR = 1,
  VIP = 2,
  PREMIUM = 3
}

export enum PaymentType {
  CARD = 1,
  PAYPAL = 2,
  GOOGLEPAY = 3,
  STRIPE = 4
}

export function getTicketTypeText(type: TicketType): string {
  switch (type) {
    case TicketType.REGULAR: return 'Regular';
    case TicketType.VIP: return 'VIP';
    case TicketType.PREMIUM: return 'Premium';
    default: return 'Unknown';
  }
}

export * from './payment-method.models';