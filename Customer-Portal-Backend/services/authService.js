import { callSapSoapService } from "./callSoapService.js";
import { parseXML } from '../utils/xmlParser.js';
import { buildSoapEnvelope } from "../utils/soapRequestBuilder.js";
import { extractResponse } from "../utils/xmlHelpers.js";

  export const authenticateCustomerSapService = async (customerId, password) => {

    const xml = buildSoapEnvelope("ZFM_SD_RK_CUSTLOGINVALIDATE", {
      IV_KUNNR: customerId,
      IV_PASSWORD: password
  });

      try {
        const rawResponse = await callSapSoapService(process.env.SAP_GET_AUTH_URL , xml);
        const parsed = await parseXML(rawResponse)
        const response = extractResponse(parsed, "n0:ZFM_SD_RK_CUSTLOGINVALIDATEResponse");
        if (!response) throw new Error('Missing SAP response node.');
    
        return {
          success: true,
          loginSuccess:  response.EV_LOGINSUCCESS,
          customerId: customerId,
          name: response.EV_CUSTOMER_NAME,
          message: response.EV_MESSAGE,
        };
      } catch (error) {
        throw {
          success: false,
          customerId: null,
          name: null,
          message: "Error Occured at Auth Service",
        };
      }
  };