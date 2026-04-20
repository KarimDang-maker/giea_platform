const { eventService, eventSessionService, eventRegistrationService } = require('../services');

class EventController {
    async create(req, res) {
        try {
            const data = { ...req.body, createdBy: req.user?.id || 'admin' };
            const event = await eventService.create(data);
            res.status(201).json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const { search, upcoming, createdBy } = req.query;
            const filters = {};
            if (createdBy) filters.createdBy = createdBy;

            // Search and upcoming could be handled more deeply in service/repo if needed
            // For now let's keep it simple
            let events = await eventService.findAll(filters);

            if (search) {
                const term = search.toLowerCase();
                events = events.filter(e =>
                    e.title.toLowerCase().includes(term) ||
                    e.description.toLowerCase().includes(term)
                );
            }

            if (upcoming === 'true') {
                const now = new Date();
                events = events.filter(e => new Date(e.startDate) >= now);
            }

            res.json(events);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async findById(req, res) {
        try {
            const { id } = req.params;
            const event = await eventService.findById(id);
            if (!event) return res.status(404).json({ message: 'Événement non trouvé' });

            // Enrich response
            const sessions = await eventSessionService.getByEventId(id);
            const registrationsCount = await eventRegistrationService.countByEventId(id);

            res.json({
                event,
                sessions,
                registrationsCount
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const event = await eventService.update(id, req.body);
            if (!event) return res.status(404).json({ message: 'Événement non trouvé' });
            res.json(event);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const success = await eventService.delete(id);
            if (!success) return res.status(404).json({ message: 'Événement non trouvé' });
            res.json({ message: 'Événement supprimé' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new EventController();
