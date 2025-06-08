import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  PurchaseTicketRequest, 
  PurchaseTicketResponse,
  PurchasedTicket,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly API_URL = `${environment.apiUrl}/api/v1/tickets`;

  constructor(private http: HttpClient) {}

  purchaseTicket(purchaseData: PurchaseTicketRequest): Observable<ApiResponse<PurchaseTicketResponse>> {
    return this.http.post<ApiResponse<PurchaseTicketResponse>>(`${this.API_URL}/purchase`, purchaseData);
  }

  getMyTickets(): Observable<ApiResponse<PurchasedTicket[]>> {
    return this.http.get<ApiResponse<PurchasedTicket[]>>(`${this.API_URL}/my`);
  }
}