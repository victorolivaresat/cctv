const authController = require('../app/controllers/authController');
const routes = require('express').Router();

// Middlewares
const { validateSchema } = require('../app/middleware/validateSchema');
const { loginSchema } = require("../app/validators/authSchema");
const authRequired = require('../app/middleware/validateToken');

/**
 * @swagger 
 * tags:
 * name: Auth
 * description: Auth API
 */
// Auth
routes.post("/auth/login", validateSchema(loginSchema), authController.login);
routes.post("/auth/logout", authController.logout);
routes.get("/profile", authRequired, authController.profile);
routes.get("/auth/verify-token", authController.verifyToken);

module.exports = routes;