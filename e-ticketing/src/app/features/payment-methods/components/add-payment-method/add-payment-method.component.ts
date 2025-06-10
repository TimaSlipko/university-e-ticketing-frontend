import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentMethodService, CreatePaymentMethodRequest } from '../../../../core/services/payment-method.service';
import { PaymentType } from 'src/app/core/models';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html'
})
export class AddPaymentMethodComponent implements OnInit {
  paymentForm: FormGroup;
  selectedType: PaymentType = PaymentType.CARD;
  PaymentType = PaymentType;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentMethodService: PaymentMethodService
  ) {
    this.paymentForm = this.fb.group({
      type: [PaymentType.CARD, Validators.required],
      is_default: [false],
      // Credit Card fields
      card_number: [''],
      expiry_date: [''],
      cvv: [''],
      card_holder: [''],
      // PayPal fields
      paypal_email: [''],
      // Google Pay fields
      google_email: ['']
    });
  }

  ngOnInit(): void {
    this.onTypeChange();
    this.paymentForm.get('type')?.valueChanges.subscribe(() => {
      this.onTypeChange();
    });
  }

  onTypeChange(): void {
    this.selectedType = this.paymentForm.get('type')?.value;
    this.clearValidators();
    this.setValidators();
  }

  clearValidators(): void {
    const fields = ['card_number', 'expiry_date', 'cvv', 'card_holder', 'paypal_email', 'google_email'];
    fields.forEach(field => {
      const control = this.paymentForm.get(field);
      control?.clearValidators();
      control?.setValue('');
      control?.updateValueAndValidity();
    });
  }

  setValidators(): void {
    switch (this.selectedType) {
      case PaymentType.CARD:
        this.paymentForm.get('card_number')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        this.paymentForm.get('expiry_date')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        this.paymentForm.get('card_holder')?.setValidators([Validators.required]);
        break;
      case PaymentType.PAYPAL:
        this.paymentForm.get('paypal_email')?.setValidators([Validators.required, Validators.email]);
        break;
      case PaymentType.GOOGLEPAY:
        this.paymentForm.get('google_email')?.setValidators([Validators.required, Validators.email]);
        break;
    }

    // Update validation
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formValue = this.paymentForm.value;
      const request: CreatePaymentMethodRequest = {
        type: formValue.type,
        is_default: formValue.is_default,
        payment_data: this.buildPaymentData(formValue)
      };

      this.paymentMethodService.createPaymentMethod(request).subscribe({
        next: () => {
          this.success = 'Payment method added successfully!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/payment-methods']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to add payment method';
          this.loading = false;
        }
      });
    }
  }

  buildPaymentData(formValue: any): any {
    switch (this.selectedType) {
      case PaymentType.CARD:
        return {
          card_number: formValue.card_number,
          expiry_date: formValue.expiry_date,
          cvv: formValue.cvv,
          card_holder: formValue.card_holder
        };
      case PaymentType.PAYPAL:
        return {
          paypal_email: formValue.paypal_email
        };
      case PaymentType.GOOGLEPAY:
        return {
          google_email: formValue.google_email
        };
      default:
        return {};
    }
  }

  getPaymentTypeName(type: PaymentType): string {
    switch (type) {
      case PaymentType.CARD:
        return 'Credit Card';
      case PaymentType.PAYPAL:
        return 'PayPal';
      case PaymentType.GOOGLEPAY:
        return 'Google Pay';
      default:
        return 'Unknown';
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    this.paymentForm.patchValue({ card_number: value });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.patchValue({ expiry_date: value });
  }
}