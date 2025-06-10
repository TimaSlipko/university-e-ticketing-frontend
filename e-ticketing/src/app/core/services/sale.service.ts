import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Sale, 
  CreateSaleRequest, 
  UpdateSaleRequest,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly API_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  // Public endpoints
  getSalesByEvent(eventId: number): Observable<ApiResponse<Sale[]>> {
    return this.http.get<ApiResponse<Sale[]>>(`${this.API_URL}/events/${eventId}/sales`);
  }

  getSale(saleId: number): Observable<ApiResponse<Sale>> {
    return this.http.get<ApiResponse<Sale>>(`${this.API_URL}/sales/${saleId}`);
  }

  // Seller endpoints (protected)
  createSale(saleData: CreateSaleRequest): Observable<ApiResponse<Sale>> {
    return this.http.post<ApiResponse<Sale>>(`${this.API_URL}/seller/sales`, saleData);
  }

  updateSale(saleId: number, saleData: UpdateSaleRequest): Observable<ApiResponse<Sale>> {
    return this.http.put<ApiResponse<Sale>>(`${this.API_URL}/seller/sales/${saleId}`, saleData);
  }

  deleteSale(saleId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/seller/sales/${saleId}`);
  }

  // Helper methods
  isSaleActive(sale: Sale): boolean {
    const now = Date.now() / 1000; // Convert to Unix timestamp
    return now >= sale.start_date && now <= sale.end_date;
  }

  isSaleUpcoming(sale: Sale): boolean {
    const now = Date.now() / 1000;
    return now < sale.start_date;
  }

  isSaleEnded(sale: Sale): boolean {
    const now = Date.now() / 1000;
    return now > sale.end_date;
  }

  getSaleStatus(sale: Sale): 'upcoming' | 'active' | 'ended' {
    if (this.isSaleUpcoming(sale)) return 'upcoming';
    if (this.isSaleActive(sale)) return 'active';
    return 'ended';
  }

  getSaleStatusBadgeClass(sale: Sale): string {
    const status = this.getSaleStatus(sale);
    switch (status) {
      case 'active': return 'bg-success';
      case 'upcoming': return 'bg-warning';
      case 'ended': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  formatDateTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}