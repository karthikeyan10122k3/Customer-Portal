import { salesOrderFieldNameMap } from "../../constants/fieldMappingSales.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";


// Fetching Sales Orders
export const fetchSalesOrderSapService = async (kunnr, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status ) => {

  const xml = buildSoapEnvelope("ZFM_SD_RK_GET_CUST_ORDER", {
    IV_KUNNR: kunnr,
    IV_DATE_FROM: fromDate,
    IV_DATE_TO: toDate,
    IV_PAGE_NUM: pageNum,
    IV_PAGE_SIZE: pageSize,
    IV_SORT_NEWEST: isSortNewest,
    IV_VBELN: documentNumber,
    IV_STATUS: status,
  });
  
  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_ORDERS_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_SD_RK_GET_CUST_ORDERResponse");

    if (!response) throw new Error("Missing SAP response node.");
    
    
    const rawHeaders = response.ET_SALESORDER_HEADERS?.item;
    const rawItems = response.ET_SALESORDER_ITEMS?.item;

    const ET_HEADERS = Array.isArray(rawHeaders) ? rawHeaders : rawHeaders ? [rawHeaders] : [];
    const ET_ITEMS = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    
    const message = response.EV_MESSAGE || "";
    const totalRecords = response.EV_TOTAL_RECORDS || 0;

    const salesOrders = transformSalesOrders(ET_HEADERS, ET_ITEMS);

    return {
      success: true,
      message,
      salesOrders,
      totalRecords
    };

  } catch (error) {
    console.error("Sales Order fetch failed:", error.message);
    return {
      success: false,
      message: "Error occurred at Sales Order Service",
      salesOrders: [],
      totalRecords: 0
    };
  }
};

// Mapping Each Sales Order Headers to its respective Sales Order Items while Renaming each Fields
function transformSalesOrders(headers, items) {
  return headers.map(header => {
    const Items = items
      .filter(item => item.WF_VBELN === header.WF_VBELN)
      .map(item => renameFields(item, salesOrderFieldNameMap));

    return {
      ...renameFields(header, salesOrderFieldNameMap),
      Items
    };
  });
}
