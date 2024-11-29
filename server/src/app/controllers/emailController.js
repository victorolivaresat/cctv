const { processEmails } = require("../../app/services/emailConfig");

const proccesAllEmails = async (req, res) => {

 const { date, folder } = req.query;

  try {
    await processEmails(folder, date);
    res.json({ message: "Correos no leídos procesados." });
  } catch (error) {
    console.error("Error en el procesamiento de correos:", error);
    res.status(500).send("Error al procesar correos no leídos.");
  }
};


module.exports = { proccesAllEmails };
