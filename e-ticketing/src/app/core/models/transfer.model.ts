export interface TransferRequest {
  purchased_ticket_id: number;
  to_user_email: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  user_type: number;
}

export interface PurchasedTicketInfo {
  id: number;
  ticket_id: number;
  title: string;
  description: string;
  place: string;
  price: number;
  event_title?: string;
  event_date?: number;
  event_id?: number;
  is_used: boolean;
}

export interface Transfer {
  id: number;
  from_user: UserInfo;
  to_user: UserInfo;
  ticket_info: PurchasedTicketInfo;
  status: TransferStatus;
  date: number;
  completed_at?: number; // For history
}

export enum TransferStatus {
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}