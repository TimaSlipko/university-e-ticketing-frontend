import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingEventsComponent } from '../events/components/pending-events/pending-events.component';

const routes: Routes = [
  {
    path: 'events/pending',
    component: PendingEventsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }