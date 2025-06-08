import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../core/services/event.service';
import { Event } from '../../../../core/models';

@Component({
  selector: 'app-pending-events',
  templateUrl: './pending-events.component.html'
})
export class PendingEventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  actionLoading = false;
  currentPage = 1;
  totalPages = 0;
  hasNext = false;
  hasPrev = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;
    
    this.eventService.getPendingEvents(page, 12).subscribe({
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

  approveEvent(eventId: number): void {
    if (confirm('Are you sure you want to approve this event?')) {
      this.actionLoading = true;
      this.eventService.approveEvent(eventId).subscribe({
        next: () => {
          this.actionLoading = false;
          this.loadEvents(this.currentPage);
        },
        error: (error) => {
          this.actionLoading = false;
          alert(error.error?.message || 'Failed to approve event');
        }
      });
    }
  }

  rejectEvent(eventId: number): void {
    if (confirm('Are you sure you want to reject this event?')) {
      this.actionLoading = true;
      this.eventService.rejectEvent(eventId).subscribe({
        next: () => {
          this.actionLoading = false;
          this.loadEvents(this.currentPage);
        },
        error: (error) => {
          this.actionLoading = false;
          alert(error.error?.message || 'Failed to reject event');
        }
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadEvents(page);
    }
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