import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from "../callSoapService.js";


export const fetchInvoicePDFSapService = async (kunag, documentNumber) => {

  const xml = buildSoapEnvelope("ZFM_FI_RK_CUST_INVOICE_PDF", {
    IV_KUNAG: kunag,
    IV_VBELN: documentNumber,
  });


  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_INVOICE_PDF_URL,xml);

    const parsed = await parseXML(rawResponse);
    
    
    const response = extractResponse(parsed, "n0:ZFM_FI_RK_CUST_INVOICE_PDFResponse");

    if (!response) throw new Error("Missing SAP response node.");

    const pdfBase64  = response.EV_PDF;
    const message  = response.EV_MESSAGE;

    
    return {
      success: true,
      pdfBase64,
      message
    };

  } catch (error) {
    return {
      success: false,
      message,
    };
  }
};