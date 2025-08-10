import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Inquiry } from '../../../core/models/sales/inquiry.model';
import { SalesService } from '../../../core/services/sales/sales.service';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { SalesItemNumberPipe } from '../../../shared/pipes/sales-item-number.pipe';

@Component({
  selector: 'app-inquiries',
  imports: [MatIconModule, FormsModule, NgIf, NgFor, CommonModule, SalesItemNumberPipe, RouterLink],
  templateUrl: './inquiries.component.html',
  styleUrl: './inquiries.component.css'
})

export class InquiriesComponent {

  private inquiryCache = new Map<string, { data: Inquiry[]; total: number }>();

  public inquiries: Inquiry[] = [];
  public pagedSalesInquiries: Inquiry[] = [];
  public totalRecords: number = 0; 

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public selectedStatus: 'OPEN' | 'PARTIAL' | 'FULL' | 'ALL' = 'ALL';

  // Pagination
  public currentPage: number = 1;
  public pageSize: number = 10;

  public expandedInquiries: Set<string> = new Set();
  private searchSubject = new Subject<string>();

  private salesService = inject(SalesService);

  constructor(){
    this.searchSubject
    .pipe(debounceTime(700))
    .subscribe((searchTerm) => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadInquiries();
    });
  }

  ngOnInit(): void {
    this.loadInquiries();
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
  

  public loadInquiries(): void {
    const cacheKey = this.generateCacheKey();
  
    if (this.inquiryCache.has(cacheKey)) {
      const cached = this.inquiryCache.get(cacheKey)!;
      this.inquiries = cached.data;
      this.totalRecords = cached.total;
      this.expandedInquiries.clear();
  
      if (this.selectedStatus === 'ALL') {
        this.pagedSalesInquiries = this.inquiries;
      } else {
        this.updatePagedInquiries();
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
  
    this.salesService.getInquiries(params).subscribe({
      next: (response: { data: Inquiry[]; totalRecords: number }) => {
        this.inquiries = response.data;
        this.totalRecords = response.totalRecords;
        this.expandedInquiries.clear();
  
        if (this.selectedStatus === 'ALL') {
          this.pagedSalesInquiries = this.inquiries;
        } else {
          this.updatePagedInquiries();
        }
  
        this.inquiryCache.set(cacheKey, {
          data: response.data,
          total: response.totalRecords
        });
      },
      error: (err) => {
        console.error('Failed to fetch inquiries', err);
      }
    });
  }
  

  private updatePagedInquiries(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSalesInquiries = this.inquiries.slice(start, end);
  }
  
  public onPageSizeChange(): void {
    this.inquiryCache.clear();
    this.currentPage = 1;
    this.scrollToTop();
    this.loadInquiries();
  }

  public onSearchChange(term: string): void {
    this.inquiryCache.clear();
    this.searchSubject.next(term);
  }

  public onDateChange(): void {
    this.inquiryCache.clear();
    this.currentPage = 1;
    this.loadInquiries();
  }
  public onStatusChange(): void {
    this.inquiryCache.clear();
    this.currentPage = 1;
    this.loadInquiries();
  }
  public onSortChange(): void {
    this.inquiryCache.clear();
    this.currentPage = 1;
    this.loadInquiries();
  }


  public toggleItems(inquiryNumber: string): void {
    if (this.expandedInquiries.has(inquiryNumber)) {
      this.expandedInquiries.delete(inquiryNumber);
    } else {
      this.expandedInquiries.add(inquiryNumber);
    }
  }

  public isExpanded(inquiryNumber: string): boolean {
    return this.expandedInquiries.has(inquiryNumber);
  }

  // Pagination controls
  public get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadInquiries();
      } else {
        this.updatePagedInquiries();
      }
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadInquiries();
      } else {
        this.updatePagedInquiries();
      }
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadInquiries();
      } else {
        this.updatePagedInquiries();
      }
    }
  }
  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public trackByInquiryNumber(index: number, inquiry: Inquiry): string {
    return inquiry.InquiryNumber;
  }
}