const eventController = require('../app/controllers/eventController');
const routes = require('express').Router();

// Middlewares
const authRequired = require('../app/middleware/validateToken');

/**
 * Rutas para Hikvision (HV)
 */
routes.get('/events/hv', authRequired, eventController.getEventsHv);
routes.get('/events/hv/last', authRequired, eventController.getLastEventsHv); 
routes.put('/events/hv/:id', authRequired, eventController.updateEventHvStatus); 
routes.get('/events/hv/event-type', authRequired, eventController.getEventsHvByEventType);
routes.put('/events/hv/observations/:id', authRequired, eventController.updateEventHvObservations);
routes.get('/events/hv/count-distinct-name', authRequired, eventController.getDistinctNameHvCount);
routes.delete('/events/hv/remove-duplicates', authRequired, eventController.removeDuplicateEventsHv);

/**
 * Rutas para Samsung
 */
routes.get('/events/samsung', authRequired, eventController.getEventsSamsung);
routes.get('/events/samsung/last', authRequired, eventController.getLastEventsSamsung);
routes.put('/events/samsung/:id', authRequired, eventController.updateEventSamsungStatus);
routes.get('/events/samsung/event-type', authRequired, eventController.getEventsSamsungByEventType);
routes.put('/events/samsung/observations/:id', authRequired, eventController.updateEventSamsungObservations);
routes.get('/events/samsung/count-distinct-name', authRequired, eventController.getDistinctNameSamsungCount);
routes.delete('/events/samsung/remove-duplicates', authRequired, eventController.removeDuplicateEventsSamsung);

/**
 * Rutas generales
 */
routes.get('/events/notifications', authRequired, eventController.getNewNotificationsCount);

module.exports = routes;
