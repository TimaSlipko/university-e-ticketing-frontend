import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Event } from '../../../../core/models';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 0;
  hasNext = false;
  hasPrev = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;
    
    this.eventService.getEvents(page, 12).subscribe({
      next: (response) => {
        // Handle nested response structure
        const eventsData = response.data?.data;
        const pagination = response.data?.pagination;
        
        this.events = Array.isArray(eventsData) ? eventsData : [];
        this.totalPages = pagination?.total_pages || 0;
        this.hasNext = pagination ? pagination.page < pagination.total_pages : false;
        this.hasPrev = pagination ? pagination.page > 1 : false;
        this.loading = false;
      },
      error: () => {
        this.events = [];
        this.loading = false;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadEvents(page);
    }
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
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

  isEventUpcoming(timestamp: number): boolean {
    return timestamp * 1000 > Date.now();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
}