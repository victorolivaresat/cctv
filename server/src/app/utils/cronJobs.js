const {
  processHikvisionEmails,
  processSamsungEmails,
} = require("../../app/services/emailConfig");
const cron = require("node-cron");
const moment = require("moment");

// Función de reintento con retraso
const retryWithDelay = async (fn, retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fn();
      break;
    } catch (error) {
      console.error(
        `Intento ${i + 1} fallido. Reintentando en ${delay / 1000} segundos...`
      );
      if (i < retries - 1)
        await new Promise((resolve) => setTimeout(resolve, delay));
      else throw error;
    }
  }
};

// Función para programar el cron job
const scheduleEmailProcessing = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Iniciando el procesamiento de correos electrónicos...");
    try {
      const folder = process.env.EMAIL_FOLDER;
      const startDate = moment().startOf("day").toISOString();
      const endDate = moment().add(1, "day").startOf("day").toISOString();

      await retryWithDelay(() =>
        processHikvisionEmails(folder, startDate, endDate)
      );
      await retryWithDelay(() =>
        processSamsungEmails(folder, startDate, endDate)
      );
      console.log("Procesamiento de correos electrónicos completado.");
    } catch (error) {
      console.error("Error crítico al procesar correos electrónicos:", error);
    }
  });
};

module.exports = {
  scheduleEmailProcessing,
};
