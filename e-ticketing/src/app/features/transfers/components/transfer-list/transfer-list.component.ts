import { Component, OnInit } from '@angular/core';
import { TransferService } from '../../../../core/services/transfer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Transfer, TransferStatus } from '../../../../core/models';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html'
})
export class TransferListComponent implements OnInit {
  activeTransfers: Transfer[] = [];
  transferHistory: Transfer[] = [];
  activeTab = 'active';
  activeLoading = false;
  historyLoading = false;
  actionLoading = false;
  currentUserId?: number;

  constructor(
    private transferService: TransferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.id;
    });
    this.loadActiveTransfers();
    this.loadTransferHistory();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  loadActiveTransfers(): void {
    this.activeLoading = true;
    this.transferService.getActiveTransfers().subscribe({
      next: (response) => {
        this.activeTransfers = response.data || [];
        this.activeLoading = false;
      },
      error: () => {
        this.activeLoading = false;
      }
    });
  }

  loadTransferHistory(): void {
    this.historyLoading = true;
    this.transferService.getTransferHistory().subscribe({
      next: (response) => {
        this.transferHistory = response.data || [];
        this.historyLoading = false;
      },
      error: () => {
        this.historyLoading = false;
      }
    });
  }

  acceptTransfer(transferId: number): void {
    this.actionLoading = true;
    this.transferService.acceptTransfer(transferId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.loadActiveTransfers();
        this.loadTransferHistory();
      },
      error: (error) => {
        this.actionLoading = false;
        alert(error.error?.message || 'Failed to accept transfer');
      }
    });
  }

  rejectTransfer(transferId: number): void {
    this.actionLoading = true;
    this.transferService.rejectTransfer(transferId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.loadActiveTransfers();
      },
      error: (error) => {
        this.actionLoading = false;
        alert(error.error?.message || 'Failed to reject transfer');
      }
    });
  }

  isTransferRecipient(transfer: Transfer): boolean {
    return this.currentUserId === transfer.to_user.id;
  }

  isTransferSender(transfer: Transfer): boolean {
    return this.currentUserId === transfer.from_user.id;
  }

  getTransferDirection(transfer: Transfer): string {
    if (this.isTransferSender(transfer)) return 'Outgoing';
    if (this.isTransferRecipient(transfer)) return 'Incoming';
    return 'Unknown';
  }

  getStatusText(status: number): string {
    switch (status) {
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

  getStatusBadgeClass(status: number): string {
    switch (status) {
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
}