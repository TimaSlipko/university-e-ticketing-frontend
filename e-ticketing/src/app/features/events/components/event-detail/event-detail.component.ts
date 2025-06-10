import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { SaleService } from '../../../../core/services/sale.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Event, Ticket, Sale, PurchaseTicketRequest } from '../../../../core/models';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html'
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  tickets: Ticket[] = [];
  activeSale: Sale | null = null;
  upcomingSale: Sale | null = null;
  loading = false;
  ticketsLoading = false;
  salesLoading = false;
  error = '';
  eventId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private saleService: SaleService,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
    this.loadTickets();
    this.loadSales();
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

  loadSales(): void {
    this.salesLoading = true;
    this.saleService.getSalesByEvent(this.eventId).subscribe({
      next: (response) => {
        const sales = response.data || [];
        this.findActiveSale(sales);
        this.findUpcomingSale(sales);
        this.salesLoading = false;
      },
      error: () => {
        this.salesLoading = false;
      }
    });
  }

  private findActiveSale(sales: Sale[]): void {
    this.activeSale = sales.find(sale => this.saleService.isSaleActive(sale)) || null;
  }

  private findUpcomingSale(sales: Sale[]): void {
    const upcomingSales = sales
      .filter(sale => this.saleService.isSaleUpcoming(sale))
      .sort((a, b) => a.start_date - b.start_date);
    
    this.upcomingSale = upcomingSales[0] || null;
  }

  isEventOwner(): boolean {
    const currentUser = this.authService.currentUserValue;
    return !!(currentUser && 
              currentUser.user_type === 2 && // Seller
              this.event && 
              this.event.seller_id === currentUser.id);
  }

  purchaseTicket(ticketId: number, price: number): void {
    if (!this.activeSale) {
      alert('No active sale period. Tickets cannot be purchased at this time.');
      return;
    }

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

  formatDateTime(timestamp: number): string {
    return this.saleService.formatDateTime(timestamp);
  }
}