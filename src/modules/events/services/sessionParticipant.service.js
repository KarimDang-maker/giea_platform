const BaseService = require('../../marketplace/services/base.service');
const { sessionParticipantRepository, eventSessionRepository, eventRegistrationRepository } = require('../repositories');

class SessionParticipantService extends BaseService {
    constructor() {
        super(sessionParticipantRepository);
    }

    async create(data) {
        const { sessionId, registrationId } = data;

        if (!registrationId) {
            throw new Error('registrationId (ID de l\'inscription à l\'événement) est requis');
        }

        // 1. Fetch registration
        const registration = await eventRegistrationRepository.findById(registrationId);
        if (!registration) {
            throw new Error('Inscription à l\'événement non trouvée ou invalide');
        }

        // 2. Check if session exists
        const session = await eventSessionRepository.findById(sessionId);
        if (!session) {
            throw new Error('Session introuvable');
        }

        // 3. Verify event match
        if (registration.eventId !== session.eventId) {
            throw new Error('Cette inscription ne correspond pas à l\'événement de la session');
        }

        // 4. Check capacity
        const currentCount = await sessionParticipantRepository.countBySessionId(sessionId);
        if (session.maxParticipants > 0 && currentCount >= session.maxParticipants) {
            throw new Error('Capacité maximale atteinte pour cette session');
        }

        // 5. Avoid duplicates
        const existing = await sessionParticipantRepository.findByUserAndSession(
            registration.idUser,
            registration.email,
            sessionId
        );
        if (existing) {
            throw new Error('Déjà inscrit à cette session');
        }

        // Prepare final data based on registration info
        const finalData = {
            sessionId,
            registrationId,
            idUser: registration.idUser || null,
            email: registration.email,
            fullName: registration.fullName,
            status: 'confirmed'
        };

        return super.create(finalData);
    }

    async getByUserId(idUser) {
        return sessionParticipantRepository.findByUserId(idUser);
    }
}

module.exports = new SessionParticipantService();
