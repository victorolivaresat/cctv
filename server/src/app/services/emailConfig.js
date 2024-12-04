// emailService.js
const { parseEmailSubject, extractSenderName } = require("../utils/emailUtils");
const { processSamsung, processHikvision } = require("./emailParsing");
const { saveAttachmentLocally } = require("../utils/saveAttachments");
const { simpleParser } = require("mailparser");
const moment = require('moment-timezone');
const { v4: uuidv4 } = require("uuid");
const Imap = require("imap");
const { date } = require("zod");
require("dotenv").config();

/*
 ** Configuración de la conexión IMAP
 */
 const configHv = {
  user: process.env.EMAIL_USER_HV,
  password: process.env.EMAIL_PASSWORD_HV,
  host: process.env.EMAIL_HOST_HV,
  port: parseInt(process.env.IMAP_PORT),
  tls: process.env.EMAIL_TLS === "true",
  tlsOptions: { rejectUnauthorized: false },
  connTimeout: 60000,
};

const configSamsung = {
  user: process.env.EMAIL_USER_SAMSUNG,
  password: process.env.EMAIL_PASSWORD_SAMSUNG,
  host: process.env.EMAIL_HOST_SAMSUNG,
  port: parseInt(process.env.IMAP_PORT),
  tls: process.env.EMAIL_TLS === "true",
  tlsOptions: { rejectUnauthorized: false },
  connTimeout: 60000,
};

// Función para obtener una conexión IMAP
const getImapConnection = (config, retries = 3, callback) => {
  const imap = new Imap(config);

  imap.once("error", (err) => {
    console.error("Error de conexión IMAP:", err);
    if (retries > 0) {
      console.log(`Reintentando conexión. Intentos restantes: ${retries}`);
      setTimeout(() => getImapConnection(config, retries - 1, callback), 5000);
    } else {
      console.error("No se pudo establecer la conexión IMAP.");
    }
  });

  imap.once("ready", () => {
    console.log("Conexión IMAP establecida.");
    if (callback) callback(imap);
  });

  imap.once("end", () => {
    console.log("Conexión IMAP cerrada.");
  });

  imap.connect();

  return imap;
};

// Crear carpeta si no existe
const createFolderIfNotExists = (imap, folderName) => {
  return new Promise((resolve, reject) => {
    imap.getBoxes((err, boxes) => {
      if (err) {
        reject(err);
        return;
      }

      if (!boxes[folderName]) {
        imap.addBox(folderName, (addErr) => {
          if (addErr) {
            reject(addErr);
            return;
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

// Función para obtener los datos del correo electrónico
const getEmailData = () => {
  
  const imap = getImapConnection();

  imap.once("ready", () => {
    imap.openBox("inbox", false, (err, box) => {
      if (err) {
        console.error("Error al abrir la bandeja de entrada:", err);
        throw err;
      }

      const messagesTotal = box.messages.total;
      console.log("Buscando mensajes...");
      console.log(`Hay ${messagesTotal} mensajes en tu bandeja de entrada.`);

      imap.end();
    });
  });

  imap.once("error", (err) => {
    console.error("Error de conexión IMAP:", err);
    throw err;
  });
};

// Función para obtener los mensajes no leídos
const getMessagesbyDate = async (config, folder, exactDate) => {
  return new Promise((resolve, reject) => {
    const imap = getImapConnection(config);
    let emails = [];

    const dateInUTC = moment.tz(exactDate, "America/Lima").utc().format("DD-MMM-YYYY");

    imap.once("ready", () => {
      imap.openBox(folder, false, (err, box) => {
        if (err) {
          console.error("Error opening the inbox:", err);
          reject(err);
          return;
        }

        imap.search([["ON", dateInUTC]], (searchErr, results) => {
          if (searchErr) {
            console.error("Error searching for messages on date:", searchErr);
            reject(searchErr);
            return;
          }

          if (results.length === 0) {
            console.log("No hay mensajes en esta fecha.");
            imap.end();
            resolve([]);
            return;
          }

          const f = imap.fetch(results, { bodies: "" });

          f.on("message", (msg) => {
            let message = "";
            let uid;

            msg.on("body", (stream) => {
              stream.on("data", (chunk) => {
                message += chunk.toString("utf8");
              });
            });

            msg.once("end", () => {
              emails.push({ uid, message });
            });

            msg.once("attributes", (attrs) => {
              uid = attrs.uid;
            });
          });

          f.once("error", (fetchErr) => {
            console.error("Error al recuperar mensajes:", fetchErr);
            reject(fetchErr);
          });

          f.once("end", () => {
            console.log("Mensajes recuperados.");
            imap.end();
            resolve(emails);
          });
        });
      });
    });

    imap.once("error", (err) => {
      console.error("IMAP connection error:", err);
      reject(err);
    });
  });
};

// Función para obtener mensajes por rango de fechas
const getMessagesByDateRange = (imap, folder, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    let emails = [];

    const startDateInUTC = moment.tz(startDate, "America/Lima").utc().format("DD-MMM-YYYY HH:mm:ss");
    const endDateInUTC = moment.tz(endDate, "America/Lima").utc().format("DD-MMM-YYYY HH:mm:ss");

    imap.openBox(folder, false, (err, box) => {
      if (err) {
        console.error("Error opening the inbox:", err);
        reject(err);
        return;
      }

      imap.search([['SINCE', startDateInUTC], ['BEFORE', endDateInUTC]], (searchErr, results) => {
        if (searchErr) {
          console.error("Error searching for messages in date range:", searchErr);
          reject(searchErr);
          return;
        }

        if (results.length === 0) {
          console.log("No hay mensajes en este rango de fechas.");
          resolve([]);
          return;
        }

        const f = imap.fetch(results, { bodies: "" });

        f.on("message", (msg) => {
          let message = "";
          let uid;

          msg.on("body", (stream) => {
            stream.on("data", (chunk) => {
              message += chunk.toString("utf8");
            });
          });

          msg.once("end", () => {
            emails.push({ uid, message });
          });

          msg.once("attributes", (attrs) => {
            uid = attrs.uid;
          });
        });

        f.once("error", (fetchErr) => {
          console.error("Error al recuperar mensajes:", fetchErr);
          reject(fetchErr);
        });

        f.once("end", () => {
          console.log("Mensajes recuperados.");
          resolve(emails);
        });
      });
    });
  });
};

// Función para mover un mensaje a la carpeta "procesados"
const moveMessageToProcessed = (imap, uid, sourceFolder, targetFolder) => {
  return new Promise((resolve, reject) => {
    createFolderIfNotExists(imap, targetFolder).then(() => {
      imap.openBox(sourceFolder, false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        imap.move(uid, targetFolder, (moveErr) => {
          if (moveErr) {
            reject(moveErr);
            return;
          }
          resolve();
        });
      });
    }).catch(reject);
  });
};

// Función para procesar correos electrónicos
const processEmailsByBrand = async (config, folder, startDate, endDate, processFn) => {
  return new Promise((resolve, reject) => {
    getImapConnection(config, 3, async (imap) => {
      try {
        const emails = await getMessagesByDateRange(imap, folder, startDate, endDate);

        if (emails.length === 0) {
          imap.end();
          resolve();
          return;
        }

        for (const { uid, message } of emails) {
          const parsedEmail = await simpleParser(message);
          const senderName = extractSenderName(parsedEmail);
          const attachmentsData = await processEmailWithAttachments(message);
          const subject = parsedEmail.subject;

          await processFn(subject, parsedEmail, senderName, attachmentsData);
          await moveMessageToProcessed(imap, uid, folder, "Processed");
        }

        imap.end();
        resolve();
      } catch (error) {
        imap.end();
        reject(error);
      }
    });
  });
};
// Función para marcar un mensaje como leído
const processEmailWithAttachments = async(message) => {
  const parsedEmail = await simpleParser(message);

  if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
    console.log("No hay archivos adjuntos en este correo.");
    return "";
  }

  const maxAttachments = 1;
  const savedAttachments = [];

  for (
    let i = 0;
    i < Math.min(parsedEmail.attachments.length, maxAttachments);
    i++
  ) {
    const attachment = parsedEmail.attachments[i];
    const filename = attachment.filename;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    
    try {
      const savedPath = await saveAttachmentLocally(attachment.content, uniqueFilename);
      savedAttachments.push({ filename: uniqueFilename });
      console.log(savedPath);
    } catch (error) {
      console.error(`Error al guardar el archivo ${filename}:`, error);
    }
  }

  return JSON.stringify(savedAttachments);
}

// Función para procesar correos electrónicos de Hikvision
const processHikvisionEmails = async (folder, startDate, endDate) => {
  await processEmailsByBrand(configHv, folder, startDate, endDate, processHikvision);
};

// Función para procesar correos electrónicos de Samsung
const processSamsungEmails = async (folder, startDate, endDate) => {
  await processEmailsByBrand(configSamsung, folder, startDate, endDate, processSamsung);
};


module.exports = {
  getEmailData,
  processHikvisionEmails,
  processSamsungEmails,
};
