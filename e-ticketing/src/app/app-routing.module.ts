import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'tickets',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'transfers',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/transfers/transfers.module').then(m => m.TransfersModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1, 2] },
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'seller',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] },
    loadChildren: () => import('./features/seller/seller.module').then(m => m.SellerModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [3] },
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./features/payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/events'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }