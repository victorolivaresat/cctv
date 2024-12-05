const {
  processHikvisionEmails,
  processSamsungEmails,
} = require("../../app/services/emailConfig");

const processEmails = async (req, res) => {
  const { folder, startDate, endDate, brand } = req.body;

  try {
    if (brand === "hikvision") {
      await processHikvisionEmails(folder, startDate, endDate);
    } else if (brand === "samsung") {
      await processSamsungEmails(folder, startDate, endDate);
    } else {
      return res.status(400).json({ error: "Marca no soportada" });
    }

    res.status(200).json({
      message: 'Correos procesados y movidos a la carpeta "procesados".',
    });
  } catch (error) {
    console.error("Error al procesar correos:", error);
    res.status(500).json({ error: "Error al procesar correos" });
  }
};

module.exports = {
  processEmails,
};
