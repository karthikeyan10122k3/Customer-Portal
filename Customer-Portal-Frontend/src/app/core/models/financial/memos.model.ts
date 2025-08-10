// memo.model.ts

export interface MemoItem {
  BillingDocumentNumber: string;
  ItemNumber: string;
  MaterialNumber: string;
  MaterialDescription: string;
  BilledQuantity: string;
  SalesUnit: string;
  ItemNetValue: string;
  ItemCategory: string;
  SalesOrderNumber: string;
  SalesOrderItemNumber: string;
  TaxCode: string;
  EnteredMaterial: string;
  BaseUOM: string;
}

export interface Memo {
  BillingDocumentNumber: string;
  BillingDate: string;
  CustomerNumber: string;
  Currency: string;//
  NetValue: string;//
  MemoType: string;
  SalesOrganization: string;
  DistributionChannel: string;
  Division: string;
  CancellationIndicator: string;
  MemoStatus: string;//
  SalesOrganizationText: string;//
  DistributionChannelText: string;//
  DivisionText: string;
  MemoTypeText: string;
  Items: MemoItem[];
}
