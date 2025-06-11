import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

export interface PaymentInfo {
  id: number;
  user_id: number;
  date: number;
  type: number;
  amount: number;
  status: number;
  description: string;
  event_title?: string;
  payment_type: 'incoming' | 'outgoing';
}

export interface PaymentStatusResponse {
  payment_id: number;
  status: number;
  amount: number;
  transaction_id?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getMyPayments(page: number = 1, limit: number = 10): Observable<ApiResponse<PaymentInfo[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<ApiResponse<PaymentInfo[]>>(`${this.API_URL}/payments/my`, { params });
  }

  getSellerPayments(page: number = 1, limit: number = 10): Observable<ApiResponse<PaymentInfo[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<ApiResponse<PaymentInfo[]>>(`${this.API_URL}/seller/payments`, { params });
  }

  getPaymentStatus(paymentId: number): Observable<ApiResponse<PaymentStatusResponse>> {
    return this.http.get<ApiResponse<PaymentStatusResponse>>(`${this.API_URL}/payments/${paymentId}`);
  }

  getPaymentTypeText(type: number): string {
    switch (type) {
      case 1: return 'Credit Card';
      case 2: return 'PayPal';
      case 3: return 'Google Pay';
      case 4: return 'Stripe';
      default: return 'Unknown';
    }
  }

  getPaymentStatusText(status: number): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Completed';
      case 3: return 'Failed';
      case 4: return 'Refunded';
      default: return 'Unknown';
    }
  }

  getPaymentStatusClass(status: number): string {
    switch (status) {
      case 1: return 'text-warning';
      case 2: return 'text-success';
      case 3: return 'text-danger';
      case 4: return 'text-info';
      default: return 'text-muted';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
