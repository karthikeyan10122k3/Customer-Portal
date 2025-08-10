import { invoiceFieldNameMap, memoFieldNameMap } from "../../constants/fieldMappingFinance.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";



// Fetching Invoice
export const fetchInvoiceSapService = async (kunnr, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status) => {

  const xml = buildSoapEnvelope("ZFM_FI_RK_GET_CUST_INVOICE", {
    IV_KUNAG: kunnr,
    IV_DATE_FROM: fromDate,
    IV_DATE_TO: toDate,
    IV_PAGE_NUM: pageNum,
    IV_PAGE_SIZE: pageSize,
    IV_SORT_NEWEST: isSortNewest,
    IV_VBELN: documentNumber,
    IV_STATUS: status,
  });

  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_INVOICE_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_FI_RK_GET_CUST_INVOICEResponse");

    if (!response) throw new Error("Missing SAP response node.");

    const rawHeaders = response.ET_INVOICE_HEADERS?.item;
    const rawItems = response.ET_INVOICE_ITEMS?.item;

    const ET_HEADERS = Array.isArray(rawHeaders) ? rawHeaders : rawHeaders ? [rawHeaders] : [];
    const ET_ITEMS = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const totalRecords = response.EV_TOTAL_RECORDS || 0;
    
    const message = response.EV_MESSAGE || "";

    const invoice = transformInvoiceData(ET_HEADERS, ET_ITEMS);

    return {
      success: true,
      message,
      invoice,
      totalRecords
    };

  } catch (error) {
    return {
      success: false,
      message: "Error occurred at Invoice Service",
      invoice: [],
      totalRecords: 0
    };
  }
};


// Mapping Each Invoice Headers to its respective Invoice Items while Renaming each Fields
function transformInvoiceData(ET_INVOICE_HEADERS, ET_INVOICE_ITEMS) {
  return ET_INVOICE_HEADERS.map(header => {
    const Items = ET_INVOICE_ITEMS
      .filter(item => item.WF_VBELN === header.WF_VBELN)
      .map(item => renameFields(item, invoiceFieldNameMap));

    return {
      ...renameFields(header, invoiceFieldNameMap),
      Items,
    };
  })
}