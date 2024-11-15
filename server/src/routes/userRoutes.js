const CustomThemeController = require('../app/controllers/CustomThemeController');
const userController = require('../app/controllers/userController');
const routes = require('express').Router();

// Middlewares
const { createUserSchema, updateUserSchema } = require('../app/validators/userSchema');
const { validateSchema } = require('../app/middleware/validateSchema');
const authRequired = require('../app/middleware/validateToken');

/**
 * @swagger
 * tags:
 * name: Users
 * description: Users API
 */
// Users
routes.post('/users', validateSchema(createUserSchema), authRequired, userController.createUser);
routes.put('/users/:id', validateSchema(updateUserSchema), authRequired, userController.updateUser);
routes.get('/users', authRequired, userController.getAllUsers);
routes.get('/users/:id', authRequired, userController.getUser);
routes.delete('/users/:id', authRequired, userController.deleteUser);
routes.get('/users/:userId/theme', authRequired, CustomThemeController.getTheme);
routes.put('/users/:userId/theme', authRequired, CustomThemeController.updateTheme);

module.exports = routes;
