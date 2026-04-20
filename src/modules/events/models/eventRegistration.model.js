class EventRegistration {
    constructor(data = {}) {
        this.id = data.id || '';
        this.eventId = data.eventId || '';
        this.idUser = data.idUser || null; // Either idUser or email must be present
        this.email = data.email || '';
        this.fullName = data.fullName || '';
        this.status = data.status || 'pending'; // pending, confirmed, cancelled
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            eventId: this.eventId,
            idUser: this.idUser,
            email: this.email,
            fullName: this.fullName,
            status: this.status,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = EventRegistration;
