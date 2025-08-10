import { Component, inject, OnInit } from '@angular/core';
import { FinanceService } from '../../../core/services/financial/finance.service';
import { AgingAnalysis, OverAllSalesSummary, PaymentDetail, ProductSummary } from '../../../core/models/financial/overall-sales.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, TooltipItem, ActiveElement } from 'chart.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overall-sales',
  imports: [MatIconModule, NgIf, CommonModule, NgChartsModule, RouterLink],
  templateUrl: './overall-sales.component.html',
  styleUrls: ['./overall-sales.component.css']
})
export class OverallSalesComponent implements OnInit {
  isLoading = true;
  overAllSalesSummary: OverAllSalesSummary = this.initializeSummary();
  aging: AgingAnalysis[] = [];
  paymentDetails: PaymentDetail[] = [];
  productSummary: ProductSummary[] = [];

  isPaymentDrilldownOpen = false;
  selectedStatusLabel = '';
  filteredPaymentDetails: PaymentDetail[] = [];

  paymentStatusChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Cleared', 'Open', 'Overdue'],
    datasets: [{ data: [], backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'], hoverOffset: 10 }]
  };

  paymentStatusChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'pie'>) => this.getDonutTooltip(tooltipItem)
        }
      },
      legend: { display: true, position: 'left' },
      title: { display: false }
    }
  };

  // Doughnut Chart for Document Counts
  public documentCountsChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Invoices', 'Credit Memos', 'Debit Memos'],
    datasets: [{
      data: [],
      backgroundColor: ['#2196f3', '#ff9800', '#e91e63'], // blue, orange, pink
      hoverOffset: 20
    }]
  };

  public documentCountsChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left',
        labels: { font: { size: 14 } }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => this.getDocumentCountsTooltip(tooltipItem)
        }
      }
    }
  };


  agingChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  agingChartOptions = this.getVerticalBarChartOptions('Aging Bucket', 'Amount');

  productChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  productChartOptions = this.getHorizontalBarChartOptions('Product', 'Invoice Value');

  private financeService = inject(FinanceService);

  ngOnInit(): void {
    this.loadSalesDashboardData();
  }

  //  Initialization
  private initializeSummary(): OverAllSalesSummary {
    return {
      TotalInvoiceCount: '', TotalInvoiceAmount: '',
      TotalCreditMemoCount: '', TotalCreditMemoAmount: '',
      TotalDebitMemoCount: '', TotalDebitMemoAmount: '',
      TotalPaidAmount: '', TotalOpenAmount: '',
      TotalPayments: '', PaymentsCleared: '',
      PaymentsOverdue: '', PaymentsOpen: '', Currency: ''
    };
  }

  // Data Fetch & Setup
  private loadSalesDashboardData(): void {
    this.financeService.getOverAllSalesData().subscribe({
      next: (response) => {
        this.overAllSalesSummary = response.overAllSalesSummary;
        this.aging = response.aging;
        this.paymentDetails = response.paymentDetails;
        this.productSummary = response.productSummary;

        this.setPaymentChart();
        this.setAgingChart();
        this.setProductChart();
        this.setDocumentCountsChart();
        
        this.isLoading = false;  
      },
      error: (err) => console.error('Failed to fetch OverAll Sales Data', err)
    });
  }

  // Chart Setup Functions
  private setPaymentChart(): void {
    const { PaymentsCleared, PaymentsOpen, PaymentsOverdue } = this.overAllSalesSummary;
    this.paymentStatusChartData.datasets[0].data = [
      parseInt(PaymentsCleared || '0', 10),
      parseInt(PaymentsOpen || '0', 10),
      parseInt(PaymentsOverdue || '0', 10)
    ];
  }

  private setDocumentCountsChart(): void {
    this.documentCountsChartData.datasets[0].data = [
      parseInt(this.overAllSalesSummary.TotalInvoiceCount || '0', 10),
      parseInt(this.overAllSalesSummary.TotalCreditMemoCount || '0', 10),
      parseInt(this.overAllSalesSummary.TotalDebitMemoCount || '0', 10)
    ];
  }

  private getDocumentCountsTooltip(tooltipItem: TooltipItem<'doughnut'>): string {
    const index = tooltipItem.dataIndex;
    const dataset = tooltipItem.dataset.data as number[];
    const value = dataset[index];
    const total = dataset.reduce((a, b) => a + b, 0);
    const percentage = ((value / total) * 100).toFixed(1);
    return `${tooltipItem.label}: ${value} (${percentage}%)`;
  }  
  

  private setAgingChart(): void {
    this.agingChartData = {
      labels: ['1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
      datasets: [{
        label: 'Amount',
        data: this.aging.map(a => parseFloat(a.Amount)),
        backgroundColor: '#42a5f5',
        hoverBackgroundColor: '#1976d2'
      }]
    };
  }

  private setProductChart(): void {
    const topProducts = this.productSummary.slice(0, 10);
    this.productChartData = {
      labels: topProducts.map(p => p.MaterialDescription),
      datasets: [{
        label: 'Total Invoice Value',
        data: topProducts.map(p => parseFloat(p.TotalValue)),
        backgroundColor: topProducts.map(p => this.getColor(p.MaterialNumber)),
        hoverBackgroundColor: '#1976d2'
      }]
    };
  }
  

  // 🔹 Utility Chart Configs
  private getVerticalBarChartOptions(xLabel: string, yLabel: string): ChartOptions<'bar'> {
    return {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<'bar'>) =>
              `₹${this.aging[tooltipItem.dataIndex]?.Amount} ${this.aging[tooltipItem.dataIndex]?.Currency}`
          }
        },
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: { title: { display: true, text: xLabel } },
        y: { title: { display: true, text: yLabel } }
      }
    };
  }
  private getHorizontalBarChartOptions(xLabel: string, yLabel: string): ChartOptions<'bar'> {
    return {
      responsive: true,
  indexAxis: 'y', // Horizontal bar
  plugins: {
    tooltip: {
      callbacks: {
        label: (tooltipItem: TooltipItem<'bar'>) =>
          `₹${this.productSummary[tooltipItem.dataIndex]?.TotalValue} ${this.productSummary[tooltipItem.dataIndex]?.Currency}`
      }
    },
    legend: { display: false },
    title: { display: true, text: 'Top Products by Invoice Value' }
  },
  scales: {
    x: {
      title: { display: true, text: 'Invoice Value' },
      beginAtZero: true
    },
    y: {
      title: { display: true, text: 'Product' }
    }
  }
    };
  }

  private getDonutTooltip(tooltipItem: TooltipItem<'pie'>): string {
    const index = tooltipItem.dataIndex;
    const dataset = tooltipItem.dataset.data as number[];
    const value = dataset[index];
    const total = dataset.reduce((a, b) => a + b, 0);
    const percentage = ((value / total) * 100).toFixed(1);
    return `${tooltipItem.label}: ${value} (${percentage}%)`;
  }

  private getColor(materialNumber: string): string {
    const hash = materialNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 55%)`;
  }

  // 🔹 Payment Drilldown Interactions
  onPaymentStatusClick(event: any): void {
    const active = event.active as ActiveElement[];
    if (!active?.length) return;

    const index = active[0].index;
    this.selectedStatusLabel = String(this.paymentStatusChartData.labels?.[index] ?? '');
    
    this.filteredPaymentDetails = this.paymentDetails.filter(
      pd => pd.PaymentStatus === this.selectedStatusLabel.toUpperCase()
    );
    this.isPaymentDrilldownOpen = true;
  }

  closeDrilldown(): void {
    this.isPaymentDrilldownOpen = false;
    this.filteredPaymentDetails = [];
  }

  onPaymentDocClick(docId: string): void {
    alert(`Clicked Payment Document: ${docId}`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Cleared': return 'status-cleared';
      case 'Open': return 'status-open';
      case 'Overdue': return 'status-overdue';
      default: return '';
    }
  }
}
