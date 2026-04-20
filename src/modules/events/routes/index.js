const express = require('express');
const router = express.Router();

const eventRoutes = require('./event.routes');
const registrationRoutes = require('./registration.routes');
const { eventSessionRoutes, sessionSpecificRoutes } = require('./session.routes');
const meRoutes = require('./me-ev.routes');

// Mount on /api/events (this router will be mounted at /api/events in src/index.js)
router.use('/', eventRoutes);
router.use('/', registrationRoutes);
router.use('/', eventSessionRoutes);

module.exports = {
    eventsRouter: router,
    sessionsRouter: sessionSpecificRoutes,
    meRouter: meRoutes
};
