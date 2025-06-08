import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Event } from '../../../../core/models';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html'
})
export class MyEventsComponent implements OnInit {
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
    
    this.eventService.getMyEvents(page, 12).subscribe({
      next: (response) => {
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

  editEvent(eventId: number): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  createEvent(): void {
    this.router.navigate(['/events/create']);
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

  getStatusText(status: number): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'bg-warning';
      case 2: return 'bg-success';
      case 3: return 'bg-danger';
      case 4: return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  get userType(): number | null {
    return this.authService.userType;
  }
}