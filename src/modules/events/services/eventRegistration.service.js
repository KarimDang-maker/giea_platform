const BaseService = require('../../marketplace/services/base.service');
const { eventRegistrationRepository, eventRepository } = require('../repositories');

class EventRegistrationService extends BaseService {
    constructor() {
        super(eventRegistrationRepository);
    }

    async create(data) {
        const { eventId, idUser, email } = data;

        // 1. Check if event exists
        const event = await eventRepository.findById(eventId);
        if (!event) {
            throw new Error('Événement introuvable');
        }

        // 2. Validate idUser or email
        if (!idUser && !email) {
            throw new Error('idUser ou email obligatoire');
        }

        // 3. Avoid duplicates
        const existing = await eventRegistrationRepository.findByUserAndEvent(idUser, email, eventId);
        if (existing) {
            throw new Error('Déjà inscrit à cet événement');
        }

        return super.create(data);
    }

    async countByEventId(eventId) {
        return eventRegistrationRepository.countByEventId(eventId);
    }

    async getByUserId(idUser) {
        return eventRegistrationRepository.findByUserId(idUser);
    }
}

module.exports = new EventRegistrationService();
