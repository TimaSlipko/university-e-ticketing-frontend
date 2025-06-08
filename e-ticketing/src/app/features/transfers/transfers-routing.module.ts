import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferListComponent } from './components/transfer-list/transfer-list.component';
import { TransferDetailComponent } from './components/transfer-detail/transfer-detail.component';
import { InitiateTransferComponent } from './components/initiate-transfer/initiate-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: TransferListComponent
  },
  {
    path: 'initiate',
    component: InitiateTransferComponent
  },
  {
    path: ':id',
    component: TransferDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfersRoutingModule { }