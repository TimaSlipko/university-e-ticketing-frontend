import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentType } from '../models';

export interface PaymentMethodData {
  // Credit Card
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  card_holder?: string;
  // PayPal
  paypal_email?: string;
  // Google Pay
  google_email?: string;
}

export interface CreatePaymentMethodRequest {
  type: PaymentType;
  payment_data: PaymentMethodData;
  is_default?: boolean;
}

export interface PaymentMethod {
  id: number;
  type: PaymentType;
  type_name: string;
  masked_data: { [key: string]: string };
  token: string;
  is_default: boolean;
  nickname?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/payment-methods`;

  constructor(private http: HttpClient) {}

  createPaymentMethod(request: CreatePaymentMethodRequest): Observable<ApiResponse<PaymentMethod>> {
    return this.http.post<ApiResponse<PaymentMethod>>(this.API_URL, request);
  }

  getPaymentMethods(): Observable<ApiResponse<PaymentMethod[]>> {
    return this.http.get<ApiResponse<PaymentMethod[]>>(this.API_URL);
  }

  getPaymentMethod(id: number): Observable<ApiResponse<PaymentMethod>> {
    return this.http.get<ApiResponse<PaymentMethod>>(`${this.API_URL}/${id}`);
  }

  updatePaymentMethod(id: number, updates: { is_default?: boolean; nickname?: string }): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.API_URL}/${id}`, updates);
  }

  deletePaymentMethod(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`);
  }

  setDefaultPaymentMethod(id: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.API_URL}/${id}/set-default`, {});
  }
}