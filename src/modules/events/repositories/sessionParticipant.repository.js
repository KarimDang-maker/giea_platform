const BaseRepository = require('../../marketplace/repositories/base.repository');
const { SessionParticipant } = require('../models');

class SessionParticipantRepository extends BaseRepository {
    constructor() {
        super('session_participants', SessionParticipant);
    }

    async findByUserAndSession(idUser, email, sessionId) {
        let query = this.collection
            .where('sessionId', '==', sessionId)
            .where('isDeleted', '==', false);

        if (idUser) {
            query = query.where('idUser', '==', idUser);
        } else {
            query = query.where('email', '==', email);
        }

        const snapshot = await query.get();
        return snapshot.empty ? null : snapshot.docs[0].data();
    }

    async countBySessionId(sessionId) {
        const snapshot = await this.collection
            .where('sessionId', '==', sessionId)
            .where('isDeleted', '==', false)
            .count()
            .get();
        return snapshot.data().count;
    }

    async findByUserId(idUser) {
        return this.findAll({ idUser });
    }
}

module.exports = new SessionParticipantRepository();
