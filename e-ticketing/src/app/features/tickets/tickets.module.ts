import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TicketsRoutingModule } from './tickets-routing.module';
import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { PurchaseTicketComponent } from './components/purchase-ticket/purchase-ticket.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';

@NgModule({
  declarations: [
    MyTicketsComponent,
    PurchaseTicketComponent,
    TicketDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TicketsRoutingModule
  ]
})
export class TicketsModule { }