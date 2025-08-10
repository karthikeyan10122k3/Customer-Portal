
import { agingFieldNameMap, payDetailsFieldNameMap, productSummaryFieldNameMap, summaryFieldNameMap } from "../../constants/fieldMappingFinance.js";
import { renameFields } from "../../utils/fieldNameMapper.js";
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";


export const fetchOverAllSalesSapService = async (kunag) => {

  const xml = buildSoapEnvelope("ZFM_FI_RK_GET_CUST_OVERALLSALE", {
    IV_KUNAG: kunag,
  });

  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_OVERALLSALES_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_FI_RK_GET_CUST_OVERALLSALEResponse");

    if (!response) throw new Error("Missing SAP response node.");

    const RawSummary = response.ES_SUMMARY;
    const rawAging = response.ET_AGING?.item;
    const rawPaymentsDetails = response.ET_PAY_DETAILS?.item;
    const rawProductSum = response.ET_PRODUCT_SUM?.item;

    const ES_SUMMARY = Array.isArray(RawSummary) ? RawSummary : RawSummary ? [RawSummary] : [];
    const ET_AGING = Array.isArray(rawAging) ? rawAging : rawAging ? [rawAging] : [];
    const ET_PAY_DETAILS = Array.isArray(rawPaymentsDetails) ? rawPaymentsDetails : rawPaymentsDetails ? [rawPaymentsDetails] : [];
    const ET_PRODUCT_SUM = Array.isArray(rawProductSum) ? rawProductSum : rawProductSum ? [rawProductSum] : [];
    
    const message = response.EV_MESSAGE || "";

    const summary = ES_SUMMARY.map(item =>
        renameFields(item, summaryFieldNameMap)
        );


        const summaryObject = summary.length>0 ? summary[0] : {};

    const aging = ET_AGING.map(item =>
        renameFields(item, agingFieldNameMap)
        );

    const paymentDetails = ET_PAY_DETAILS.map(item =>
        renameFields(item, payDetailsFieldNameMap)
        );
    const productSummary = ET_PRODUCT_SUM.map(item =>
        renameFields(item, productSummaryFieldNameMap)
        );

    return {
      success: true,
      message,
      summaryObject,
      aging,
      paymentDetails,
      productSummary
    };

  } catch (error) {
    return {
      success: false,
      message: "Error occurred at OverAll Sales Service",
      summary: [],
      aging: [],
      paymentDetails: [],
      productSummary: []
    };
  }
};

