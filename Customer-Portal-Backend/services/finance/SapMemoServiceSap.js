import { memoFieldNameMap } from "../../constants/fieldMappingFinance.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";



// Fetching Memos
export const fetchMemosSapService = async (kunnr, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status, billingType ) => {

  const xml = buildSoapEnvelope("ZFM_FI_RK_GET_CUST_MEMO", {
    IV_KUNAG: kunnr,
    IV_DATE_FROM: fromDate,
    IV_DATE_TO: toDate,
    IV_PAGE_NUM: pageNum,
    IV_PAGE_SIZE: pageSize,
    IV_SORT_NEWEST: isSortNewest,
    IV_VBELN: documentNumber,
    IV_STATUS: status,
    IV_BILLING_TYPE: billingType,
  });
  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_MEMO_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_FI_RK_GET_CUST_MEMOResponse");

    if (!response) throw new Error("Missing SAP response node.");

    const rawHeaders = response.ET_MEMO_HEADERS?.item;
    const rawItems = response.ET_MEMO_ITEMS?.item;

    const ET_HEADERS = Array.isArray(rawHeaders) ? rawHeaders : rawHeaders ? [rawHeaders] : [];
    const ET_ITEMS = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const totalRecords = response.EV_TOTAL_RECORDS || 0;
    
    const message = response.EV_MESSAGE || "";

    const memos = transformMemoData(ET_HEADERS, ET_ITEMS);
    

    return {
      success: true,
      message,
      memos,
      totalRecords
    };

  } catch (error) {
    return {
      success: false,
      message: "Error occurred at Memo Service",
      memos: [],
      totalRecords: 0
    };
  }
};


// Mapping Each Memo Headers to its respective Inquiries Items while Renaming each Fields
function transformMemoData(ET_MEMO_HEADERS, ET_MEMO_ITEMS) {
  return ET_MEMO_HEADERS.map(header => {
    const Items = ET_MEMO_ITEMS
      .filter(item => item.WF_VBELN === header.WF_VBELN)
      .map(item => renameFields(item, memoFieldNameMap));

    return {
      ...renameFields(header, memoFieldNameMap),
      Items,
    };
  })
}