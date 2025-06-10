import { Component, OnInit } from '@angular/core';
import { PaymentMethodService, PaymentMethod } from '../../../../core/services/payment-method.service';

@Component({
  selector: 'app-payment-methods-list',
  templateUrl: './payment-methods-list.component.html'
})
export class PaymentMethodsListComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  loading = false;
  error = '';

  constructor(private paymentMethodService: PaymentMethodService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    this.loading = true;
    this.error = '';

    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentMethods = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load payment methods';
        this.loading = false;
      }
    });
  }

  setDefault(method: PaymentMethod): void {
    if (method.is_default) return;

    this.paymentMethodService.setDefaultPaymentMethod(method.id).subscribe({
      next: () => {
        this.loadPaymentMethods();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to set default payment method');
      }
    });
  }

  deletePaymentMethod(method: PaymentMethod): void {
    if (!confirm(`Are you sure you want to delete this ${method.type_name}?`)) {
      return;
    }

    this.paymentMethodService.deletePaymentMethod(method.id).subscribe({
      next: () => {
        this.loadPaymentMethods();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to delete payment method');
      }
    });
  }

  getPaymentMethodIcon(method: PaymentMethod): string {
    switch (method.type) {
      case 1: return 'bi-credit-card';
      case 2: return 'bi-paypal';
      case 3: return 'bi-google';
      default: return 'bi-credit-card-2-front';
    }
  }

  getDisplayText(method: PaymentMethod): string {
    switch (method.type) {
      case 1:
        return method.masked_data['card_number'] || 'Credit Card';
      case 2:
        return method.masked_data['email'] || 'PayPal';
      case 3:
        return method.masked_data['email'] || 'Google Pay';
      default:
        return method.type_name;
    }
  }
}