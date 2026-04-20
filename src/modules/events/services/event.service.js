const BaseService = require('../../marketplace/services/base.service');
const { eventRepository } = require('../repositories');

class EventService extends BaseService {
    constructor() {
        super(eventRepository);
    }
}

module.exports = new EventService();
