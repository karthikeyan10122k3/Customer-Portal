export interface PaymentsAging {
  BillingDocumentNumber: string;
  BillingType: string;
  BillingDate: string; // ISO date string e.g., '2025-04-10'
  CustomerNumber: string;
  Currency: string;
  NetAmount: number;
  PaymentTermCode: string;
  PaymentTermDescription: string;
  ReferenceDocument: string;
  DueDate: string; // ISO date string e.g., '2025-07-14'
  AgingDays: number;
  AgingBucket: string;
  AgingStatus: string;
  ClearingDate: string | null; // Nullable date
  ClearedFlag: boolean;
  SalesOrderNumber: string;
}