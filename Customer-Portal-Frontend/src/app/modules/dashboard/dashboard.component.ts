import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '../../core/services/customer/customer.service';
import { DashboardKPIData, DashboardTopProduct, DashboardTrend } from '../../core/models/dashboard/dashboard';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, NgIf, NgFor, NgChartsModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public kpis: DashboardKPIData | null = null;
  public topProducts: DashboardTopProduct[] = [];
  public trends: DashboardTrend[] = [];

  public filterFromDate = '';
  public filterToDate = '';

  private customerService = inject(CustomerService);

  // Chart configuration
  public pieChartLabels = ['Open', 'Partial', 'Closed'];
  public pieChartType: ChartConfiguration<'doughnut'>['type'] = 'doughnut';
  public pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  public inquiryStatusChartData?: ChartConfiguration<'doughnut'>['data'];
  public salesOrderStatusChartData?: ChartConfiguration<'doughnut'>['data'];
  public deliveryStatusChartData?: ChartConfiguration<'doughnut'>['data'];

  public funnelChartData: ChartConfiguration<'bar'>['data'] | null = null;
  public funnelChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: { stacked: true, beginAtZero: true },
      y: { stacked: true }
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    }
  };

  public trendChartType: ChartConfiguration<'line'>['type'] = 'line';
  public trendChartData?: ChartConfiguration<'line'>['data'];
  public trendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { beginAtZero: true, title: { display: true, text: 'Count' } }
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    }
  };

  public topProductsChartType: 'bar' = 'bar';
  public topProductsChartData?: ChartConfiguration<'bar'>['data'];
  public topProductsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {
        ticks: { maxRotation: 90, minRotation: 45 },
        title: { display: true, text: 'Products' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Quantity Sold' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  public loadDashboardData(): void {
    const params = {
      fromDate: this.filterFromDate || '1900-01-01',
      toDate: this.filterToDate || '9999-12-31'
    };

    this.customerService.fetchDashboardData(params).subscribe({
      next: ({ kpis, topProducts, trends }) => {
        this.kpis = kpis;
        this.topProducts = topProducts;
        this.trends = trends;

        if (kpis) {
          this.setupPieCharts(kpis);
          this.setupFunnelChart(kpis);
        }

        if (trends?.length) this.setupTrendChart(trends);
        if (topProducts?.length) this.setupTopProductsChart(topProducts);
      },
      error: (err) => console.error('Failed to fetch dashboard data', err)
    });
  }

  private setupPieCharts(kpis: DashboardKPIData): void {
    this.inquiryStatusChartData = this.buildPieData([
      kpis.InquiryOpenCount,
      kpis.InquiryPartialConversion,
      kpis.InquiryClosedConversion
    ]);

    this.salesOrderStatusChartData = this.buildPieData([
      kpis.SalesOrderOpenCount,
      kpis.SalesOrderPartialDelivery,
      kpis.SalesOrderClosedDelivery
    ]);

    this.deliveryStatusChartData = this.buildPieData([
      kpis.DeliveryOpenCount,
      kpis.DeliveryPartialBilling,
      kpis.DeliveryClosedBilling
    ]);
  }

  private setupFunnelChart(kpis: DashboardKPIData): void {
    this.funnelChartData = {
      labels: ['Inquiries → Sales Orders', 'Sales Orders → Deliveries'],
      datasets: [
        {
          label: 'Open',
          data: [kpis.InquiryOpenCount, kpis.SalesOrderOpenCount].map(Number),
          backgroundColor: '#ffcc00'
        },
        {
          label: 'Partial',
          data: [kpis.InquiryPartialConversion, kpis.SalesOrderPartialDelivery].map(Number),
          backgroundColor: '#ff9900'
        },
        {
          label: 'Closed',
          data: [kpis.InquiryClosedConversion, kpis.SalesOrderClosedDelivery].map(Number),
          backgroundColor: '#28a745'
        }
      ]
    };
  }

  private setupTrendChart(trends: DashboardTrend[]): void {
    const sorted = trends?.slice().sort((a, b) => a.DocumentMonth.localeCompare(b.DocumentMonth));
    this.trendChartData = {
      labels: sorted.map(t => this.formatMonth(t.DocumentMonth)),
      datasets: [
        {
          label: 'Inquiries',
          data: sorted.map(t => Number(t.InquiryCount)),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.3)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Sales Orders',
          data: sorted.map(t => Number(t.SalesOrderCount)),
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.3)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'Deliveries',
          data: sorted.map(t => Number(t.DeliveryCount)),
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255,193,7,0.3)',
          fill: true,
          tension: 0.3
        }
      ]
    };
  }

  private setupTopProductsChart(products: DashboardTopProduct[]): void {
    this.topProductsChartData = {
      labels: products.filter(p => p.MaterialDescription && p.MaterialDescription !== 'Unknown').map(p => p.MaterialDescription),

      datasets: [{
        data: products.map(p => Number(p.QuantitySold)),
        backgroundColor: '#007bff'
      }]
    };
  }

  private buildPieData(dataPoints: (number | string)[]): ChartConfiguration<'doughnut'>['data'] {
    return {
      labels: this.pieChartLabels,
      datasets: [{
        data: dataPoints.map(Number),
        backgroundColor: ['#ffcc00', '#ff9900', '#28a745']
      }]
    };
  }

  private formatMonth(monthString: string | undefined): string {
    if (!monthString || monthString.length < 6) return 'Invalid';
  
    const year = monthString.slice(0, 4);
    const month = monthString.slice(4);
    const date = new Date(Number(year), Number(month) - 1);
  
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }
  

  public calcAvgDeliveryDaysPercentage(): number {
    if (!this.kpis) return 0;
    const avgDays = Number(this.kpis.AverageDeliveryDays);
    const maxAvgDays = 10;
    return isNaN(avgDays) ? 0 : Math.min((avgDays / maxAvgDays) * 100, 100);
  }
}
