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

@NgModule({
  declarations: [
    EventListComponent,
    PendingEventsComponent,
    EventDetailComponent,
    CreateEventComponent,
    EditEventComponent,
    MyEventsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }