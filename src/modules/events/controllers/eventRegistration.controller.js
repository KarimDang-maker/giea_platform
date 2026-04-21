const { eventRegistrationService } = require('../services');

class EventRegistrationController {
    async register(req, res) {
        try {
            const { eventId } = req.params;
            const { has_account, email, fullName, idUser } = req.body;

            const registrationData = {
                eventId,
                email,
                fullName,
                idUser: has_account ? (idUser || req.user?.userId) : null
            };

            const registration = await eventRegistrationService.create(registrationData);
            res.status(201).json(registration);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async findByEvent(req, res) {
        try {
            const { eventId } = req.params;
            const { status } = req.query;
            const filters = { eventId };
            if (status) filters.status = status;

            const participants = await eventRegistrationService.findAll(filters);
            res.json(participants);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const registration = await eventRegistrationService.update(id, { status });
            if (!registration) return res.status(404).json({ message: 'Inscription non trouvée' });
            res.json(registration);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async cancel(req, res) {
        try {
            const { id } = req.params;
            const hard = req.query.hard === 'true';

            if (hard) {
                const success = await eventRegistrationService.delete(id);
                if (!success) return res.status(404).json({ message: 'Inscription non trouvée' });
                res.json({ message: 'Inscription supprimée définitivement' });
            } else {
                const registration = await eventRegistrationService.update(id, { status: 'cancelled' });
                if (!registration) return res.status(404).json({ message: 'Inscription non trouvée' });
                res.json({ message: 'Inscription annulée (status: cancelled)', registration });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new EventRegistrationController();
