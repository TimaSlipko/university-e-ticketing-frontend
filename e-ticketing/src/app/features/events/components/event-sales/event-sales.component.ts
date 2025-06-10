import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaleService } from '../../../../core/services/sale.service';
import { EventService } from '../../../../core/services/event.service';
import { Sale, Event } from '../../../../core/models';

@Component({
  selector: 'app-event-sales',
  templateUrl: './event-sales.component.html'
})
export class EventSalesComponent implements OnInit {
  sales: Sale[] = [];
  event: Event | null = null;
  loading = false;
  eventId: number = 0;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      if (this.eventId) {
        this.loadEventAndSales();
      }
    });
  }

  private loadEventAndSales(): void {
    this.loading = true;
    this.error = '';

    // Load event details
    this.eventService.getEvent(this.eventId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.loadSales();
      },
      error: () => {
        this.error = 'Failed to load event details';
        this.loading = false;
      }
    });
  }

  private loadSales(): void {
    this.saleService.getSalesByEvent(this.eventId).subscribe({
      next: (response) => {
        this.sales = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load sales information';
        this.loading = false;
      }
    });
  }

  getSaleStatus(sale: Sale): string {
    return this.saleService.getSaleStatus(sale);
  }

  getSaleStatusBadgeClass(sale: Sale): string {
    return this.saleService.getSaleStatusBadgeClass(sale);
  }

  formatDateTime(timestamp: number): string {
    return this.saleService.formatDateTime(timestamp);
  }

  formatDate(timestamp: number): string {
    return this.saleService.formatDate(timestamp);
  }

  formatTime(timestamp: number): string {
    return this.saleService.formatTime(timestamp);
  }

  getStatusText(sale: Sale): string {
    const status = this.getSaleStatus(sale);
    switch (status) {
      case 'active': return 'Sale Active';
      case 'upcoming': return 'Sale Upcoming';
      case 'ended': return 'Sale Ended';
      default: return 'Unknown';
    }
  }

  isEventUpcoming(): boolean {
    if (!this.event) return false;
    return this.event.date * 1000 > Date.now();
  }
}