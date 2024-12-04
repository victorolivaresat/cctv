const emailController = require('../app/controllers/emailController');
const routes = require('express').Router();

// Middlewares
const authRequired = require('../app/middleware/validateToken');

routes.post('/email/process', authRequired, emailController.processEmails);

module.exports = routes;