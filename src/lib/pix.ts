function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload(
  pixKey: string,
  amount: number,
  merchantName: string = "Bolao",
  merchantCity: string = "Brasil"
): string {
  const payloadFormat = "000201";
  const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, '0')}${pixKey}`;
  const merchantAccountInfoLength = merchantAccountInfo.length.toString().padStart(2, '0');
  const merchantCategoryCode = "52040000";
  const transactionCurrency = "5303986";
  const transactionAmount = amount.toFixed(2);
  const transactionAmountLength = transactionAmount.length.toString().padStart(2, '0');
  const countryCode = "5802BR";
  
  const mName = merchantName.substring(0, 25).toUpperCase();
  const merchantNameLength = mName.length.toString().padStart(2, '0');
  
  const mCity = merchantCity.substring(0, 15).toUpperCase();
  const merchantCityLength = mCity.length.toString().padStart(2, '0');
  
  const additionalData = "0503***"; // TXID
  const additionalDataLength = additionalData.length.toString().padStart(2, '0');

  const payload = [
    payloadFormat,
    `26${merchantAccountInfoLength}${merchantAccountInfo}`,
    merchantCategoryCode,
    transactionCurrency,
    `54${transactionAmountLength}${transactionAmount}`,
    countryCode,
    `59${merchantNameLength}${mName}`,
    `60${merchantCityLength}${mCity}`,
    `62${additionalDataLength}${additionalData}`,
    "6304"
  ].join('');

  return payload + crc16(payload);
}
