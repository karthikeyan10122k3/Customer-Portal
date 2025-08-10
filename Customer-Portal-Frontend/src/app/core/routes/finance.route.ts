import { Routes } from '@angular/router';
import { FinanceComponent } from '../../modules/finance/finance.component';
import { InvoicesComponent } from '../../modules/finance/invoices/invoices.component';
import { PaymentsAgingComponent } from '../../modules/finance/payments-aging/payments-aging.component';
import { MemosComponent } from '../../modules/finance/memos/memos.component';
import { OverallSalesComponent } from '../../modules/finance/overall-sales/overall-sales.component';

export const financeRoutes: Routes = [
  
  {path: '', component: FinanceComponent,},
  { path: 'invoices', component: InvoicesComponent },
  { path: 'payments', component: PaymentsAgingComponent },
  { path: 'memos', component: MemosComponent },
  { path: 'overall-sales', component: OverallSalesComponent },
    
  
];
