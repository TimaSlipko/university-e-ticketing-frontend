import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';
import { 
  GroupedTicket, 
  Event, 
  PurchaseTicketFromGroupRequest,
  PaymentType,
  getTicketTypeText 
} from '../../../../core/models';

@Component({
  selector: 'app-event-tickets',
  templateUrl: './event-tickets.component.html'
})
export class EventTicketsComponent implements OnInit {
  event: Event | null = null;
  tickets: GroupedTicket[] = [];
  eventId: number = 0;
  
  loading = false;
  error = '';
  purchaseLoading = false;
  selectedTicket: GroupedTicket | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      if (this.eventId) {
        this.loadEventAndTickets();
      }
    });
  }

  private loadEventAndTickets(): void {
    this.loading = true;
    this.error = '';

    // Load event details
    this.eventService.getEvent(this.eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.loadTickets();
      },
      error: () => {
        this.error = 'Failed to load event details';
        this.loading = false;
      }
    });
  }

  private loadTickets(): void {
    this.ticketService.getAvailableGroupedTickets(this.eventId).subscribe({
      next: (response) => {
        this.tickets = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load tickets';
        this.loading = false;
      }
    });
  }

  purchaseTicket(ticket: GroupedTicket): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (ticket.available_amount === 0) {
      this.error = 'No tickets available';
      return;
    }

    this.selectedTicket = ticket;
    this.purchaseLoading = true;
    this.error = '';

    const purchaseRequest: PurchaseTicketFromGroupRequest = {
      event_id: ticket.event_id,
      price: ticket.price,
      type: ticket.type,
      is_vip: ticket.is_vip,
      title: ticket.title,
      description: ticket.description,
      place: ticket.place,
      sale_id: ticket.sale_id,
      quantity: 1,
      payment_method: PaymentType.CARD
    };

    this.ticketService.purchaseTicketFromGroup(purchaseRequest).subscribe({
      next: (response) => {
        // Show success message
        alert(`Successfully purchased ${response.data.purchased_tickets.length} ticket(s)!`);
        
        // Reload tickets to show updated availability
        this.loadTickets();
        
        // Optionally redirect to user tickets
        this.router.navigate(['/tickets']);
        
        this.purchaseLoading = false;
        this.selectedTicket = null;
      },
      error: (error) => {
        this.error = error.error?.message || 'Purchase failed';
        this.purchaseLoading = false;
        this.selectedTicket = null;
      }
    });
  }

  getTicketTypeText(type: number): string {
    return getTicketTypeText(type);
  }

  formatPrice(price: number): string {
    return this.ticketService.formatPrice(price);
  }

  getAvailabilityText(ticket: GroupedTicket): string {
    return this.ticketService.getAvailabilityText(ticket);
  }

  getAvailabilityClass(ticket: GroupedTicket): string {
    return this.ticketService.getTicketStatusClass(ticket);
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  isEventUpcoming(): boolean {
    if (!this.event) return false;
    return this.event.date * 1000 > Date.now();
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