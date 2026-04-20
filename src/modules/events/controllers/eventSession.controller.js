const { eventSessionService } = require('../services');

class EventSessionController {
    async create(req, res) {
        try {
            const { eventId } = req.params;
            const data = { ...req.body, eventId };
            const session = await eventSessionService.create(data);
            res.status(201).json(session);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async findByEvent(req, res) {
        try {
            const { eventId } = req.params;
            const sessions = await eventSessionService.getByEventId(eventId);
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { sessionId } = req.params;
            const session = await eventSessionService.update(sessionId, req.body);
            if (!session) return res.status(404).json({ message: 'Session non trouvée' });
            res.json(session);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { sessionId } = req.params;
            const success = await eventSessionService.delete(sessionId);
            if (!success) return res.status(404).json({ message: 'Session non trouvée' });
            res.json({ message: 'Session supprimée' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new EventSessionController();
