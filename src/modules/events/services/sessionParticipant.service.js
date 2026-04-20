const BaseService = require('../../marketplace/services/base.service');
const { sessionParticipantRepository, eventSessionRepository } = require('../repositories');

class SessionParticipantService extends BaseService {
    constructor() {
        super(sessionParticipantRepository);
    }

    async create(data) {
        const { sessionId, idUser, email } = data;

        // 1. Check if session exists
        const session = await eventSessionRepository.findById(sessionId);
        if (!session) {
            throw new Error('Session introuvable');
        }

        // 2. Validate idUser or email
        if (!idUser && !email) {
            throw new Error('idUser ou email obligatoire');
        }

        // 3. Check capacity
        const currentCount = await sessionParticipantRepository.countBySessionId(sessionId);
        if (session.maxParticipants > 0 && currentCount >= session.maxParticipants) {
            throw new Error('Capacité maximale atteinte pour cette session');
        }

        // 4. Avoid duplicates
        const existing = await sessionParticipantRepository.findByUserAndSession(idUser, email, sessionId);
        if (existing) {
            throw new Error('Déjà inscrit à cette session');
        }

        return super.create(data);
    }

    async getByUserId(idUser) {
        return sessionParticipantRepository.findByUserId(idUser);
    }
}

module.exports = new SessionParticipantService();
