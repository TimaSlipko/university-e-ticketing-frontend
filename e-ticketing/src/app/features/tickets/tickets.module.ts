import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TicketsRoutingModule } from './tickets-routing.module';
import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';

@NgModule({
  declarations: [
    MyTicketsComponent,
    TicketDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TicketsRoutingModule,
    PaymentMethodsModule
  ]
})
export class TicketsModule { }