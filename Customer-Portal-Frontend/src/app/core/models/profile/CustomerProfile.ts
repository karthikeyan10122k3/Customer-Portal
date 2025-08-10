export interface CustomerProfile {
  CustomerNumber: string;         // KNA1-KUNNR
  CustomerName: string;           // KNA1-NAME1
  Language: string;               // KNA1-SPRAS
  CreatedOn: string;              // KNA1-ERDAT
  CreatedBy: string;              // KNA1-ERNAM
  Street: string;                 // ADRC-STREET
  City: string;                   // ADRC-CITY1
  PostalCode: string;            // ADRC-POST_CODE1
  Country: string;                // ADRC-COUNTRY
  TimeZone: string;              // ADRC-TIME_ZONE
  SalesOrganization: string;     // KNVV-VKORG
  DistributionChannel: string;   // KNVV-VTWEG
  Currency: string;              // KNVV-WAERS
  SalesDistrict: string;         // KNVV-BZIRK
}
