import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PaymentsRoutingModule } from './payments-routing.module';
import { UserPaymentsComponent } from './components/user-payments/user-payments.component';
import { SellerPaymentsComponent } from './components/seller-payments/seller-payments.component';

@NgModule({
  declarations: [
    UserPaymentsComponent,
    SellerPaymentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PaymentsRoutingModule
  ]
})
export class PaymentsModule { }