import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { PrimaryLayoutComponent } from './shared/layout/primary-layout/primary-layout.component';
import { childGuard } from './core/guards/child.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: PrimaryLayoutComponent,
    canActivateChild: [childGuard], 
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./core/routes/sales.route').then((m) => m.salesRoutes),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./core/routes/finance.route').then((m) => m.financeRoutes),
      }
      
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }
];
