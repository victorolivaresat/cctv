const authController = require('../app/controllers/authController');
const routes = require('express').Router();

// Middlewares
const { validateSchema } = require('../app/middleware/validateSchema');
const { loginSchema } = require("../app/validators/authSchema");
const authRequired = require('../app/middleware/validateToken');

routes.post("/auth/login", validateSchema(loginSchema), authController.login);
routes.get("/auth/profile", authRequired, authController.profile);
routes.get("/auth/verify-token", authController.verifyToken);
routes.post("/auth/logout", authController.logout);

module.exports = routes;