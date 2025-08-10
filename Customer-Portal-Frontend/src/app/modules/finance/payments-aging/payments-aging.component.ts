import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf, CurrencyPipe, NgSwitch } from '@angular/common';
import { FinanceService } from '../../../core/services/financial/finance.service';
import { PaymentsAging } from '../../../core/models/financial/payments-aging.model';
import { debounceTime, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payments-aging',
  imports: [MatIconModule, FormsModule, NgSwitch, NgIf, NgFor, CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './payments-aging.component.html',
  styleUrls: ['./payments-aging.component.css']
})
export class PaymentsAgingComponent {

  private paymentCache = new Map<string, { data: PaymentsAging[]; total: number }>();

  public payments: PaymentsAging[] = [];
  public pagedPayments: PaymentsAging[] = [];
  public totalRecords: number = 0;

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public filterStatus: 'ALL' | 'OPEN' | 'OVERDUE' | 'CLEARED'= 'ALL';

  public currentPage: number = 1;
  public pageSize: number = 10;

  public expandedPayments: Set<string> = new Set();
  private searchSubject = new Subject<string>();
  public agingBuckets: string[] = ['1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'];


  private financeService = inject(FinanceService);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(700))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadPayments();
      });
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  private getCacheKey(): string {
    return `${this.currentPage}-${this.pageSize}-${this.searchTerm}-${this.sortOrder}-${this.filterFromDate}-${this.filterToDate}-${this.filterStatus}`;
  }
  

  public loadPayments(): void {
    const cacheKey = this.getCacheKey();
  
    if (this.paymentCache.has(cacheKey)) {
      const cached = this.paymentCache.get(cacheKey)!;
      this.payments = cached.data;
      this.totalRecords = cached.total;
      this.expandedPayments.clear();
    
      if (this.filterStatus === 'ALL') {
        this.pagedPayments = this.payments;
      } else {
        this.updatePagedPayments();
      }
      return;
    }
    
  
    const params = {
      fromDate: this.filterFromDate || '1900-01-01',
      toDate: this.filterToDate || '9999-12-31',
      isSortNewest: this.sortOrder === 'asc' ? '' : 'X',
      pageNum: this.filterStatus === 'ALL' ? this.currentPage : 1,
      pageSize: this.filterStatus === 'ALL' ? this.pageSize : 9999,
      documentNumber: this.searchTerm || '',
      status: this.filterStatus === 'ALL' ? '' : this.filterStatus
    };
  
    this.financeService.getPaymentAgingData(params).subscribe({
      next: (response: { data: PaymentsAging[]; totalRecords: number }) => {
        this.payments = response.data;
        this.totalRecords = response.totalRecords;
        this.expandedPayments.clear();
  
        if (this.filterStatus === 'ALL') {
          this.pagedPayments = this.payments;
        } else {
          this.updatePagedPayments();
        }
  
        
        this.paymentCache.set(cacheKey, {
          data: response.data,
          total: response.totalRecords
        });
        
      },
      error: (err) => {
        console.error('Failed to fetch payments', err);
      }
    });
  }
  

  private updatePagedPayments(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedPayments = this.payments.slice(start, end);
  }

  public onPageSizeChange(): void {
    this.paymentCache.clear();
    this.currentPage = 1;
    this.scrollToTop();
    this.loadPayments();
  }

  public onSearchChange(term: string): void {
    this.paymentCache.clear();
    this.searchSubject.next(term);
  }
  
  public onDateChange(): void {
    this.paymentCache.clear();
    this.currentPage = 1;
    this.loadPayments();
  }
  
  public onStatusChange(): void {
    this.paymentCache.clear();
    this.currentPage = 1;
    this.loadPayments();
  }
  
  public onSortChange(): void {
    this.paymentCache.clear();
    this.currentPage = 1;
    this.loadPayments();
  }
  


  public get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
      if (this.filterStatus === 'ALL') {
        this.loadPayments();
      } else {
        this.updatePagedPayments();
      }
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
      if (this.filterStatus === 'ALL') {
        this.loadPayments();
      } else {
        this.updatePagedPayments();
      }
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
      if (this.filterStatus === 'ALL') {
        this.loadPayments();
      } else {
        this.updatePagedPayments();
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public getBucketTotal(bucket: string): number {
    
    return this.payments
      .filter(p => p.AgingBucket === bucket)
      .reduce((sum, p) => sum + Number(p.NetAmount), 0);
  }

  public getStatusTotal(status: 'OPEN' | 'OVERDUE' | 'CLEARED'): number {
    return this.payments
      .filter(p => p.AgingStatus === status)
      .reduce((sum, p) => sum + Number(p.NetAmount), 0);
  }

  public getAgingBucketColor(bucket: string): string {
    switch (bucket) {
      case '1-30 Days': return 'blue';
      case '31-60 Days': return 'green';
      case '61-90 Days': return 'orange';
      case '90+ Days': return 'red';
      default: return 'blue';
    }
  }

  public trackByPaymentNumber(index: number, payment: PaymentsAging): string {
    return payment.BillingDocumentNumber;
  }
}