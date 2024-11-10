// Extraer el nombre del remitente
const extractSenderName = (parsedEmail) => {
  const senderInfo = parsedEmail.from.text;
  return senderInfo.match(/^(.*?)\s*</)[1].replace(/"/g, "");
};

// Parsear el asunto del correo
const parseEmailSubject = (parsedEmail) => {
  return parsedEmail.subject;
};

//Extraemos hora y fecha del correo
const extractEmailDateTime = (parsedEmail) => {
  return parsedEmail.date;
};

// Extraer datos del cuerpo del correo utilizando una expresión regular
const extractDataFromBody = (body, regex) => {
  const match = body.match(regex);
  return match ? match[1].trim() : "";
};



module.exports = {
  extractSenderName,
  parseEmailSubject,
  extractDataFromBody,
  extractEmailDateTime,
};
