import { paymentsAgingFieldNameMap } from "../../constants/fieldMappingFinance.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";

export const fetchPaymentsAgingSapService = async (kunnr, fromDate, toDate, pageNum, pageSize, isSortNewest, documentNumber, status, billingType ) => {

  const xml = buildSoapEnvelope("ZFM_FI_RK_GET_CUST_PAY_AGING", {
    IV_KUNAG: kunnr,
    IV_DATE_FROM: fromDate,
    IV_DATE_TO: toDate,
    IV_PAGE_NUM: pageNum,
    IV_PAGE_SIZE: pageSize,
    IV_SORT_NEWEST: isSortNewest,
    IV_VBELN: documentNumber,
    IV_AGING_STATUS: status,
  });

  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_PAYMENT_AGING_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_FI_RK_GET_CUST_PAY_AGINGResponse");

    if (!response) throw new Error("Missing SAP response node.");

    const rawData = response.ET_PAYMENTS_AGING?.item;

    const paymentsAgingArray = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];

    const totalRecords = response.EV_TOTAL_RECORDS || 0;
    
    const message = response.EV_MESSAGE || "";

    const paymentsAging = paymentsAgingArray.map(item =>
        renameFields(item, paymentsAgingFieldNameMap)
      );

    return {
      success: true,
      message,
      paymentsAging,
      totalRecords
    };

  } catch (error) {
    return {
      success: false,
      message: "Error occurred at Memo Service",
      paymentsAging: [],
      totalRecords: 0
    };
  }
}