import { Component, OnInit } from '@angular/core';
import { PaymentService, PaymentInfo } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-user-payments',
  templateUrl: './user-payments.component.html'
})
export class UserPaymentsComponent implements OnInit {
  payments: PaymentInfo[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = '';

    this.paymentService.getMyPayments(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.payments = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load payments';
        this.loading = false;
      }
    });
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

  getPaymentIcon(type: number): string {
    switch (type) {
      case 1: return 'bi-credit-card';
      case 2: return 'bi-paypal';
      case 3: return 'bi-google';
      case 4: return 'bi-stripe';
      default: return 'bi-credit-card-2-front';
    }
  }
}