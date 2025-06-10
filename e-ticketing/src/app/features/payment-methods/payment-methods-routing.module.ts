import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMethodsListComponent } from './components/payment-methods-list/payment-methods-list.component';
import { AddPaymentMethodComponent } from './components/add-payment-method/add-payment-method.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodsListComponent
  },
  {
    path: 'add',
    component: AddPaymentMethodComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentMethodsRoutingModule { }