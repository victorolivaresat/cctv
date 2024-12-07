const userController = require('../app/controllers/userController');
const routes = require('express').Router();

// Middlewares
const { createUserSchema, updateUserSchema } = require('../app/validators/userSchema');
const { validateSchema } = require('../app/middleware/validateSchema');
const authRequired = require('../app/middleware/validateToken');

routes.post('/users', validateSchema(createUserSchema), authRequired, userController.createUser);
routes.put('/users/:id', validateSchema(updateUserSchema), authRequired, userController.updateUser);
routes.patch('/users/:id/status', authRequired, userController.updateUserStatus);
routes.get('/users', authRequired, userController.getAllUsers);
routes.get('/users/:id', authRequired, userController.getUser);
routes.delete('/users/:id', authRequired, userController.deleteUser);

module.exports = routes;
