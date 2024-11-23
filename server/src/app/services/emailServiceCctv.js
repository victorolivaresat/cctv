// emailService.js
const {
  processSamsungEmail,
  processTestHvEmail,
  processEventHvEmail,
  processSuportEventHvEmail,
} = require("./emailParsingService");
const { parseEmailSubject, extractSenderName } = require("../utils/emailUtils");
const { saveAttachmentLocally } = require("../utils/saveAttachments");
const { simpleParser } = require("mailparser");
const { v4: uuidv4 } = require('uuid');
const Imap = require("imap");
require("dotenv").config();

const SAMSUNG_SUBJECT = "SDR-B73303";
const TEST_SUBJECT = "TEST MESSAGE FROM:";
const DVR_SUBJECT = "Embedded Net DVR";

/*
 ** Configuración de la conexión IMAP
 */
const config = {
  user: process.env.EMAIL_USER_CCTV,
  password: process.env.EMAIL_PASSWORD_CCTV,
  host: process.env.EMAIL_HOST_CCTV,
  port: parseInt(process.env.IMAP_PORT),
  tls: process.env.EMAIL_TLS_CCTV === "true",
  connTimeout: 30000,
};

// Función para obtener una conexión IMAP
const getImapConnection = (retries = 10) => {
  //console.log("Hola2");
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
    imap.openBox("PRUEBA", false, (err, box) => {
      if (err) {
        console.error("Error al abrir la bandeja de entrada:", err);
        throw err;
      }

      const numMensajes = box.messages.total;
      console.log("Buscando mensajes...");
      console.log(`Hay ${numMensajes} mensajes en tu bandeja de entrada.`);

      imap.end();
    });
  });

  imap.once("error", (err) => {
    console.error("Error de conexión IMAP:", err);
    throw err;
  });
};

// Función para obtener los mensajes no leídos
const getAndFlagUnreadMessages = async () => {
  return new Promise((resolve, reject) => {
    //console.log("1");
    const imap = getImapConnection();
    let emails = [];

    imap.once("ready", () => {
      imap.openBox("PRUEBA", false, (err, box) => {
        if (err) {
          console.error("Error opening the inbox:", err);
          reject(err);
          return;
        }

        imap.search(["UNSEEN"], (searchErr, results) => {
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

// Función para marcar un mensaje como leído
const markMessageAsRead = async (uid) => {
  return new Promise((resolve, reject) => {
    const imap = getImapConnection();

    imap.once("ready", () => {
      imap.openBox("PRUEBA", false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        imap.addFlags(uid, "\\Seen", (err) => {
          if (err) {
            reject(err);
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
const processAndSaveEmails = async (io = null) => {
  try {
    const emails = await getAndFlagUnreadMessages();

    if (emails.length === 0) {
      return;
    }

    // Emitir un evento con la cantidad total de correos por procesar
    if (io) {
      io.emit("totalEmailsToProcess", { total: emails.length });
    }

    for (const { uid, message } of emails) {
      const parsedEmail = await simpleParser(message);
      const subject = parseEmailSubject(parsedEmail);
      const senderName = extractSenderName(parsedEmail);

      if (subject.includes(SAMSUNG_SUBJECT)) {
        await processSamsungEmail(parsedEmail);
      } else if (subject.includes(TEST_SUBJECT)) {
        await processTestHvEmail(parsedEmail, senderName);
      } else if (subject.includes(DVR_SUBJECT)) {
        await processEventHvEmail(parsedEmail, senderName);
      }

      await markMessageAsRead(uid);

      if (io) {
        io.emit("emailProcessed", { uid, subject });
      }
    }
    console.log("Correos procesados y guardados correctamente.");

    if (io) {
      io.emit("allEmailsProcessed");
    }
  } catch (error) {
    console.error("Error al procesar y guardar correos:", error);
    throw error;
  }
};

// Función para procesar y guardar los correos electrónicos desde el back-end
const processEmailServer = async (req) => {
  // Obtener el socket.io desde el middleware
  console.log("Iniciando");
  // const io = req.io;
  try {
    const emails = await getAndFlagUnreadMessages();

    if (emails.length === 0) {
      console.log("No hay correos para procesar desde el servidor.");
      // io.emit("nothingToProcess");
      return;
    }

    for (const { uid, message } of emails) {
      const parsedEmail = await simpleParser(message);
      const subject = parseEmailSubject(parsedEmail);
      const senderName = extractSenderName(parsedEmail);
      const attachmentsData = await processEmailWithAttachments(message);
    
      const body = parsedEmail.text;
    
      // Process based on subject
      if (subject.includes("SDR-B73303")) {
        await processSamsungEmail(parsedEmail);
      } else if (subject.includes("TEST MESSAGE FROM:")) {
        await processTestHvEmail(parsedEmail, senderName);
      } else if (subject.includes("Embedded Net DVR")) {
        await processEventHvEmail(parsedEmail, senderName, attachmentsData);
      }
    
      // Process based on body content
      if (body.includes("HikVision")) {
        await processSuportEventHvEmail(parsedEmail, attachmentsData);
      } else if (body.includes("Samsung")) {
        await processSuportEventSamsungEmail(parsedEmail,attachmentsData);
      }
    
    

      await markMessageAsRead(uid);
    }
    console.log("Correos procesados y guardados correctamente.");
    // io.emit("allEmailsProcessed");
  } catch (error) {
    console.error("Error al procesar y guardar correos:", error);
    // io.emit("imapConnectionError", { message: "Error al procesar y guardar correos" });
    throw error;
  }
};

// Función para procesar correos electrónicos con archivos adjuntos
async function processEmailWithAttachments(message) {

  const parsedEmail = await simpleParser(message);

  if (!parsedEmail.attachments || parsedEmail.attachments.length === 0) {
    console.log("No hay archivos adjuntos en este correo.");
    return [];
  }

  const maxAttachments = 4;
  const savedAttachments = [];

  for (let i = 0; i < Math.min(parsedEmail.attachments.length, maxAttachments); i++) {
    const attachment = parsedEmail.attachments[i];
    const filename = attachment.filename;
    const uniqueFilename = `${uuidv4()}-${filename}`;
    const savedPath = await saveAttachmentLocally(attachment.content, uniqueFilename);

    console.log(uniqueFilename)

    savedAttachments.push({"filename": attachment.filename, "path": uniqueFilename });
  }

  return savedAttachments;
}

module.exports = {
  
  getAndFlagUnreadMessages,
  processAndSaveEmails,
  processEmailServer,
  markMessageAsRead,
  getImapConnection,
  getEmailData,
};
