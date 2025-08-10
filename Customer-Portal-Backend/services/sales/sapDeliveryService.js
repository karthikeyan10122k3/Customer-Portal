import { deliveryFieldNameMap } from "../../constants/fieldMappingSales.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";

// Fetching Deliveres
export const fetchDeliveriesSapService = async (kunag, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status ) => {
  
  const xml = buildSoapEnvelope("ZFM_SD_RK_GET_CUST_DELIVERY", {
    IV_KUNAG: kunag,
    IV_DATE_FROM: fromDate,
    IV_DATE_TO: toDate,
    IV_PAGE_NUM: pageNum,
    IV_PAGE_SIZE: pageSize,
    IV_SORT_NEWEST: isSortNewest,
    IV_VBELN: documentNumber,
    IV_STATUS: status,
  });
  
    try {
      const rawResponse = await callSapSoapService(process.env.SAP_GET_DELIVERIES_URL, xml );
  
      const parsed = await parseXML(rawResponse);
      const response = extractResponse(parsed, "n0:ZFM_SD_RK_GET_CUST_DELIVERYResponse");
      
      if (!response) throw new Error("Missing SAP response node.");
      

      const rawHeaders = response.ET_DELIVERY_HEADERS?.item;
      const rawItems = response.ET_DELIVERY_ITEMS?.item;
  
      const ET_HEADERS = Array.isArray(rawHeaders) ? rawHeaders : rawHeaders ? [rawHeaders] : [];
      const ET_ITEMS = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
      const totalRecords = response.EV_TOTAL_RECORDS || 0;

      const message = response.EV_MESSAGE || "";
      
      const deliveries = transformDeliveries(ET_HEADERS, ET_ITEMS);
      
      return {
        success: true,
        message,
        deliveries,
        totalRecords
      };
  
    } catch (error) {
      console.error("Delivery fetch failed:", error.message);
      return {
        success: false,
        message: "Error occurred at Delivery Service",
        deliveries: [],
        totalRecords: 0
      };
    }
  };

// Mapping Each Delivery Headers to its respective Delivery Items while Renaming each Fields
function transformDeliveries(headers = [], items = []) {
    return headers.map(header => {
        const relatedItems = items
        .filter(item => item.WF_VBELN === header.WF_VBELN)
        .map(item => renameFields(item, deliveryFieldNameMap));
    
        return {
        ...renameFields(header, deliveryFieldNameMap),
        items: relatedItems
        };
    });
    }
    