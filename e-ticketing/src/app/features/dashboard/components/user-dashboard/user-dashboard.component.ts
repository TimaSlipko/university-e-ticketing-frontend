import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { TransferService } from '../../../../core/services/transfer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PurchasedTicket, Transfer } from '../../../../core/models';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent implements OnInit {
  tickets: PurchasedTicket[] = [];
  activeTransfers: Transfer[] = [];
  ticketsLoading = false;
  transfersLoading = false;

  constructor(
    private ticketService: TicketService,
    private transferService: TransferService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadActiveTransfers();
  }

  loadTickets(): void {
    this.ticketsLoading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (response) => {
        this.tickets = response.data || [];
        this.ticketsLoading = false;
      },
      error: () => {
        this.ticketsLoading = false;
      }
    });
  }

  loadActiveTransfers(): void {
    this.transfersLoading = true;
    this.transferService.getActiveTransfers().subscribe({
      next: (response) => {
        this.activeTransfers = response.data || [];
        this.transfersLoading = false;
      },
      error: () => {
        this.transfersLoading = false;
      }
    });
  }

  getUserName(): string {
    const user = this.authService.currentUserValue;
    return user ? `${user.name} ${user.surname}` : 'User';
  }

  get usedTickets(): number {
    return this.tickets.filter(t => t.is_used).length;
  }

  get upcomingEvents(): number {
    const now = Date.now() / 1000;
    return this.tickets.filter(t => t.event_date > now && !t.is_used).length;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }
}