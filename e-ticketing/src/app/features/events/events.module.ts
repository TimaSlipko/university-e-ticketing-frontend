import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { PendingEventsComponent } from './components/pending-events/pending-events.component';
import { MyEventsComponent } from './components/my-events/my-events.component';
import { EventSalesComponent } from './components/event-sales/event-sales.component';
import { ManageSalesComponent } from './components/manage-sales/manage-sales.component';
import { EventTicketsComponent } from './components/event-tickets/event-tickets.component';
import { ManageTicketsComponent } from './components/manage-tickets/manage-tickets.component';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { PurchaseModalComponent } from '../tickets/components/purchase-modal/purchase-modal.component';

@NgModule({
  declarations: [
    EventListComponent,
    PendingEventsComponent,
    EventDetailComponent,
    CreateEventComponent,
    EditEventComponent,
    MyEventsComponent,
    EventSalesComponent,
    ManageSalesComponent,
    EventTicketsComponent,
    ManageTicketsComponent,
    PurchaseModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EventsRoutingModule,
    PaymentMethodsModule
  ]
})
export class EventsModule { }