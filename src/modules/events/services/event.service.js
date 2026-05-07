const BaseService = require('../../marketplace/services/base.service');
const eventRepository = require('../repositories/event.repository');
const eventNotify = require('../../notifications/middlewares/event');

class EventService extends BaseService {
    constructor() {
        super(eventRepository);
    }

    async create(data) {
        const event = await super.create(data);
        
        // Trigger notification for all users
        // We pass null or empty targets to signal "all users" to the middleware/worker
        // or handle fetching all users in the service or middleware.
        // I'll handle it in the worker for better scalability, but I need to signal it.
        await eventNotify.eventCreated(event);
        
        return event;
    }
}

module.exports = new EventService();
