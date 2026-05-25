const BaseRepository = require('../../marketplace/repositories/base.repository');
const Event = require('../models/event.model');

class EventRepository extends BaseRepository {
    constructor() {
        super('events', Event);
    }
}

module.exports = new EventRepository();
