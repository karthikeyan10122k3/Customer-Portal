export const kpiFieldNameMap = {
    // KPI data fields
    WF_INQUIRY_COUNT: 'InquiryCount',
    WF_INQUIRY_NET_VAL: 'InquiryNetValue',
    WF_INQUIRY_OPEN_CNT: 'InquiryOpenCount',
    WF_INQUIRY_PARTIAL_CONV: 'InquiryPartialConversion',
    WF_INQUIRY_CLOSED_CONV: 'InquiryClosedConversion',
  
    WF_SO_COUNT: 'SalesOrderCount',
    WF_SO_NET_VAL: 'SalesOrderNetValue',
    WF_SO_OPEN_CNT: 'SalesOrderOpenCount',
    WF_SO_PARTIAL_DEL: 'SalesOrderPartialDelivery',
    WF_SO_CLOSED_DEL: 'SalesOrderClosedDelivery',
  
    WF_DEL_COUNT: 'DeliveryCount',
    WF_DEL_OPEN_CNT: 'DeliveryOpenCount',
    WF_DEL_PARTIAL_BILL: 'DeliveryPartialBilling',
    WF_DEL_CLOSED_BILL: 'DeliveryClosedBilling',
  
    WF_AVG_DELIVERY_DAYS: 'AverageDeliveryDays',
    WF_OVERDUE_SO_CNT: 'OverdueSalesOrderCount',
    WF_OVERDUE_DEL_CNT: 'OverdueDeliveryCount',
  };
  
  export const topProductFieldNameMap = {
    WF_MATNR: 'MaterialNumber',
    WF_MAKTX: 'MaterialDescription',
    WF_QTY_SOLD: 'QuantitySold',
    WF_NET_VAL: 'NetValue',
  };
  
  export const trendsFieldNameMap = {
    WF_DOC_MONTH: 'DocumentMonth',
    WF_INQ_COUNT: 'InquiryCount',
    WF_SO_COUNT: 'SalesOrderCount',
    WF_DEL_COUNT: 'DeliveryCount',
  };
  
// Customr Profile
  export const customerProfileFieldNameMap = {
    // KNA1 fields
    WF_KUNNR: 'CustomerNumber',
    WF_NAME1: 'CustomerName',
    WF_SPRAS: 'Language',
    WF_ERDAT: 'CreatedOn',
    WF_ERNAM: 'CreatedBy',
  
    // ADRC fields
    WF_STREET: 'Street',
    WF_CITY1: 'City',
    WF_POST_CODE1: 'PostalCode',
    WF_COUNTRY: 'Country',
    WF_TIME_ZONE: 'TimeZone',
  
    // KNVV fields
    WF_VKORG: 'SalesOrganization',
    WF_VTWEG: 'DistributionChannel',
    WF_WAERS: 'Currency',
    WF_ZTERM: 'TermsOfPayment',
    WF_BZIRK: 'SalesDistrict',
  };
  