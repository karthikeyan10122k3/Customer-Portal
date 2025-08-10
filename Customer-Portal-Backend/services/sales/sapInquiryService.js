import { inquiryFieldNameMap } from "../../constants/fieldMappingSales.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";

// Mapping Each Inquiries Headers to its respective Inquiries Items while Renaming each Fields
function transformInquiryData(ET_INQUIRY_HEADERS, ET_INQUIRY_ITEMS) {
  return ET_INQUIRY_HEADERS.map(header => {
    const Items = ET_INQUIRY_ITEMS
      .filter(item => item.WF_VBELN === header.WF_VBELN)
      .map(item => renameFields(item, inquiryFieldNameMap));

    return {
      ...renameFields(header, inquiryFieldNameMap),
      Items,
    };
  })
}

// Fetching Inquiries
export const fetchInquiriesSapService = async (kunnr, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status ) => {

  const xml = buildSoapEnvelope("ZFM_SD_RK_GET_CUST_INQUIRY", {
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
    const rawResponse = await callSapSoapService(process.env.SAP_GET_INQUIRES_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_SD_RK_GET_CUST_INQUIRYResponse");
    // console.log(response);

    if (!response) throw new Error("Missing SAP response node.");

    const rawHeaders = response.ET_INQUIRY_HEADERS?.item;
    const rawItems = response.ET_INQUIRY_ITEMS?.item;

    const ET_HEADERS = Array.isArray(rawHeaders) ? rawHeaders : rawHeaders ? [rawHeaders] : [];
    const ET_ITEMS = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const totalRecords = response.EV_TOTAL_RECORDS || 0;
    
    const message = response.EV_MESSAGE || "";

    const inquiries = transformInquiryData(ET_HEADERS, ET_ITEMS);

    return {
      success: true,
      message,
      inquiries,
      totalRecords
    };

  } catch (error) {
    return {
      success: false,
      message: "Error occurred at Inquiry Service",
      inquiries: [],
      totalRecords: 0
    };
  }
};