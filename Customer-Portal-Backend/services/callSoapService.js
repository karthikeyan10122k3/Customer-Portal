import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const SAP_AUTH = {
  username: process.env.SAP_USERNAME,
  password: process.env.SAP_PASSWORD
};

export const callSapSoapService = async (SAP_SOAP_URL, xmlBody) => {
  
  try {
    const response = await axios.post(SAP_SOAP_URL, xmlBody, {
      auth: SAP_AUTH,
      headers: { 'Content-Type': 'text/xml' },
    });
    return response.data;
  } catch (error) {
    throw {
      success: false,
      message: "Error Occured at SAP SOAP call",
    };
  }
};
