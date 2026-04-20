const { eventRegistrationService, sessionParticipantService, eventService, eventSessionService } = require('../services');

class MeController {
    async getMyEvents(req, res) {
        try {
            const userId = req.user.id || req.user.email;
            const registrations = await eventRegistrationService.getByUserId(userId);

            // Get event details for each registration
            const eventPromises = registrations.map(reg => eventService.findById(reg.eventId));
            const events = await Promise.all(eventPromises);

            res.json(events.filter(e => e !== null));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMySessions(req, res) {
        try {
            const userId = req.user.id || req.user.email;
            const participations = await sessionParticipantService.getByUserId(userId);

            // Get session details for each participation
            const sessionPromises = participations.map(p => eventSessionService.findById(p.sessionId));
            const sessions = await Promise.all(sessionPromises);

            res.json(sessions.filter(s => s !== null));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new MeController();
