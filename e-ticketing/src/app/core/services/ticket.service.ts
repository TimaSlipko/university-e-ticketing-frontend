import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  GroupedTicket, 
  CreateTicketRequest, 
  UpdateTicketRequest,
  PurchaseTicketFromGroupRequest,
  PurchaseTicketRequest,
  PurchaseTicketResponse,
  PurchasedTicket,
  ApiResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly API_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  // Public endpoints
  getAvailableGroupedTickets(eventId: number): Observable<ApiResponse<GroupedTicket[]>> {
    return this.http.get<ApiResponse<GroupedTicket[]>>(`${this.API_URL}/events/${eventId}/grouped-tickets`);
  }

  // User endpoints
  purchaseTicketFromGroup(request: PurchaseTicketFromGroupRequest): Observable<ApiResponse<PurchaseTicketResponse>> {
    return this.http.post<ApiResponse<PurchaseTicketResponse>>(`${this.API_URL}/tickets/purchase-group`, request);
  }

  purchaseTicket(request: PurchaseTicketRequest): Observable<ApiResponse<PurchaseTicketResponse>> {
    return this.http.post<ApiResponse<PurchaseTicketResponse>>(`${this.API_URL}/tickets/purchase`, request);
  }

  getUserTickets(): Observable<ApiResponse<PurchasedTicket[]>> {
    return this.http.get<ApiResponse<PurchasedTicket[]>>(`${this.API_URL}/tickets/my`);
  }

  // Alias for backward compatibility
  getMyTickets(): Observable<ApiResponse<PurchasedTicket[]>> {
    return this.getUserTickets();
  }

  // Seller endpoints
  createTickets(request: CreateTicketRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.API_URL}/seller/tickets`, request);
  }

  updateTickets(eventId: number, request: UpdateTicketRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.API_URL}/seller/events/${eventId}/tickets`, request);
  }

  deleteTickets(eventId: number, groupedTicket: GroupedTicket): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/seller/events/${eventId}/tickets`, {
      body: groupedTicket
    });
  }

  getGroupedTicketsBySeller(eventId: number): Observable<ApiResponse<GroupedTicket[]>> {
    return this.http.get<ApiResponse<GroupedTicket[]>>(`${this.API_URL}/seller/events/${eventId}/grouped-tickets`);
  }

  // PDF download methods
  downloadTicketPDF(ticketId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/tickets/${ticketId}/download`, {
      responseType: 'blob'
    });
  }

  viewTicketPDF(ticketId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/tickets/${ticketId}/view`, {
      responseType: 'blob'
    });
  }

  // Helper methods
  getTicketStatusClass(ticket: GroupedTicket): string {
    if (ticket.available_amount > 0) return 'text-success';
    if (ticket.sold_amount > 0 && ticket.available_amount === 0) return 'text-danger';
    return 'text-muted';
  }

  getAvailabilityText(ticket: GroupedTicket): string {
    if (ticket.available_amount > 0) {
      return `${ticket.available_amount} available`;
    }
    if (ticket.sold_amount > 0) {
      return 'Sold out';
    }
    return 'No tickets';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}