import { inject, Injectable } from '@angular/core';
import { ToastService } from '../extras/toast/toast.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { CustomerProfile } from '../../models/profile/CustomerProfile';
import { DashboardKPIData, DashboardTopProduct, DashboardTrend } from '../../models/dashboard/dashboard';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8000/customerPortal/api/customer';

  private toastService = inject(ToastService);
  private http = inject(HttpClient);


  getCustomerProfile(): Observable<{ data: CustomerProfile; name: string }> {
    return this.http
      .get<{ success: boolean; message: string; data: CustomerProfile; name: string }>(
        `${this.baseUrl}/profile`
      )
      .pipe(
        tap((response) => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map((response) => ({
          data: response.data,
          name: response.name
        }))
      );
  }

  fetchDashboardData(params: any): Observable<{ 
    kpis: DashboardKPIData | null; 
    topProducts: DashboardTopProduct[]; 
    trends: DashboardTrend[] 
  }> {
    return this.http.post<{
        success: boolean; 
        message: string; 
        kpis: DashboardKPIData[]; 
        topProducts: DashboardTopProduct[]; 
        trends: DashboardTrend[]; 
      }>(
      `${this.baseUrl}/dashboard`, params
    ).pipe(
      tap(response => {
        if (!response.success) {
          this.toastService.showToast(response.message, 'error');
        }
      }),
      map(response => ({
        kpis: response.kpis.length > 0 ? response.kpis[0] : null,
        trends: response.trends,
        topProducts: response.topProducts
      }))
    );
  }
  
  
}
