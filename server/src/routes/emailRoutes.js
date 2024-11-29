const  emailController  = require('../app/controllers/emailController')
const routes = require('express').Router();

// Middlewares
const authRequired = require('../app/middleware/validateToken');
routes.get('/email/process', authRequired, emailController.proccesAllEmails );

module.exports = routes;
