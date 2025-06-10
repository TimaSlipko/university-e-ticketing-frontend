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

  showPurchaseModal = false;

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
    this.showPurchaseModal = true;
  }

  onPurchaseConfirmed(purchaseData: { paymentMethod?: any; paymentType?: PaymentType; quantity: number }): void {
    if (!this.selectedTicket) return;

    this.purchaseLoading = true;
    this.showPurchaseModal = false;
    this.error = '';

    const purchaseRequest: PurchaseTicketFromGroupRequest = {
      event_id: this.selectedTicket.event_id,
      price: this.selectedTicket.price,
      type: this.selectedTicket.type,
      is_vip: this.selectedTicket.is_vip,
      title: this.selectedTicket.title,
      description: this.selectedTicket.description,
      place: this.selectedTicket.place,
      sale_id: this.selectedTicket.sale_id,
      quantity: purchaseData.quantity,
      payment_method: purchaseData.paymentMethod?.type || purchaseData.paymentType || PaymentType.CARD
    };

    this.ticketService.purchaseTicketFromGroup(purchaseRequest).subscribe({
      next: (response) => {
        alert(`Successfully purchased ${response.data.purchased_tickets.length} ticket(s)!`);
        this.loadTickets();
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

  onModalClosed(): void {
    this.showPurchaseModal = false;
    this.selectedTicket = null;
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