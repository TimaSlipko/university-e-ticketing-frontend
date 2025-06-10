// src/app/features/tickets/components/my-tickets/my-tickets.component.ts

import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../../../core/services/ticket.service';
import { PurchasedTicket } from '../../../../core/models';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html'
})
export class MyTicketsComponent implements OnInit {
  tickets: PurchasedTicket[] = [];
  loading = false;
  error = '';
  downloadingTickets = new Set<number>();

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.error = '';

    this.ticketService.getMyTickets().subscribe({
      next: (response) => {
        this.tickets = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load tickets';
        this.loading = false;
      }
    });
  }

  downloadTicketPDF(ticket: PurchasedTicket): void {
    this.downloadingTickets.add(ticket.id);
    this.error = '';

    this.ticketService.downloadTicketPDF(ticket.id).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, `ticket_${ticket.id}_${ticket.event_title}.pdf`);
        this.downloadingTickets.delete(ticket.id);
      },
      error: (error) => {
        this.error = 'Failed to download PDF';
        this.downloadingTickets.delete(ticket.id);
      }
    });
  }

  viewTicketPDF(ticket: PurchasedTicket): void {
    this.downloadingTickets.add(ticket.id);
    this.error = '';

    this.ticketService.viewTicketPDF(ticket.id).subscribe({
      next: (blob) => {
        this.viewBlob(blob);
        this.downloadingTickets.delete(ticket.id);
      },
      error: (error) => {
        this.error = 'Failed to view PDF';
        this.downloadingTickets.delete(ticket.id);
      }
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.sanitizeFilename(filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private viewBlob(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    // Note: URL will be cleaned up when the window/tab is closed
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);
  }

  isDownloading(ticketId: number): boolean {
    return this.downloadingTickets.has(ticketId);
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

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  isEventPast(timestamp: number): boolean {
    return timestamp * 1000 < Date.now();
  }

  getTicketStatusClass(ticket: PurchasedTicket): string {
    if (ticket.is_used) return 'text-success';
    if (this.isEventPast(ticket.event_date)) return 'text-muted';
    return 'text-primary';
  }

  getTicketStatusText(ticket: PurchasedTicket): string {
    if (ticket.is_used) return 'Used';
    if (this.isEventPast(ticket.event_date)) return 'Expired';
    return 'Valid';
  }
}