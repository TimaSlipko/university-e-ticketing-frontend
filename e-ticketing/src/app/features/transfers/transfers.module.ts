import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TransfersRoutingModule } from './transfers-routing.module';
import { TransferListComponent } from './components/transfer-list/transfer-list.component';
import { TransferDetailComponent } from './components/transfer-detail/transfer-detail.component';
import { InitiateTransferComponent } from './components/initiate-transfer/initiate-transfer.component';

@NgModule({
  declarations: [
    TransferListComponent,
    TransferDetailComponent,
    InitiateTransferComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TransfersRoutingModule
  ]
})
export class TransfersModule { }