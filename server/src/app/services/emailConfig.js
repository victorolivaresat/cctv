// emailService.js
const { parseEmailSubject, extractSenderName } = require("../utils/emailUtils");
const { processSamsung, processHikvision } = require("./emailParsing");
const { saveAttachmentLocally } = require("../utils/saveAttachments");
const { simpleParser } = require("mailparser");
const { v4: uuidv4 } = require("uuid");
const Imap = require("imap");
require("dotenv").config();

/*
 ** Configuración de la conexión IMAP
 */
const config = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.IMAP_PORT),
  tls: process.env.EMAIL_TLS === "true",
  connTimeout: 30000,
};

// Función para obtener una conexión IMAP
const getImapConnection = (retries = 3) => {
  const imap = new Imap(config);

  imap.once("error", (err) => {
    console.error("Error de conexión IMAP:", err);
    if (retries > 0) {
      console.log(`Reintentando conexión. Intentos restantes: ${retries}`);
      return getImapConnection(retries - 1);
    } else {
      throw new Error(
        "No se pudo establecer la conexión IMAP después de varios intentos."
      );
    }
  });

  imap.once("end", () => {
    console.log("Conexión IMAP cerrada.");
  });

  imap.connect();

  return imap;
};

// Función para obtener los datos del correo electrónico
const getEmailData = () => {
  
  const imap = getImapConnection();

  imap.once("ready", () => {
    imap.openBox("Prueba", false, (err, box) => {
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
const getAndFlagUnreadMessages = async (folder, sinceDate) => {
  return new Promise((resolve, reject) => {
    const imap = getImapConnection();
    let emails = [];

    imap.once("ready", () => {
      imap.openBox(folder, false, (err, box) => {
        if (err) {
          console.error("Error opening the inbox:", err);
          reject(err);
          return;
        }

        imap.search(["UNSEEN", ["SINCE", sinceDate]], (searchErr, results) => {
          if (searchErr) {
            console.error("Error searching for unread messages:", searchErr);
            reject(searchErr);
            return;
          }

          if (results.length === 0) {
            console.log("No hay mensajes no leídos.");
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
            console.log("Mensajes no leídos recuperados.");
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

// Función para mover un mensaje a la carpeta "procesados"
const moveMessageToProcessed = async (uid, sourceFolder, targetFolder) => {
  return new Promise((resolve, reject) => {
    const imap = getImapConnection();

    imap.once("ready", () => {
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
          imap.end();
          resolve();
        });
      });
    });

    imap.once("error", (err) => {
      reject(err);
    });
  });
};

// Función para procesar y guardar los correos electrónicos
const processEmails = async (folder, sinceDate) => {
  try {
    const emails = await getAndFlagUnreadMessages(folder, sinceDate);

    if (emails.length === 0) {
      return;
    }

    for (const { uid, message } of emails) {
      const parsedEmail = await simpleParser(message);
      const subject = parseEmailSubject(parsedEmail);
      const senderName = extractSenderName(parsedEmail);
      const attachmentsData = await processEmailWithAttachments(message);

      console.log("Procesando correo:", subject);
      console.log("Nombre del remitente:", senderName);
      console.log("Datos de los archivos adjuntos:", attachmentsData);
      console.log("Fecha del correo:", parsedEmail.date);

      await processHikvision(parsedEmail, senderName, attachmentsData);
      await markMessageAsRead(uid);
      await moveMessageToProcessed(uid, folder, 'procesados');
    }
    console.log("Correos procesados y guardados correctamente.");


  } catch (error) {
    console.error("Error al procesar y guardar correos:", error);
    throw error;
  }
};


// Función para marcar un mensaje como leído
async function processEmailWithAttachments(message) {
  const parsedEmail = await simpleParser(message);

  if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
    console.log("No hay archivos adjuntos en este correo.");
    return [];
  }

  const maxAttachments = 4;
  const savedAttachments = [];

  for (
    let i = 0;
    i < Math.min(parsedEmail.attachments.length, maxAttachments);
    i++
  ) {
    const attachment = parsedEmail.attachments[i];
    const filename = attachment.filename;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const savedPath = await saveAttachmentLocally(
      attachment.content,
      uniqueFilename
    );

    console.log(uniqueFilename);

    savedAttachments.push({
      filename: attachment.filename,
      path: uniqueFilename,
    });
  }

  return JSON.stringify(savedAttachments);
}

module.exports = {
  processEmails,
  getImapConnection,
  getEmailData,
};
