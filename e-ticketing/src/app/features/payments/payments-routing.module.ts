import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPaymentsComponent } from './components/user-payments/user-payments.component';
import { SellerPaymentsComponent } from './components/seller-payments/seller-payments.component';

const routes: Routes = [
  {
    path: '',
    component: UserPaymentsComponent
  },
  {
    path: 'seller',
    component: SellerPaymentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }