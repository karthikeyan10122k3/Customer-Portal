import { Component, inject } from '@angular/core';
import { FinanceService } from '../../../core/services/financial/finance.service';
import { Invoice } from '../../../core/models/financial/invoice.model';
import { debounceTime, Subject } from 'rxjs';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { SalesItemNumberPipe } from '../../../shared/pipes/sales-item-number.pipe';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoices',
  imports: [NgIf, NgFor, FormsModule , MatIcon, CurrencyPipe, CommonModule, SalesItemNumberPipe, RouterLink],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {

  private invoiceCache = new Map<string, { data: Invoice[], total: number }>();

  public invoices: Invoice[] = [];
  public pagedInvoices: Invoice[] = [];
  public totalRecords: number = 0;

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public selectedStatus: 'CANCELLED' | 'ALL' = 'ALL';

  public currentPage: number = 1;
  public pageSize: number = 10;

  public expandedInvoices: Set<string> = new Set();
  private searchSubject = new Subject<string>();

  private financeService = inject(FinanceService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(700))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadInvoices();
      });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchTerm = params['invoice'] || '';
      this.loadInvoices();
    });
  }

  private generateCacheKey(): string {
    return JSON.stringify({
      search: this.searchTerm.trim().toLowerCase(),
      from: this.filterFromDate || '1900-01-01',
      to: this.filterToDate || '9999-12-31',
      sort: this.sortOrder,
      status: this.selectedStatus,
      pageSize: this.pageSize,
      page: this.currentPage
    });
  }

  public loadInvoices(): void {
    const cacheKey = this.generateCacheKey();

    if (this.invoiceCache.has(cacheKey)) {
      const cached = this.invoiceCache.get(cacheKey)!;
      this.invoices = cached.data;
      this.totalRecords = cached.total;
      this.expandedInvoices.clear();

      if (this.selectedStatus === 'ALL') {
        this.pagedInvoices = this.invoices;
      } else {
        this.updatePagedInvoices();
      }
      return;
    }

    const params = {
      fromDate: this.filterFromDate || '1900-01-01',
      toDate: this.filterToDate || '9999-12-31',
      isSortNewest: this.sortOrder === 'asc' ? '' : 'X',
      pageNum: this.selectedStatus === 'ALL' ? this.currentPage : 1,
      pageSize: this.selectedStatus === 'ALL' ? this.pageSize : 9999,
      documentNumber: this.searchTerm || '',
      status: this.selectedStatus === 'ALL' ? '' : this.selectedStatus
    };

    this.financeService.getInvoiceData(params).subscribe({
      next: (response: { data: Invoice[]; totalRecords: number }) => {
        this.invoices = response.data;
        this.totalRecords = response.totalRecords;
        this.expandedInvoices.clear();

        if (this.selectedStatus === 'ALL') {
          this.pagedInvoices = this.invoices;
        } else {
          this.updatePagedInvoices();
        }

        this.invoiceCache.set(cacheKey, {
          data: response.data,
          total: response.totalRecords
        });
      },
      error: (err) => {
        console.error('Failed to fetch invoices', err);
      }
    });
  }

  private updatePagedInvoices(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedInvoices = this.invoices.slice(start, end);
  }

  public onPageSizeChange(): void {
    this.invoiceCache.clear();
    this.currentPage = 1;
    this.scrollToTop();
    this.loadInvoices();
  }

  public onSearchChange(term: string): void {
    this.invoiceCache.clear();
    this.searchSubject.next(term);
  }

  public onDateChange(): void {
    this.invoiceCache.clear();
    this.currentPage = 1;
    this.loadInvoices();
  }

  public onStatusChange(): void {
    this.invoiceCache.clear();
    this.currentPage = 1;
    this.loadInvoices();
  }

  public onSortChange(): void {
    this.invoiceCache.clear();
    this.currentPage = 1;
    this.loadInvoices();
  }

  public toggleItems(billingDocumentNumber: string): void {
    if (this.expandedInvoices.has(billingDocumentNumber)) {
      this.expandedInvoices.delete(billingDocumentNumber);
    } else {
      this.expandedInvoices.add(billingDocumentNumber);
    }
  }

  public isExpanded(billingDocumentNumber: string): boolean {
    return this.expandedInvoices.has(billingDocumentNumber);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
      if (this.selectedStatus === 'ALL') {
        this.loadInvoices();
      } else {
        this.updatePagedInvoices();
      }
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
      if (this.selectedStatus === 'ALL') {
        this.loadInvoices();
      } else {
        this.updatePagedInvoices();
      }
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
      if (this.selectedStatus === 'ALL') {
        this.loadInvoices();
      } else {
        this.updatePagedInvoices();
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  downloadInvoicePdf(billingDocumentNumber: string): void {
    this.financeService.getInvoicePdf(billingDocumentNumber);
  }

  downloadAllInvoicesPdf(): void {
    console.log('Download All Invoices PDF');
    this.financeService.getInvoicePdf();
  }

  public trackByBillingDocumentNumber(index: number, invoice: Invoice): string {
    return invoice.BillingDocumentNumber;
  }

}
