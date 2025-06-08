import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Event, Ticket, PurchaseTicketRequest } from '../../../../core/models';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  tickets: Ticket[] = [];
  loading = false;
  ticketsLoading = false;
  error = '';
  eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
    this.loadTickets();
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load event';
        this.loading = false;
      }
    });
  }

  loadTickets(): void {
    this.ticketsLoading = true;
    this.eventService.getEventTickets(this.eventId).subscribe({
      next: (response) => {
        this.tickets = response.data;
        this.ticketsLoading = false;
      },
      error: () => {
        this.ticketsLoading = false;
      }
    });
  }

  purchaseTicket(ticketId: number, price: number): void {
    const purchaseRequest: PurchaseTicketRequest = {
      ticket_id: ticketId,
      quantity: 1,
      payment_method: 1 // Default to card
    };

    this.ticketService.purchaseTicket(purchaseRequest).subscribe({
      next: () => {
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        alert(error.error?.message || 'Purchase failed');
      }
    });
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}