import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SellerStats, Event } from '../../../../core/models';

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
    private userService: UserService,
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
    this.userService.getSellerStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.statsLoading = false;
      },
      error: () => {
        this.statsLoading = false;
      }
    });
  }

  loadRecentEvents(): void {
    this.eventsLoading = true;
    this.eventService.getMyEvents(1, 5).subscribe({
      next: (response) => {
        // Handle nested response structure
        const events = response.data?.data;
        this.recentEvents = Array.isArray(events) ? events : [];
        this.eventsLoading = false;
      },
      error: () => {
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
    if (!this.stats || this.stats.total_events === 0) return 0;
    return Math.round((this.stats.approved_events / this.stats.total_events) * 100);
  }

  getAverageRevenue(): number {
    if (!this.stats || this.stats.events_sold === 0) return 0;
    return Math.round(this.stats.total_revenue / this.stats.events_sold);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }
}