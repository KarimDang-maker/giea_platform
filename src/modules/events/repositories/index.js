const eventRepository = require('./event.repository');
const eventRegistrationRepository = require('./eventRegistration.repository');
const eventSessionRepository = require('./eventSession.repository');
const sessionParticipantRepository = require('./sessionParticipant.repository');

module.exports = {
    eventRepository,
    eventRegistrationRepository,
    eventSessionRepository,
    sessionParticipantRepository
};
