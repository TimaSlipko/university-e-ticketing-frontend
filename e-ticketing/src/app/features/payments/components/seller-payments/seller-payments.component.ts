import { Component, OnInit } from '@angular/core';
import { PaymentService, PaymentInfo } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-seller-payments',
  templateUrl: './seller-payments.component.html'
})
export class SellerPaymentsComponent implements OnInit {
  payments: PaymentInfo[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  pageSize = 10;
  totalRevenue = 0;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = '';

    this.paymentService.getSellerPayments(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.payments = response.data || [];
        this.calculateTotalRevenue();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load payments';
        this.loading = false;
      }
    });
  }

  calculateTotalRevenue(): void {
    this.totalRevenue = this.payments
      .filter(p => p.status === 2) // Only completed payments
      .reduce((sum, payment) => sum + payment.amount, 0);
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
    return this.paymentService.formatPrice(price);
  }

  getPaymentTypeText(type: number): string {
    return this.paymentService.getPaymentTypeText(type);
  }

  getPaymentStatusText(status: number): string {
    return this.paymentService.getPaymentStatusText(status);
  }

  getPaymentStatusClass(status: number): string {
    return this.paymentService.getPaymentStatusClass(status);
  }

  getPaymentIcon(): string {
    return 'bi-cash-coin'; // Revenue icon for sellers
  }
}