export interface InquiryItem {
  InquiryNumber: string;          // from WF_VBELN
  ItemNumber: string;             // from WF_POSNR
  MaterialNumber: string;         // from WF_MATNR
  Description: string;            // from WF_ARKTX
  Quantity: number;               // from WF_KWMENG
  SalesUnit: string;              // from WF_VRKME
  NetPrice: number;               // from WF_NETPR
  NetValue: number;               // from WF_NETWR
  Currency: string;               // from WF_WAERK
  IsOrderedFlag: string;          // from WF_IS_ORDERED ('X' or '')
  SalesOrderNumber?: string;      // from WF_VBELN_SO
  SalesOrderItemNumber?: string;  // from WF_POSNR_SO
}

export interface Inquiry {
  // Header main info
  InquiryNumber: string;          // WF_VBELN
  RecordCreationDate: string;     // WF_ERDAT
  DocumentDate: string;           // WF_AUDAT
  CreatedBy: string;              // WF_ERNAM
  CustomerNumber: string;         // WF_KUNNR
  SalesOrganization: string;      // WF_VKORG
  CustomerPONumber: string;       // WF_BSTNK
  ValidFrom: string;              // WF_ANGDT
  ValidTo: string;                // WF_BNDDT
  Currency: string;               // WF_WAERK

  // Organization structure
  DistributionChannel: string;    // WF_VTWEG
  Division: string;               // WF_SPART
  SalesOffice: string;            // WF_VKBUR
  SalesGroup: string;             // WF_VKGRP
  InquiryType: string;            // WF_AUART
  OrderReason: string;            // WF_AUGRU

  // Textual descriptions
  SalesOrganizationText: string;
  DistributionChannelText: string;  // WF_VTWEG_TXT
  DivisionText: string;             // WF_SPART_TXT
  SalesOfficeText: string;          // WF_VKBUR_TXT
  SalesGroupText: string;           // WF_VKGRP_TXT

  // Status and summary
  FullyOrderedFlag: string;         // WF_FULLY_ORDERED
  PartiallyOrderedFlag: string;     // WF_PARTIALLY_ORDERED
  Status: string;                   // WF_STATUS_TEXT
  TotalItems: number;               // WF_TOTAL_ITEMS
  TotalNetValue: number;            // WF_TOTAL_NETWR
  TotalOrderedItems: number;        // WF_TOTAL_ORDERED_ITEMS

  // Nested items
  Items: InquiryItem[];
}
