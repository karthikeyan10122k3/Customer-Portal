import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastService } from '../extras/toast/toast.service';
import { map, Observable, tap } from 'rxjs';
import { PaymentsAging } from '../../models/financial/payments-aging.model';
import { Invoice } from '../../models/financial/invoice.model';
import { Memo } from '../../models/financial/memos.model';
import { AgingAnalysis, OverAllSalesSummary, PaymentDetail, ProductSummary } from '../../models/financial/overall-sales.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private BASE_URL = 'http://localhost:8000/customerPortal/api/finance';

  constructor() {}

  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  getInvoiceData(params: any): Observable<{ data: Invoice[], totalRecords: number }> {
    return this.http.post<{ success: boolean; message: string; data: any[]; totalRecords: number }>(`${this.BASE_URL}/invoices`, params)
      .pipe(
        tap(response => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map(response => ({
          data: response.data,
          totalRecords: response.totalRecords
        }))
      );
  }

  getPaymentAgingData(params: any): Observable<{ data: PaymentsAging[] , totalRecords: number }> {
    return this.http.post<{ success: boolean; message: string; data: any[]; totalRecords: number  }>(`${this.BASE_URL}/payments-aging`,params)
      .pipe(
        tap(response => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map(response => ({
          data: response.data,
          totalRecords: response.totalRecords
        }))
      );
  }
  
  
  getMemoData(params: any): Observable<{ data: Memo[], totalRecords: number  }> {
    return this.http.post<{ success: boolean; message: string; data: any[]; totalRecords: number  }>(`${this.BASE_URL}/memos`,params)
      .pipe(
        tap(response => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map(response => ({
          data: response.data,
          totalRecords: response.totalRecords
        }))
      );
  }

  getOverAllSalesData(): Observable<
  { overAllSalesSummary: OverAllSalesSummary, 
    aging: AgingAnalysis[], 
    paymentDetails: PaymentDetail[], 
    productSummary: ProductSummary[],   
  }
  > {
    return this.http.get<{ success: boolean; message: string; overAllSalesSummary: OverAllSalesSummary, 
      aging: AgingAnalysis[], 
      paymentDetails: PaymentDetail[], 
      productSummary: ProductSummary[],}>(`${this.BASE_URL}/overAllSales`)
      .pipe(
        tap(response => {
          if (!response.success) {
            this.toastService.showToast(response.message, 'error');
          }
        }),
        map(response => ({
          overAllSalesSummary: response.overAllSalesSummary,
          aging: response.aging,
          paymentDetails: response.paymentDetails,
          productSummary: response.productSummary,
          
        }))
      );
  }

  getInvoicePdf(documentNumber: any = ''): void {
    console.log("CALLED");
    
    this.http.post(`${this.BASE_URL}/invoices-pdf`, { documentNumber }, { responseType: 'blob' }) 
      .subscribe({
        next: (pdfBlob: Blob) => {
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl);
        },
        error: (err) => {
          this.toastService.showToast('Failed to load invoice PDF', "error");
        }
      });
  }

  

}
