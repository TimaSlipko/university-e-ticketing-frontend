import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupedTicket, PaymentType } from '../../../../core/models';
import { PaymentMethod } from '../../../../core/services/payment-method.service';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html'
})
export class PurchaseModalComponent {
  @Input() ticket: GroupedTicket | null = null;
  @Input() show = false;
  @Output() purchaseConfirmed = new EventEmitter<{ paymentMethod?: PaymentMethod; paymentType?: PaymentType; quantity: number }>();
  @Output() modalClosed = new EventEmitter<void>();

  selectedPaymentMethod?: PaymentMethod;
  selectedPaymentType?: PaymentType;
  quantity = 1;
  maxQuantity = 10;

  onPaymentMethodSelected(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
    this.selectedPaymentType = undefined;
  }

  onPaymentTypeSelected(type: PaymentType): void {
    this.selectedPaymentType = type;
    this.selectedPaymentMethod = undefined;
  }

  onQuantityChange(change: number): void {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= this.getMaxQuantity()) {
      this.quantity = newQuantity;
    }
  }

  getMaxQuantity(): number {
    return Math.min(this.maxQuantity, this.ticket?.available_amount || 1);
  }

  getTotalPrice(): number {
    return (this.ticket?.price || 0) * this.quantity;
  }

  canPurchase(): boolean {
    return !!(this.selectedPaymentMethod || this.selectedPaymentType);
  }

  onPurchase(): void {
    if (this.canPurchase()) {
      this.purchaseConfirmed.emit({
        paymentMethod: this.selectedPaymentMethod,
        paymentType: this.selectedPaymentType,
        quantity: this.quantity
      });
    }
  }

  onClose(): void {
    this.modalClosed.emit();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}