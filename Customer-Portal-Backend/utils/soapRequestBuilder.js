export const buildSoapEnvelope = (functionName, params = {}) => {
    const paramXML = Object.entries(params)
      .map(([key, value]) => `<${key}>${value}</${key}>`)
      .join('\n');

  
    return `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:urn="urn:sap-com:document:sap:rfc:functions">
        <soap:Header/>
        <soap:Body>
          <urn:${functionName}>
            ${paramXML}
          </urn:${functionName}>
        </soap:Body>
      </soap:Envelope>
    `;
  };
  