const eventController = require('../app/controllers/eventController'); 
const testController = require('../app/controllers/testController');
const routes = require('express').Router();

// Middlewares
const authRequired = require('../app/middleware/validateToken');

// Rutas para testController
routes.get('/tests/samsung/counts', authRequired, testController.getCountOfTestSamsung);
routes.get('/tests/samsung', authRequired, testController.getTestSamsung);
routes.get('/tests/hv/duplicates', authRequired, testController.removeDuplicateTestHv);
routes.get('/tests/hv/counts', authRequired, testController.getCountOfTestHv);
routes.get('/tests/hv', authRequired, testController.getTestHv);
routes.get('/tests/hv/count-distinct-name', authRequired, testController.getDistinctNameHvCount);
// routes.put('/tests/samsung/:id', authRequired, testController.updateTestSamsungObservations);
// routes.put('/tests/hv/:id', authRequired, testController.updateTestHvObservations);

// Rutas para eventController
routes.get('/events/samsung', authRequired, eventController.getEventsSamsung);
routes.get('/events/samsung/last', authRequired, eventController.getLastEventsSamsung);
routes.put('/events/samsung/:id', authRequired, eventController.updateEventSamsungStatus);
routes.get('/events/samsung/event-type', authRequired, eventController.getEventsSamsungByEventType);
routes.get('/events/samsung/count-distinct-name', authRequired, eventController.getDistinctNameSamsungCount);
routes.get('/events/hv', authRequired, eventController.getEventsHv);
routes.get('/events/hv/last', authRequired, eventController.getLastEventsHv);
routes.put('/events/hv/:id', authRequired, eventController.updateEventHvStatus);
routes.get('/events/hv/event-type', authRequired, eventController.getEventsHvByEventType);
routes.put('/events/samsung/observations/:id', authRequired, eventController.updateAddObservationsSamsung);
routes.put('/events/hv/observations/:id', authRequired, eventController.putUpdateAddObservations);
routes.get('/events/notifications', eventController.getNewNotificationsCount);
routes.get('/events/hv/:id', eventController.getEventHvDetail);
routes.get('/events/samsung/:id', eventController.getEventSamsungDetail);
routes.delete('/events/hv/remove-duplicates', authRequired, eventController.removeDuplicateEventsHv);

module.exports = routes;