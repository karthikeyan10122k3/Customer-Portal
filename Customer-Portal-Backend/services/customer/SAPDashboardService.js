
import { callSapSoapService } from '../callSoapService.js';
import { buildSoapEnvelope } from '../../utils/soapRequestBuilder.js';
import { parseXML } from '../../utils/xmlParser.js';
import { extractResponse } from '../../utils/xmlHelpers.js';
import { renameFields } from '../../utils/fieldNameMapper.js';
import { kpiFieldNameMap, topProductFieldNameMap, trendsFieldNameMap } from '../../constants/fieldMappingCustomer.js';

// Fetching Inquiries
export const fetchDashboardSapService = async (kunnr, fromDate, toDate ) => {

  const xml = buildSoapEnvelope("ZFM_SD_RK_GET_CUST_DASHBOARD", {
    IV_KUNNR: kunnr,
    IV_DATE_FROM: fromDate,
    IV_DATE_TO: toDate
  });



  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_DASHBOARD_URL,xml);

    const parsed = await parseXML(rawResponse);
    const response = extractResponse(parsed, "n0:ZFM_SD_RK_GET_CUST_DASHBOARDResponse");

    if (!response) throw new Error("Missing SAP response node.");

    const rawKPIs = response.ES_KPI_DATA;
    const rawTopProduct = response.ET_TOP_PROD?.item;
    const rawTrends = response.ET_TRENDS?.item;

    const ET_KPI = Array.isArray(rawKPIs) ? rawKPIs : rawKPIs ? [rawKPIs] : [];
    const ET_TOP_PRODUCTS = Array.isArray(rawTopProduct) ? rawTopProduct : rawTopProduct ? [rawTopProduct] : [];
    const ET_TRENDS = Array.isArray(rawTrends) ? rawTrends : rawTrends ? [rawTrends] : [];
    
    const message = response.EV_MESSAGE || "";

    const kpis = ET_KPI.map(item =>
        renameFields(item, kpiFieldNameMap)
      );

    const topProducts = ET_TOP_PRODUCTS.map(item =>
        renameFields(item, topProductFieldNameMap)
      );

    const trends = ET_TRENDS.map(item =>
        renameFields(item, trendsFieldNameMap)
      );

    return {
      success: true,
      message,
      kpis,
      topProducts,
      trends
    };

  } catch (error) {
    return {
      success: false,
      message: "Error occurred at Dashboard Service",
      kpis: [],
      topProducts: [],
      trends: []
    };
  }
};