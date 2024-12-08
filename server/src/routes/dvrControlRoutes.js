const dvrControlController = require('../app/controllers/dvrControlController');
const routes = require('express').Router();

// Middlewares
const { validateSchema } = require('../app/middleware/validateSchema');
const authRequired = require('../app/middleware/validateToken');

// Rutas para el controlador de DVR Control
routes.post('/dvr-controls', authRequired, dvrControlController.createDvrControl);
routes.put('/dvr-controls/:id', authRequired, dvrControlController.updateDvrControl);
routes.get('/dvr-controls', authRequired, dvrControlController.getAllDvrControls);
routes.get('/dvr-controls/:id', authRequired, dvrControlController.getDvrControl);
routes.delete('/dvr-controls/:id', authRequired, dvrControlController.deleteDvrControl);
routes.patch('/dvr-controls/:id/status', authRequired, dvrControlController.updateDvrControlStatus);

module.exports = routes;
