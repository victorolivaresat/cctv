const routes = require('express').Router();

const eventRoutes = require('./eventRoutes');
const githubRoutes = require('./githubRoutes');
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes');
const userRoutes = require('./userRoutes');
const emailRoutes = require('./emailRoutes')

routes.use(eventRoutes);
routes.use(authRoutes);
routes.use(testRoutes);
routes.use(userRoutes);
routes.use(githubRoutes);
routes.use(emailRoutes);


module.exports = routes;
