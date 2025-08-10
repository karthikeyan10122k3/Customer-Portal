

export interface InvoiceItem {
    BillingDocumentNumber: string;
    ItemNumber: string;
    MaterialNumber: string;
    ItemDescription: string;
    BilledQuantity: string;       // Could be number if you want to parse later
    SalesUnit: string;
    ItemNetValue: string;         // Could be number if parsed
    ItemCurrency: string;
    SalesOrderNumber: string;
    SalesOrderItem: string;
    ItemTaxAmount: string;        // Could be number if parsed
    ItemCategory: string;
  }
  
  export interface Invoice {
    BillingDocumentNumber: string;
    BillingDate: string;          // ISO date string, parse to Date if needed
    AccountingStatus: string;
    CompanyCode: string;
    SalesOrganization: string;
    DistributionChannel: string;
    Division: string;
    BillingType: string;
    ItemCurrency: string;
    ItemNetValue: string;         // Could be number
    ItemTaxAmount: string;        // Could be number
    TotalItemCount: string;       // Could be number
    DocumentCategory: string;
    CancellationFlag: string;
    AccountingStatusText: string;
    SalesOrganizationText: string;
    DistributionChannelText: string;
    DivisionText: string;
    BillingTypeText: string;
    Items: InvoiceItem[];
  }
  