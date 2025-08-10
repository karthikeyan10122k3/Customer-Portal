export interface DashboardKPIData {
    InquiryCount: string;
    InquiryNetValue: string;
    InquiryOpenCount: string;
    InquiryPartialConversion: string;
    InquiryClosedConversion: string;
    SalesOrderCount: string;
    SalesOrderNetValue: string;
    SalesOrderOpenCount: string;
    SalesOrderPartialDelivery: string;
    SalesOrderClosedDelivery: string;
    DeliveryCount: string;
    DeliveryOpenCount: string;
    DeliveryPartialBilling: string;
    DeliveryClosedBilling: string;
    AverageDeliveryDays: string;
    OverdueSalesOrderCount: string;
    OverdueDeliveryCount: string;
  }
  
  export interface DashboardTopProduct {
    MaterialNumber: string;
    MaterialDescription: string;
    QuantitySold: string;
    NetValue: string;
  }
  
  export interface DashboardTrend {
    DocumentMonth: string;
    InquiryCount: string;
    SalesOrderCount: string;
    DeliveryCount: string;
  }
  

  