import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
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
    path: ':id/edit',
    component: EditEventComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] } // Seller only
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }