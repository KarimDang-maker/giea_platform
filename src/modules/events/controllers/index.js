const eventController = require('./event.controller');
const eventRegistrationController = require('./eventRegistration.controller');
const eventSessionController = require('./eventSession.controller');
const sessionParticipantController = require('./sessionParticipant.controller');
const meController = require('./me.controller');

module.exports = {
    eventController,
    eventRegistrationController,
    eventSessionController,
    sessionParticipantController,
    meController
};
