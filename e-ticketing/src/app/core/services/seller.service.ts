import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';

export interface SellerStats {
  total_events: number;
  approved_events: number;
  pending_events: number;
  rejected_events: number;
  total_revenue: number;
  events_sold: number;
  total_tickets: number;
  sold_tickets: number;
  pending_revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/seller`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<SellerStats>> {
    return this.http.get<ApiResponse<SellerStats>>(`${this.API_URL}/stats`);
  }

  formatRevenue(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  calculateApprovalRate(approved: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((approved / total) * 100);
  }

  calculateAverageRevenue(revenue: number, eventsSold: number): number {
    if (eventsSold === 0) return 0;
    return Math.round(revenue / eventsSold);
  }

  calculateTicketSoldRate(sold: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((sold / total) * 100);
  }
}