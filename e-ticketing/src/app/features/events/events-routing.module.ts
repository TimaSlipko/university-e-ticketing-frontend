import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { EventSalesComponent } from './components/event-sales/event-sales.component';
import { ManageSalesComponent } from './components/manage-sales/manage-sales.component';
import { EventTicketsComponent } from './components/event-tickets/event-tickets.component';
import { ManageTicketsComponent } from './components/manage-tickets/manage-tickets.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: EventListComponent
  },
  {
    path: 'create',
    component: CreateEventComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] } // Seller only
  },
  {
    path: ':id',
    component: EventDetailComponent
  },
  {
    path: ':id/sales',
    component: EventSalesComponent
  },
  {
    path: ':id/tickets',
    component: EventTicketsComponent
  },
  {
    path: ':id/edit',
    component: EditEventComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] } // Seller only
  },
  {
    path: ':id/manage-sales',
    component: ManageSalesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] } // Seller only
  },
  {
    path: ':id/manage-tickets',
    component: ManageTicketsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] } // Seller only
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }