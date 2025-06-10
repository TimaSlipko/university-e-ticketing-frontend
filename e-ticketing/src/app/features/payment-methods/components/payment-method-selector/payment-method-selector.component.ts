import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PaymentMethodService, PaymentMethod } from '../../../../core/services/payment-method.service';
import { PaymentType } from 'src/app/core/models';

@Component({
  selector: 'app-payment-method-selector',
  templateUrl: './payment-method-selector.component.html'
})
export class PaymentMethodSelectorComponent implements OnInit {
  @Input() selectedMethodId?: number;
  @Output() methodSelected = new EventEmitter<PaymentMethod>();
  @Output() paymentTypeSelected = new EventEmitter<PaymentType>();

  paymentMethods: PaymentMethod[] = [];
  selectedMethod?: PaymentMethod;
  useStoredMethod = true;
  selectedPaymentType: PaymentType = PaymentType.CARD;
  PaymentType = PaymentType;
  loading = false;
  error = '';

  constructor(private paymentMethodService: PaymentMethodService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    this.loading = true;
    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentMethods = response.data || [];
        
        // Auto-select default method
        const defaultMethod = this.paymentMethods.find(m => m.is_default);
        if (defaultMethod) {
          this.selectMethod(defaultMethod);
        } else if (this.paymentMethods.length > 0) {
          this.selectMethod(this.paymentMethods[0]);
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load payment methods';
        this.loading = false;
      }
    });
  }

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.selectedMethodId = method.id;
    this.useStoredMethod = true;
    this.methodSelected.emit(method);
  }

  onPaymentTypeChange(): void {
    this.useStoredMethod = false;
    this.selectedMethod = undefined;
    this.paymentTypeSelected.emit(this.selectedPaymentType);
  }

  onUseStoredMethodChange(): void {
    if (this.useStoredMethod && this.paymentMethods.length > 0) {
      const defaultMethod = this.paymentMethods.find(m => m.is_default) || this.paymentMethods[0];
      this.selectMethod(defaultMethod);
    } else {
      this.selectedMethod = undefined;
      this.paymentTypeSelected.emit(this.selectedPaymentType);
    }
  }

  getPaymentMethodIcon(method: PaymentMethod): string {
    switch (method.type) {
      case PaymentType.CARD: return 'bi-credit-card';
      case PaymentType.PAYPAL: return 'bi-paypal';
      case PaymentType.GOOGLEPAY: return 'bi-google';
      default: return 'bi-credit-card-2-front';
    }
  }

  getDisplayText(method: PaymentMethod): string {
    switch (method.type) {
      case PaymentType.CARD:
        return method.masked_data['card_number'] || 'Credit Card';
      case PaymentType.PAYPAL:
        return method.masked_data['email'] || 'PayPal';
      case PaymentType.GOOGLEPAY:
        return method.masked_data['email'] || 'Google Pay';
      default:
        return method.type_name;
    }
  }

  getPaymentTypeName(type: PaymentType): string {
    switch (type) {
      case PaymentType.CARD: return 'Credit Card';
      case PaymentType.PAYPAL: return 'PayPal';
      case PaymentType.GOOGLEPAY: return 'Google Pay';
      default: return 'Unknown';
    }
  }
}