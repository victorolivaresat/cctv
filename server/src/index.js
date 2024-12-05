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

const app = express();
const port = config.APP_PORT;

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/attachments", express.static(path.join(__dirname, "../src/assets/attachments")));

// Configuración de CORS
const allowedOrigins = config.CORS_ORIGIN.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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