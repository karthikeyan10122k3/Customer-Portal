import { Component, inject, OnInit } from '@angular/core';
import { SalesOrder } from '../../../core/models/sales/sales-order.model';
import { SalesService } from '../../../core/services/sales/sales.service';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, MatIcon, CurrencyPipe, CommonModule, RouterLink ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  private ordersCache = new Map<string, { data: SalesOrder[], total: number }>();

  public salesOrders: SalesOrder[] = [];
  public pagedSalesOrders: SalesOrder[] = [];
  public totalRecords: number = 0;

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public selectedStatus: 'OPEN' | 'PARTIAL' | 'FULL' | 'ALL' = 'ALL';

  public currentPage: number = 1;
  public pageSize: number = 10;

  public expandedOrders: Set<string> = new Set();
  private searchSubject = new Subject<string>();

  private salesService = inject(SalesService);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(700))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadOrders();
      });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchTerm = params['order'] || '';
      this.loadOrders();
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
  

  public loadOrders(): void {
    const cacheKey = this.generateCacheKey();
  
    if (this.ordersCache.has(cacheKey)) {
      const cached = this.ordersCache.get(cacheKey)!;
      this.salesOrders = cached.data;
      this.totalRecords = this.selectedStatus === 'ALL' ? cached.total : cached.data.length;
      this.expandedOrders.clear();
  
      if (this.selectedStatus === 'ALL') {
        this.pagedSalesOrders = this.salesOrders;
      } else {
        this.updatePagedOrders();
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
  
    this.salesService.getSalesOrders(params).subscribe({
      next: (response: { data: SalesOrder[]; totalRecords: number }) => {
        this.salesOrders = response.data;
        this.totalRecords = this.selectedStatus === 'ALL' ? response.totalRecords : this.salesOrders.length;
        this.expandedOrders.clear();
  
        if (this.selectedStatus === 'ALL') {
          this.pagedSalesOrders = this.salesOrders;
        } else {
          this.updatePagedOrders();
        }
  
        this.ordersCache.set(cacheKey, {
          data: response.data,
          total: response.totalRecords
        });
      },
      error: (err) => {
        console.error('Failed to fetch sales orders', err);
      }
    });
  }
  

  private updatePagedOrders(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedSalesOrders = this.salesOrders.slice(start, end);
  }

  public onPageSizeChange(): void {
    this.ordersCache.clear(); 
    this.currentPage = 1;
    this.scrollToTop();
    this.loadOrders();
  }

  public onSearchChange(term: string): void {
    this.ordersCache.clear(); 
    this.searchSubject.next(term);
  }

  public onDateChange(): void {
    this.ordersCache.clear(); 
    this.currentPage = 1;
    this.loadOrders();
  }

  public onStatusChange(): void {
    this.ordersCache.clear(); 
    this.currentPage = 1;
    this.loadOrders();
  }

  public onSortChange(): void {
    this.ordersCache.clear(); 
    this.currentPage = 1;
    this.loadOrders();
  }

  public toggleItems(orderNumber: string): void {
    if (this.expandedOrders.has(orderNumber)) {
      this.expandedOrders.delete(orderNumber);
    } else {
      this.expandedOrders.add(orderNumber);
    }
  }

  public isExpanded(orderNumber: string): boolean {
    return this.expandedOrders.has(orderNumber);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadOrders();
      } else {
        this.updatePagedOrders();
      }
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadOrders();
      } else {
        this.updatePagedOrders();
      }
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadOrders();
      } else {
        this.updatePagedOrders();
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public trackByOrderNumber(index: number, order: SalesOrder): string {
    return order.SalesOrderNumber;
  }
}
