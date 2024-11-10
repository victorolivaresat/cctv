const eventController = require('../app/controllers/alertsCctv/eventController'); 
const emailCctv = require('../app/controllers/alertsCctv/emailControllerCctv');
const testController = require('../app/controllers/alertsCctv/testController');
const routes = require('express').Router();

//const app = express();
//app.use(express.json());

// Middlewares
const authRequired = require('../app/middleware/validateToken');

/**
 * @swagger
 * tags:
 * name: Email
 * description: Email API
 */
// Email CCTV routes
routes.get('/process-emails-cctv', authRequired, emailCctv.readAndProcessUnreadEmails);
routes.get('/tests/samsung/counts', authRequired, testController.getCountOfTestSamsung);
routes.get('/events/samsung', authRequired, eventController.getEventsSamsung);
routes.get('/tests/hv/counts', authRequired, testController.getCountOfTestHv);
routes.get('/tests/samsung', authRequired, testController.getTestSamsung);
routes.get('/events/hv', authRequired, eventController.getEventsHv);
routes.get('/tests/hv', authRequired, testController.getTestHv);
routes.get('/events/samsung/last', authRequired, eventController.getLastEventsSamsung);
routes.get('/events/hv/last', authRequired, eventController.getLastEventsHv);
routes.get('/tests/hv/duplicates', authRequired, testController.removeDuplicateTestHv);
routes.put('/events/samsung/:id', authRequired, eventController.updateEventSamsungStatus);
routes.put('/events/hv/:id', authRequired, eventController.updateEventHvStatus);
routes.put('/tests/samsung/:id', authRequired, eventController.updateEventSamsungObservations);
routes.put('/tests/hv/:id', authRequired, eventController.updateEventHvObservations);
routes.get('/events/hv/event-type', authRequired, eventController.getEventsHvByEventType);
routes.get('/events/samsung/event-type', authRequired, eventController.getEventsSamsungByEventType);
routes.get('/events/hv/count-distinct-name', authRequired, testController.getDistinctNameHvCount);
routes.get('/events/samsung/count-distinct-name', authRequired, eventController.getDistinctNameSamsungCount);

routes.put('/events/put/update/add/observations/:id', authRequired, eventController.putUpdateAddObservations);

//routes.post('/sendEmail',authRequired,  eventController.sendEmail);
//app.post('/api/sendEmail', eventController.sendEmail);
routes.get('/events/suport-hv', authRequired, eventController.getSuportEventsHv);
routes.get('/events/suport-samsung', authRequired, eventController.getSuportEventsSamsung);

routes.get('/events/put/update/add/observations/samsung/:id', authRequired, eventController.putUpdateAddObservationsSamsung);

module.exports = routes;

