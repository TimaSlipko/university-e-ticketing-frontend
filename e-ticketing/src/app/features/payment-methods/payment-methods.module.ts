import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsListComponent } from './components/payment-methods-list/payment-methods-list.component';
import { AddPaymentMethodComponent } from './components/add-payment-method/add-payment-method.component';
import { PaymentMethodSelectorComponent } from './components/payment-method-selector/payment-method-selector.component';

@NgModule({
  declarations: [
    PaymentMethodsListComponent,
    AddPaymentMethodComponent,
    PaymentMethodSelectorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    PaymentMethodsRoutingModule
  ],
  exports: [
    PaymentMethodSelectorComponent
  ]
})
export class PaymentMethodsModule { }