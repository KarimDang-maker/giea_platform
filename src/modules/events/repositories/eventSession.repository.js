const BaseRepository = require('../../marketplace/repositories/base.repository');
const { EventSession } = require('../models');

class EventSessionRepository extends BaseRepository {
    constructor() {
        super('event_sessions', EventSession);
    }

    async findByEventId(eventId) {
        return this.findAll({ eventId });
    }
}

module.exports = new EventSessionRepository();
