import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { Memo } from '../../../core/models/financial/memos.model';
import { FinanceService } from '../../../core/services/financial/finance.service';

@Component({
  selector: 'app-memos',
  imports: [MatIconModule, FormsModule, NgIf, NgFor, CommonModule, RouterLink],
  templateUrl: './memos.component.html',
  styleUrl: './memos.component.css'
})
export class MemosComponent {

  private memoCache = new Map<string, { data: Memo[], total: number }>();

  public memos: Memo[] = [];
  public pagedMemos: Memo[] = [];
  public totalRecords: number = 0;

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public selectedStatus: 'ACTIVE' | 'CANCELLED' | 'ALL' = 'ALL';
  public selectedMemoType: 'L2' | 'G2' | 'ALL' = 'ALL';

  public currentPage: number = 1;
  public pageSize: number = 10;

  public expandedMemos: Set<string> = new Set();
  private searchSubject = new Subject<string>();

  private financeService = inject(FinanceService);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(700))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadMemos();
      });
  }

  ngOnInit(): void {
    this.loadMemos();
  }

  private getCacheKey(): string {
    return JSON.stringify({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm.trim().toLowerCase(),
      sort: this.sortOrder,
      from: this.filterFromDate,
      to: this.filterToDate,
      status: this.selectedStatus,
      type: this.selectedMemoType
    });
  }

  public loadMemos(): void {
    const cacheKey = this.getCacheKey();

    if (this.memoCache.has(cacheKey)) {
      const cached = this.memoCache.get(cacheKey)!;
      this.memos = cached.data;
      this.totalRecords = cached.total;
      this.expandedMemos.clear();

      if (this.selectedStatus === 'ALL') {
        this.pagedMemos = this.memos;
      } else {
        this.updatePagedMemos();
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
      status: this.selectedStatus === 'ALL' ? '' : this.selectedStatus,
      billingType: this.selectedMemoType === 'ALL' ? '' : this.selectedMemoType,
    };

    this.financeService.getMemoData(params).subscribe({
      next: (response: { data: Memo[], totalRecords: number }) => {
        this.memos = response.data;
        this.totalRecords = response.totalRecords;
        this.expandedMemos.clear();

        if (this.selectedStatus === 'ALL') {
          this.pagedMemos = this.memos;
        } else {
          this.updatePagedMemos();
        }

        this.memoCache.set(cacheKey, {
          data: response.data,
          total: response.totalRecords
        });
      },
      error: (err) => {
        console.error('Failed to fetch memos', err);
      }
    });
  }

  private updatePagedMemos(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedMemos = this.memos.slice(start, end);
  }

  public onPageSizeChange(): void {
    this.memoCache.clear();
    this.currentPage = 1;
    this.scrollToTop();
    this.loadMemos();
  }

  public onSearchChange(term: string): void {
    this.memoCache.clear();
    this.searchSubject.next(term);
  }

  public onDateChange(): void {
    this.memoCache.clear();
    this.currentPage = 1;
    this.loadMemos();
  }

  public onStatusChange(): void {
    this.memoCache.clear();
    this.currentPage = 1;
    this.loadMemos();
  }

  public onSortChange(): void {
    this.memoCache.clear();
    this.currentPage = 1;
    this.loadMemos();
  }

  public toggleItems(memoNumber: string): void {
    if (this.expandedMemos.has(memoNumber)) {
      this.expandedMemos.delete(memoNumber);
    } else {
      this.expandedMemos.add(memoNumber);
    }
  }

  public isExpanded(memoNumber: string): boolean {
    return this.expandedMemos.has(memoNumber);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
      if (this.selectedStatus === 'ALL') {
        this.loadMemos();
      } else {
        this.updatePagedMemos();
      }
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
      if (this.selectedStatus === 'ALL') {
        this.loadMemos();
      } else {
        this.updatePagedMemos();
      }
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
      if (this.selectedStatus === 'ALL') {
        this.loadMemos();
      } else {
        this.updatePagedMemos();
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public trackByMemoNumber(index: number, memo: Memo): string {
    return memo.BillingDocumentNumber;
  }
}
