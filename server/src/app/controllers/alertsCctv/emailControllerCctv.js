const { processAndSaveEmails } = require('../../services/emailServiceCctv');

const readAndProcessUnreadEmails = async (req, res) => {

  const io = req.io;

  try {
    await processAndSaveEmails(io);
    res.send("Correos no leídos procesados.");
  } catch (error) {
    console.error("Error en el procesamiento de correos:", error);
    res.status(500).send("Error al procesar correos no leídos.");
  }
};


module.exports = { readAndProcessUnreadEmails };
