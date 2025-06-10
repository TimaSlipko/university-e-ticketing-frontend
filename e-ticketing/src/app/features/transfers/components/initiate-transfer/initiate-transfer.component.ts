// src/app/features/transfers/components/initiate-transfer/initiate-transfer.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { TransferService } from '../../../../core/services/transfer.service';
import { PurchasedTicket, TransferRequest } from '../../../../core/models';

@Component({
  selector: 'app-initiate-transfer',
  templateUrl: './initiate-transfer.component.html'
})
export class InitiateTransferComponent implements OnInit {
  transferForm: FormGroup;
  myTickets: PurchasedTicket[] = [];
  loading = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private transferService: TransferService
  ) {
    this.transferForm = this.fb.group({
      purchased_ticket_id: ['', Validators.required],
      to_user_email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadMyTickets();
    
    // Check for pre-selected ticket from query params
    this.route.queryParams.subscribe(params => {
      if (params['ticket']) {
        this.transferForm.patchValue({
          purchased_ticket_id: params['ticket']
        });
      }
    });
  }

  loadMyTickets(): void {
    this.loading = true;
    this.ticketService.getMyTickets().subscribe({
      next: (response) => {
        // Filter out used tickets and past events
        this.myTickets = (response.data || []).filter(ticket => 
          !ticket.is_used && !this.isEventPast(ticket.event_date)
        );
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load your tickets';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      this.submitting = true;
      this.error = '';
      this.success = '';

      const formValue = this.transferForm.value;
      const transferData: TransferRequest = {
        purchased_ticket_id: parseInt(formValue.purchased_ticket_id, 10),
        to_user_email: formValue.to_user_email
      };

      this.transferService.initiateTransfer(transferData).subscribe({
        next: (response) => {
          this.success = 'Transfer initiated successfully!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/transfers']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to initiate transfer';
          this.submitting = false;
        }
      });
    }
  }

  getSelectedTicket(): PurchasedTicket | null {
    const ticketId = this.transferForm.get('purchased_ticket_id')?.value;
    return this.myTickets.find(ticket => ticket.id == ticketId) || null;
  }

  isEventPast(timestamp: number): boolean {
    return timestamp * 1000 < Date.now();
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}