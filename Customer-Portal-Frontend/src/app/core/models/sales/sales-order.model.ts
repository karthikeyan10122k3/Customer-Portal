// export interface SalesOrderItem {
//   SalesOrderNumber: string;     // VBAP-VBELN
//   ItemNumber: string;           // VBAP-POSNR
//   MaterialNumber: string;       // VBAP-MATNR
//   Description: string;          // VBAP-ARKTX
//   Quantity: string;             // VBAP-KWMENG
//   Unit: string;                 // VBAP-VRKME
//   ItemCategory: string;         // VBAP-PSTYV
//   NetValue: string;             // VBAP-NETWR
//   Currency: string;             // VBAP-WAERK
// }

// export interface SalesOrder {
//   SalesOrderNumber: string;         // VBAK-VBELN
//   RecordCreationDate: string;       // VBAK-ERDAT
//   DocumentCategory: string;         // VBAK-VBTYP
//   SalesOrderType: string;           // VBAK-AUART
//   CustomerNumber: string;           // VBAK-KUNNR
//   CustomerPONumber: string;         // VBAK-BSTNK
//   DocumentDate: string;             // VBAK-AUDAT
//   SalesOrganization: string;        // VBAK-VKORG
//   CreatedBy: string;                // VBAK-ERNAM
//   RequestedDeliveryDate: string;    // VBAK-VDATU
//   BillingStatus: string;            // VBAK-FKSTK
//   Currency: string;                 // VBAK-WAERK
//   NetValue: string;                 // VBAK-NETWR
//   items: SalesOrderItem[];
// }

export interface SalesOrderItem {
  SalesOrderNumber: string;
  ItemNumber: string;
  MaterialNumber: string;
  Description: string;
  Quantity: number;
  Unit: string;
  ItemCategory: string;
  ItemUnitValue: number;
  NetValue: number;
  ItemCurrency: string;
  IsDelivered: string;
  DeliveryNumber?: string;
  DeliveryItemNumber?: string;
}

export interface SalesOrder {
  SalesOrderNumber: string;
  RecordCreationDate: string;
  DocumentDate: string;
  CreatedBy: string;
  CustomerNumber: string;
  SalesOrganization: string;
  DistributionChannel: string;
  Division: string;
  SalesOffice: string;
  SalesGroup: string;
  CustomerPONumber: string;
  Currency: string;
  SalesOrderType: string;
  DocumentCategory: string;
  RequestedDeliveryDate: string;
  NetValue: number;
  BillingStatus: string;

  DistributionChannelText: string;
  DivisionText: string;
  SalesOfficeText: string;
  SalesGroupText: string;
  SalesOrganizationText: string;

  TotalItems: number;
  TotalNetValue: number;
  DeliveredItems: number;
  DeliveryStatus: string;
  IsFullyDelivered: string;   
  IsPartiallyDelivered: string;

  Items: SalesOrderItem[];
}
