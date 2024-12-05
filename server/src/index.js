const { scheduleEmailProcessing } = require("./app/utils/cronJobs");
const { connect } = require("./config/database");
const cookieParser = require("cookie-parser");
const routes = require("./routes/routes");
const config = require("../config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const http = require("http");
require("dotenv").config();

const app = express();
// Puerto de la aplicación
const port = process.env.PORT || 5000;

console.log(port)

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/attachments", express.static(path.join(__dirname, "../src/assets/attachments")));

// Configuración de CORS
console.log(config.CORS_ORIGIN)

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Routers
app.use("/api/v1", routes);

// Crear el servidor
const server = http.createServer(app);

// Función para conectar la base de datos y arrancar el servidor
const startServer = async () => {
  try {
    await connect();
    server.listen(port, () => {
      console.log(`Server listening on port ${port}!`);
    });
    scheduleEmailProcessing();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();