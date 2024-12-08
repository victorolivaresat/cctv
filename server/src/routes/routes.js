const routes = require('express').Router();

const dvrControlRoutes = require('./dvrControlRoutes');
const githubRoutes = require('./githubRoutes');
const eventRoutes = require('./eventRoutes');
const emailRoutes = require('./emailRoutes');
const authRoutes = require('./authRoutes');
const testRoutes = require('./testRoutes');
const userRoutes = require('./userRoutes');

routes.use(eventRoutes);
routes.use(authRoutes);
routes.use(testRoutes);
routes.use(userRoutes);
routes.use(githubRoutes);
routes.use(emailRoutes);
routes.use(dvrControlRoutes);

module.exports = routes;
