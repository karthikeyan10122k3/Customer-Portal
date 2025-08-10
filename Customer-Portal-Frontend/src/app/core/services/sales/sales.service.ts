import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Inquiry } from '../../models/sales/inquiry.model';
import { map, Observable, tap } from 'rxjs';
import { SalesOrder } from '../../models/sales/sales-order.model';
import { Delivery } from '../../models/sales/delivery.model';
import { ToastService } from '../extras/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private BASE_URL = 'http://localhost:8000/customerPortal/api/sales';

  constructor() {}
  private http =  inject(HttpClient);
  private toastService = inject(ToastService);

  getInquiries(params:any): Observable<{ data: Inquiry[], totalRecords: number}> {
    
    return this.http.post<{ success: boolean; message: string; data: any[]; totalRecords: number }>(`${this.BASE_URL}/inquiries`, params )
      .pipe(
        tap((response) => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map((response) => ({
          data: response.data,
          totalRecords: response.totalRecords
        }))
      );
  }
  

  getSalesOrders(params:any): Observable<{ data: SalesOrder[], totalRecords: number }> {
    return this.http.post<{ success: boolean; message: string; data: any[]; totalRecords: number }>(`${this.BASE_URL}/sales-orders`, params)
    .pipe(
      tap((response) => {
        if (!response.success) {
          this.toastService.showToast(response.message, 'error');
        }
      }),
      map((response) => ({
        data: response.data,
        totalRecords: response.totalRecords
      }))
    );
  }

  getDeliveries(params: any): Observable<{ data: Delivery[] , totalRecords: number }> {
    
    return this.http.post<{ success: boolean; message: string; data: any[]; totalRecords: number }>(`${this.BASE_URL}/deliveries`,params)
      .pipe(
        tap((response) => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map((response) => ({
          data: response.data,
          totalRecords: response.totalRecords
        }))
      );
  }

 
  
}
