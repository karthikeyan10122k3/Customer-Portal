
import { buildSoapEnvelope } from "../../utils/soapRequestBuilder.js";
import { extractResponse } from "../../utils/xmlHelpers.js";
import { parseXML } from "../../utils/xmlParser.js";
import { callSapSoapService } from '../callSoapService.js';



export const fetchCustomerProfileSapService = async (kunnr) => {
  const xml = buildSoapEnvelope("ZFM_SD_RK_GET_CUSTPROFILE", {
    IV_KUNNR: kunnr
  });

  try {
    const rawResponse = await callSapSoapService(process.env.SAP_GET_PROFILE_URL , xml);
    const parsed = await parseXML(rawResponse);
    
    const response = extractResponse(parsed, "n0:ZFM_SD_RK_GET_CUSTPROFILEResponse");

    if (!response) throw new Error('Missing SAP response node.');

    const EV_PROFILE = response.EV_CUSTOMER_PROFILE;

    const profile = mapCustomerProfile(EV_PROFILE)
      

    return {
      success: true,
      profile: profile,
      message: response.EV_MESSAGE,
    };
  } catch (error) {
    throw {
      success: false,
      profile: null,
      message: "Error Occured at Profile Service",
    };
  }
};


  function mapCustomerProfile(data) {
    return {
      CustomerNumber: data.WF_KUNNR,         // KNA1-KUNNR
      CustomerName: data.WF_NAME1,           // KNA1-NAME1
      Language: data.WF_SPRAS,               // KNA1-SPRAS
      CreatedOn: data.WF_ERDAT,              // KNA1-ERDAT
      CreatedBy: data.WF_ERNAM,              // KNA1-ERNAM
      Street: data.WF_STREET,                // ADRC-STREET
      City: data.WF_CITY1,                   // ADRC-CITY1
      PostalCode: data.WF_POST_CODE1,        // ADRC-POST_CODE1 
      Country: data.WF_COUNTRY,              // ADRC-COUNTRY
      TimeZone: data.WF_TIME_ZONE,           // ADRC-TIME_ZONE
      SalesOrganization: data.WF_VKORG,      // KNVV-VKORG
      DistributionChannel: data.WF_VTWEG,    // KNVV-VTWEG
      Currency: data.WF_WAERS,               // KNVV-WAERS
      TermsOfPayment: data.WF_ZTERM,         // KNVV-ZTERM
      SalesDistrict: data.WF_BZIRK,          // KNVV-BZIRK
    };
  }
  
