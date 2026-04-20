const { sessionParticipantService } = require('../services');

class SessionParticipantController {
    async join(req, res) {
        try {
            const { sessionId } = req.params;
            const { idUser, email, fullName } = req.body;

            const data = {
                sessionId,
                idUser: idUser || req.user?.id,
                email,
                fullName
            };

            const participant = await sessionParticipantService.create(data);
            res.status(201).json(participant);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async findBySession(req, res) {
        try {
            const { sessionId } = req.params;
            const participants = await sessionParticipantService.findAll({ sessionId });
            res.json(participants);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async leave(req, res) {
        try {
            const { id } = req.params;
            const success = await sessionParticipantService.delete(id);
            if (!success) return res.status(404).json({ message: 'Participation non trouvée' });
            res.json({ message: 'Participation annulée' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new SessionParticipantController();
