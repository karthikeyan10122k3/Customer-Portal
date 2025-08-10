import { parseStringPromise } from 'xml2js';

export const parseXML = async (xml) => {
  try {
    return await parseStringPromise(xml, { explicitArray: false });
  } catch (error) {
    throw {
        success: false,
        message: "Error Occured at XML Parsing",
      };
  }
};
