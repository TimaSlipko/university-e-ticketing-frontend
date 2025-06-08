import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { PurchaseTicketComponent } from './components/purchase-ticket/purchase-ticket.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my',
    pathMatch: 'full'
  },
  {
    path: 'my',
    component: MyTicketsComponent
  },
  {
    path: 'purchase',
    component: PurchaseTicketComponent
  },
  {
    path: ':id',
    component: TicketDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }