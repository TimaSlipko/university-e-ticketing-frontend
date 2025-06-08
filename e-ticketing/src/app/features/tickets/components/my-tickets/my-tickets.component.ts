import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../../../../core/services/ticket.service';
import { TransferService } from '../../../../core/services/transfer.service';
import { PurchasedTicket, TransferRequest } from '../../../../core/models';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html'
})
export class MyTicketsComponent implements OnInit {
  tickets: PurchasedTicket[] = [];
  selectedTicket: PurchasedTicket | null = null;
  transferForm!: FormGroup;
  loading = false;
  transferLoading = false;

  constructor(
    private ticketService: TicketService,
    private transferService: TransferService,
    private fb: FormBuilder
  ) {
    this.initializeTransferForm();
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  private initializeTransferForm(): void {
    this.transferForm = this.fb.group({
      to_user_email: ['', [Validators.required, Validators.email]]
    });
  }

  loadTickets(): void {
    this.loading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (response: any) => {
        this.tickets = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openTransferModal(ticket: PurchasedTicket): void {
    this.selectedTicket = ticket;
    this.transferForm.reset();
  }

  cancelTransfer(): void {
    this.selectedTicket = null;
    this.transferForm.reset();
  }

  submitTransfer(): void {
    if (this.transferForm.valid && this.selectedTicket) {
      this.transferLoading = true;

      const transferRequest: TransferRequest = {
        to_user_email: this.transferForm.value.to_user_email,
        purchased_ticket_id: this.selectedTicket.id
      };

      this.transferService.initiateTransfer(transferRequest).subscribe({
        next: () => {
          this.transferLoading = false;
          this.selectedTicket = null;
          this.transferForm.reset();
          alert('Transfer initiated successfully!');
        },
        error: (error: any) => {
          this.transferLoading = false;
          alert(error.error?.message || 'Transfer failed');
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transferForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  isExpired(eventDate: number): boolean {
    return eventDate * 1000 < Date.now();
  }

  getTicketStatus(ticket: PurchasedTicket): string {
    if (ticket.is_used) return 'Used';
    if (this.isExpired(ticket.event_date)) return 'Expired';
    return 'Active';
  }
}