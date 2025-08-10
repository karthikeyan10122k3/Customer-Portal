export interface OverAllSalesSummary {
  TotalInvoiceCount: string;
  TotalInvoiceAmount: string;
  TotalCreditMemoCount: string;
  TotalCreditMemoAmount: string;
  TotalDebitMemoCount: string;
  TotalDebitMemoAmount: string;
  TotalPaidAmount: string;
  TotalOpenAmount: string;
  TotalPayments: string;
  PaymentsCleared: string;
  PaymentsOverdue: string;
  PaymentsOpen: string;
  Currency: string;
}
  
export interface AgingAnalysis {
  AgingBucketName: string;
  Amount: string;
  Currency: string;
}

export interface PaymentDetail {
  PaymentDocumentNumber: string;
  PaymentStatus: string;
  Amount: string;
  DueDate: string;
  ClearDate: string;
  Currency: string;
}

export interface ProductSummary {
  MaterialNumber: string;
  MaterialDescription: string;
  InvoiceCount: string;
  TotalValue: string;
  Currency: string;
}
