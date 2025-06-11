import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SellerService, SellerStats } from '../../../../core/services/seller.service';
import { Event } from '../../../../core/models';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html'
})
export class SellerDashboardComponent implements OnInit {
  stats: SellerStats | null = null;
  recentEvents: Event[] = [];
  eventsLoading = false;
  statsLoading = false;

  constructor(
    private sellerService: SellerService,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentEvents();
  }

  loadStats(): void {
    this.statsLoading = true;
    this.sellerService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.statsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
        this.statsLoading = false;
      }
    });
  }

  loadRecentEvents(): void {
    this.eventsLoading = true;
    this.eventService.getMyEvents(1, 5).subscribe({
      next: (response) => {
        const events = response.data?.data;
        this.recentEvents = Array.isArray(events) ? events : [];
        this.eventsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load events:', error);
        this.recentEvents = [];
        this.eventsLoading = false;
      }
    });
  }

  getUserName(): string {
    const user = this.authService.currentUserValue;
    return user ? `${user.name} ${user.surname}` : 'Seller';
  }

  getEventStatusText(status: number): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getApprovalRate(): number {
    if (!this.stats) return 0;
    return this.sellerService.calculateApprovalRate(
      this.stats.approved_events, 
      this.stats.total_events
    );
  }

  getAverageRevenue(): string {
    if (!this.stats) return '$0';
    const avg = this.sellerService.calculateAverageRevenue(
      this.stats.total_revenue, 
      this.stats.events_sold
    );
    return this.sellerService.formatRevenue(avg);
  }

  getTicketSoldRate(): number {
    if (!this.stats) return 0;
    return this.sellerService.calculateTicketSoldRate(
      this.stats.sold_tickets,
      this.stats.total_tickets
    );
  }

  formatRevenue(amount: number): string {
    return this.sellerService.formatRevenue(amount);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }
}