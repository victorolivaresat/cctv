const routes = require('express').Router();


const alertsCctvRoutes = require('./alertsCctvRoutes');
const githubRoutes = require('./githubRoutes');
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes');
const userRoutes = require('./userRoutes');

routes.use(alertsCctvRoutes);
routes.use(authRoutes);
routes.use(testRoutes);
routes.use(userRoutes);
routes.use(githubRoutes);


module.exports = routes;
