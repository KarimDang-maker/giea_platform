const BaseService = require('../../marketplace/services/base.service');
const { eventSessionRepository, eventRepository } = require('../repositories');

class EventSessionService extends BaseService {
    constructor() {
        super(eventSessionRepository);
    }

    async create(data) {
        const { eventId } = data;

        // Check if event exists
        const event = await eventRepository.findById(eventId);
        if (!event) {
            throw new Error('Événement introuvable');
        }

        return super.create(data);
    }

    async getByEventId(eventId) {
        return eventSessionRepository.findByEventId(eventId);
    }
}

module.exports = new EventSessionService();
