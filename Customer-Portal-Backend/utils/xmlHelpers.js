export const extractResponse = (parsed, responseTag) => {
    return parsed?.["soap-env:Envelope"]?.["soap-env:Body"]?.[responseTag];
  }
  