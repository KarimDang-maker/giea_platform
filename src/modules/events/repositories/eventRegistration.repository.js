const BaseRepository = require('../../marketplace/repositories/base.repository');
const { EventRegistration } = require('../models');

class EventRegistrationRepository extends BaseRepository {
    constructor() {
        super('event_registrations', EventRegistration);
    }

    async findByUserAndEvent(idUser, email, eventId) {
        let query = this.collection
            .where('eventId', '==', eventId)
            .where('isDeleted', '==', false);

        if (idUser) {
            query = query.where('idUser', '==', idUser);
        } else {
            query = query.where('email', '==', email);
        }

        const snapshot = await query.get();
        return snapshot.empty ? null : snapshot.docs[0].data();
    }

    async countByEventId(eventId) {
        const snapshot = await this.collection
            .where('eventId', '==', eventId)
            .where('isDeleted', '==', false)
            .count()
            .get();
        return snapshot.data().count;
    }

    async findByUserId(idUser) {
        return this.findAll({ idUser });
    }
}

module.exports = new EventRegistrationRepository();
