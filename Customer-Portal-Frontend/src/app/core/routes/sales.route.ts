import { Routes } from '@angular/router';
import { InquiriesComponent } from '../../modules/sales/inquiries/inquiries.component';
import { OrdersComponent } from '../../modules/sales/orders/orders.component';
import { DeliveriesComponent } from '../../modules/sales/deliveries/deliveries.component';
import { SalesComponent } from '../../modules/sales/sales.component';

export const salesRoutes: Routes = [
  { path: '', component: SalesComponent },
  { path: 'inquiries', component: InquiriesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'deliveries', component: DeliveriesComponent },
];


