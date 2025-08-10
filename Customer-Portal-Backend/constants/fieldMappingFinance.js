// Memo field readable map
export const memoFieldNameMap = {
    // Header level fields
    WF_VBELN: 'BillingDocumentNumber',
    WF_FKDAT: 'BillingDate',
    WF_KUNAG: 'CustomerNumber',
    WF_WAERK: 'Currency',
    WF_NETWR: 'NetValue',
    WF_FKART: 'MemoType',
    WF_VKORG: 'SalesOrganization',
    WF_VTWEG: 'DistributionChannel',
    WF_SPART: 'Division',
    WF_FKSTO: 'CancellationIndicator',
    WF_STATUS: 'MemoStatus',
  
    // Header text descriptions
    WF_VKORG_TXT: 'SalesOrganizationText',
    WF_VTWEG_TXT: 'DistributionChannelText',
    WF_SPART_TXT: 'DivisionText',
    WF_FKART_TXT: 'MemoTypeText',
  
    // Item level fields
    WF_POSNR: 'ItemNumber',
    WF_MATNR: 'MaterialNumber',
    WF_ARKTX: 'MaterialDescription',
    WF_FKIMG: 'BilledQuantity',
    WF_VRKME: 'SalesUnit',
    WF_ITEM_NETWR: 'ItemNetValue',
    WF_PSTYV: 'ItemCategory',
    WF_VGBEL: 'SalesOrderNumber',
    WF_VGPOS: 'SalesOrderItemNumber',
    WF_MWSKZ: 'TaxCode',
    WF_MATWA: 'EnteredMaterial',
    WF_MEINS: 'BaseUOM'
  };
  
  export const paymentsAgingFieldNameMap = {
    WF_VBELN: 'BillingDocumentNumber',
    WF_FKART: 'BillingType',
    WF_FKDAT: 'BillingDate',
    WF_KUNAG: 'CustomerNumber',
    WF_WAERK: 'Currency',
    WF_NETWR: 'NetAmount',
    WF_ZTERM: 'PaymentTermCode',
    WF_ZTERM_TXT: 'PaymentTermDescription',
    WF_XBLNR: 'ReferenceDocument',
    WF_DUE_DATE: 'DueDate',
    WF_AGING_DAYS: 'AgingDays',
    WF_AGING_BUCKET: 'AgingBucket',
    WF_AGING_STATUS: 'AgingStatus',
    WF_CLEARING_DATE: 'ClearingDate',
    WG_CLEARED: 'ClearedFlag',
    WF_VBELN_SO: 'SalesOrderNumber'
  };

  // Ivoice Field Mapping
  export const invoiceFieldNameMap = {
    // Header level fields
    WF_VBELN: 'BillingDocumentNumber',
    WF_FKDAT: 'BillingDate',
    WF_RFBSK: 'AccountingStatus',
    WF_BUKRS: 'CompanyCode',
    WF_VKORG: 'SalesOrganization',
    WF_VTWEG: 'DistributionChannel',
    WF_SPART: 'Division',
    WF_FKART: 'BillingType',
    WF_WAERK: 'Currency',
    WF_NETWR: 'TotalNetValue',
    WF_MWSBP: 'TotalTaxAmount',
    WF_TOTAL_ITEMS: 'TotalItemCount',
    WF_VBTYP: 'DocumentCategory',
    WF_FKSTO: 'CancellationFlag',
  
    // Header text descriptions
    WF_RFBSK_TXT: 'AccountingStatusText',
    WF_VKORG_TXT: 'SalesOrganizationText',
    WF_VTWEG_TXT: 'DistributionChannelText',
    WF_SPART_TXT: 'DivisionText',
    WF_FKART_TXT: 'BillingTypeText',
  
    // Item level fields
    WF_POSNR: 'ItemNumber',
    WF_MATNR: 'MaterialNumber',
    WF_ARKTX: 'ItemDescription',
    WF_FKIMG: 'BilledQuantity',
    WF_VRKME: 'SalesUnit',
    WF_NETWR: 'ItemNetValue',
    WF_WAERK: 'ItemCurrency',
    WF_VBELN_SO: 'SalesOrderNumber',
    WF_POSNR_SO: 'SalesOrderItem',
    WF_MWSBP: 'ItemTaxAmount',
    WF_PSTYV: 'ItemCategory'
  };
  

  // OverAll Sales

  // Customer Dashboard Summary field readable map
export const summaryFieldNameMap = {
  WF_TOTAL_INV_COUNT: 'TotalInvoiceCount',
  WF_TOTAL_INV_AMOUNT: 'TotalInvoiceAmount',
  WF_TOTAL_CR_MEMO_COUNT: 'TotalCreditMemoCount',
  WF_TOTAL_CR_MEMO_AMT: 'TotalCreditMemoAmount',
  WF_TOTAL_DB_MEMO_COUNT: 'TotalDebitMemoCount',
  WF_TOTAL_DB_MEMO_AMT: 'TotalDebitMemoAmount',
  WF_TOTAL_PAID_AMOUNT: 'TotalPaidAmount',
  WF_TOTAL_OPEN_AMOUNT: 'TotalOpenAmount',
  WF_TOTAL_PAYMENTS: 'TotalPayments',
  WF_PAYMENTS_CLEARED: 'PaymentsCleared',
  WF_PAYMENTS_OVERDUE: 'PaymentsOverdue',
  WF_PAYMENTS_OPEN: 'PaymentsOpen',
  WF_CURRENCY: 'Currency',
};

// Aging bucket field readable map
export const agingFieldNameMap = {
  WF_BUCKET_NAME: 'AgingBucketName',
  WF_AMOUNT: 'Amount',
  WF_CURRENCY: 'Currency',
};

// Payment Details field readable map
export const payDetailsFieldNameMap = {
  WF_PAYMENT_DOC: 'PaymentDocumentNumber',
  WF_STATUS: 'PaymentStatus',
  WF_AMOUNT: 'Amount',
  WF_DUE_DATE: 'DueDate',
  WF_CLEAR_DATE: 'ClearDate',
  WF_CURRENCY: 'Currency',
};

// Product Summary field readable map
export const productSummaryFieldNameMap = {
  WF_MATNR: 'MaterialNumber',
  WF_MAT_DESC: 'MaterialDescription',
  WF_INVOICE_COUNT: 'InvoiceCount',
  WF_TOTAL_VALUE: 'TotalValue',
  WF_CURRENCY: 'Currency',
};
