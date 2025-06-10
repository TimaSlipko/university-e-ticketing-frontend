// src/app/features/transfers/components/transfer-detail/transfer-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from '../../../../core/services/transfer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Transfer, TransferStatus } from '../../../../core/models';

@Component({
  selector: 'app-transfer-detail',
  templateUrl: './transfer-detail.component.html'
})
export class TransferDetailComponent implements OnInit {
  transfer?: Transfer;
  loading = false;
  actionLoading = false;
  error = '';
  currentUserId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transferService: TransferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id;
    });
    this.loadTransfer();
  }

  loadTransfer(): void {
    const transferId = this.route.snapshot.params['id'];
    if (!transferId) {
      this.router.navigate(['/transfers']);
      return;
    }

    // Note: You might need to add a getTransferById method to your backend and service
    // For now, we'll load all active transfers and find the one we need
    this.loading = true;
    this.transferService.getActiveTransfers().subscribe({
      next: (response) => {
        this.transfer = response.data.find(t => t.id == transferId);
        if (!this.transfer) {
          // Try history if not found in active
          this.transferService.getTransferHistory().subscribe({
            next: (historyResponse) => {
              this.transfer = historyResponse.data.find(t => t.id == transferId);
              this.loading = false;
              if (!this.transfer) {
                this.error = 'Transfer not found';
              }
            },
            error: () => {
              this.loading = false;
              this.error = 'Failed to load transfer';
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load transfer';
      }
    });
  }

  acceptTransfer(): void {
    if (!this.transfer) return;
    
    this.actionLoading = true;
    this.transferService.acceptTransfer(this.transfer.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.router.navigate(['/transfers']);
      },
      error: (error) => {
        this.actionLoading = false;
        this.error = error.error?.message || 'Failed to accept transfer';
      }
    });
  }

  rejectTransfer(): void {
    if (!this.transfer) return;
    
    this.actionLoading = true;
    this.transferService.rejectTransfer(this.transfer.id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.router.navigate(['/transfers']);
      },
      error: (error) => {
        this.actionLoading = false;
        this.error = error.error?.message || 'Failed to reject transfer';
      }
    });
  }

  isTransferRecipient(): boolean {
    return this.transfer ? this.currentUserId === this.transfer.to_user.id : false;
  }

  isTransferSender(): boolean {
    return this.transfer ? this.currentUserId === this.transfer.from_user.id : false;
  }

  getTransferDirection(): string {
    if (this.isTransferSender()) return 'Outgoing';
    if (this.isTransferRecipient()) return 'Incoming';
    return 'Unknown';
  }

  getStatusText(): string {
    if (!this.transfer) return '';
    
    switch (this.transfer.status) {
      case TransferStatus.PENDING:
        return 'Pending';
      case TransferStatus.ACCEPTED:
        return 'Accepted';
      case TransferStatus.REJECTED:
        return 'Rejected';
      case TransferStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getStatusBadgeClass(): string {
    if (!this.transfer) return 'bg-secondary';
    
    switch (this.transfer.status) {
      case TransferStatus.PENDING:
        return 'bg-warning';
      case TransferStatus.ACCEPTED:
        return 'bg-success';
      case TransferStatus.REJECTED:
        return 'bg-danger';
      case TransferStatus.CANCELLED:
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
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
}