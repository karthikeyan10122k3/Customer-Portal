import { Component, inject } from '@angular/core';
import { Delivery } from '../../../core/models/sales/delivery.model';
import { SalesService } from '../../../core/services/sales/sales.service';
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-deliveries',
  imports: [NgIf, NgFor, FormsModule , MatIcon, CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent {

  private deliveryCache = new Map<string, { data: Delivery[], total: number }>();


  public deliveries: Delivery[] = [];
  public pagedDeliveries: Delivery[] = [];
  public totalRecords: number = 0;
  public filteredDeliveries: Delivery[] = [];

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public selectedStatus: 'OPEN' | 'PARTIAL' | 'FULL' | 'ALL' = 'ALL';

  public currentPage: number = 1;
  public pageSize: number = 5;

  public expandedDeliveries: Set<string> = new Set();
  private searchSubject = new Subject<string>();

  private salesService = inject(SalesService);
  private activatedRoute = inject(ActivatedRoute);

    constructor() {
      this.searchSubject
        .pipe(debounceTime(700))
        .subscribe((searchTerm) => {
          this.searchTerm = searchTerm;
          this.currentPage = 1;
          this.loadDeliveries();
        });
    }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchTerm = params['delivery'] || '';
      this.loadDeliveries();
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
  

  public loadDeliveries(): void {
    const cacheKey = this.generateCacheKey();
  
    if (this.deliveryCache.has(cacheKey)) {
      const cached = this.deliveryCache.get(cacheKey)!;
      this.deliveries = cached.data;
      this.totalRecords = this.selectedStatus === 'ALL' ? cached.total : cached.data.length;
      this.expandedDeliveries.clear();
  
      if (this.selectedStatus === 'ALL') {
        this.pagedDeliveries = this.deliveries;
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
  
    this.salesService.getDeliveries(params).subscribe({
      next: (response: { data: Delivery[]; totalRecords: number }) => {
        this.deliveries = response.data;
        this.totalRecords = this.selectedStatus === 'ALL' ? response.totalRecords : response.data.length;
        this.expandedDeliveries.clear();
  
        if (this.selectedStatus === 'ALL') {
          this.pagedDeliveries = this.deliveries;
        } else {
          this.updatePagedOrders();
        }
  
        this.deliveryCache.set(cacheKey, {
          data: response.data,
          total: response.totalRecords
        });
      },
      error: (err) => {
        console.error('Failed to fetch deliveries', err);
      }
    });
  }
  
  private updatePagedOrders(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedDeliveries = this.deliveries.slice(start, end);
  }

  public onPageSizeChange(): void {
    this.deliveryCache.clear(); 
    this.currentPage = 1;
    this.scrollToTop();
    this.loadDeliveries();
  }

  public onSearchChange(term: string): void {
    this.deliveryCache.clear(); 
    this.searchSubject.next(term);
  }

  public onDateChange(): void {
    this.deliveryCache.clear(); 
    this.currentPage = 1;
    this.loadDeliveries();
  }

  public onStatusChange(): void {
    this.deliveryCache.clear(); 
    this.currentPage = 1;
    this.loadDeliveries();
  }

  public onSortChange(): void {
    this.deliveryCache.clear(); 
    this.currentPage = 1;
    this.loadDeliveries();
  }

  public toggleItems(deliveryNumber: string): void {
    if (this.expandedDeliveries.has(deliveryNumber)) {
      this.expandedDeliveries.delete(deliveryNumber);
    } else {
      this.expandedDeliveries.add(deliveryNumber);
    }
  }

  public isExpanded(deliveryNumber: string): boolean {
    return this.expandedDeliveries.has(deliveryNumber);
  }

  public get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
      if (this.selectedStatus === "ALL") {
        this.loadDeliveries();
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
        this.loadDeliveries();
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
        this.loadDeliveries();
      } else {
        this.updatePagedOrders();
      }
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public trackByDeliveryNumber(index: number, delivery: Delivery): string {
    return delivery.DeliveryNumber;
  }
}
