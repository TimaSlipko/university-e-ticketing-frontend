import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Event, 
  CreateEventRequest, 
  UpdateEventRequest,
  PaginatedResponse,
  NestedPaginatedResponse,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly API_URL = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  // Public endpoints
  getEvents(page: number = 1, limit: number = 20, status?: number): Observable<NestedPaginatedResponse<Event>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (status) {
      params = params.set('status', status.toString());
    }

    return this.http.get<NestedPaginatedResponse<Event>>(`${this.API_URL}/events`, { params });
  }

  getEvent(eventId: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(`${this.API_URL}/events/${eventId}`);
  }

  getEventTickets(eventId: number): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.API_URL}/events/${eventId}/tickets`);
  }

  // Seller endpoints (protected)
  createEvent(eventData: CreateEventRequest): Observable<ApiResponse<Event>> {
    return this.http.post<ApiResponse<Event>>(`${this.API_URL}/seller/events`, eventData);
  }

  getMyEvents(page: number = 1, limit: number = 20): Observable<NestedPaginatedResponse<Event>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<NestedPaginatedResponse<Event>>(`${this.API_URL}/seller/events`, { params });
  }

  updateEvent(eventId: number, eventData: UpdateEventRequest): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.API_URL}/seller/events/${eventId}`, eventData);
  }

  deleteEvent(eventId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/seller/events/${eventId}`);
  }

  // Admin endpoints
  getPendingEvents(page: number = 1, limit: number = 20): Observable<NestedPaginatedResponse<Event>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<NestedPaginatedResponse<Event>>(`${this.API_URL}/admin/events/pending`, { params });
  }

  approveEvent(eventId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.API_URL}/admin/events/${eventId}/approve`, {});
  }

  rejectEvent(eventId: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.API_URL}/admin/events/${eventId}/reject`, {});
  }
}