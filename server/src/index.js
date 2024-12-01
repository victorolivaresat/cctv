const { processEmails } = require("./app/services/emailConfig");
const { connect } = require("../src/config/database");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const express = require("express");
const cron = require('node-cron');
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const http = require("http");
require("dotenv").config();
const app = express();


// Puerto de la aplicación
const port = process.env.PORT || 5000;

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/attachments", express.static(path.join(__dirname, "../src/assets/attachments")));

// Función para habilitar CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

/*Routers*/
app.use("/api/v1", routes);

// Crear el servidor
const server = http.createServer(app);

// Conectar a la base de datos y luego iniciar el servidor
const startServer = async () => {
  try {
    await connect();
    server.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

cron.schedule('0 * * * *', async () => {
  console.log('Iniciando el procesamiento de correos electrónicos...');
  try {
    const folder = process.env.EMAIL_FOLDER;
    const sinceDate = new Date();
    await processEmails(folder, sinceDate);
    console.log('Procesamiento de correos electrónicos completado.');
  } catch (error) {
    console.error('Error al procesar correos electrónicos:', error);
  }
});

startServer();