class SessionParticipant {
    constructor(data = {}) {
        this.id = data.id || '';
        this.sessionId = data.sessionId || '';
        this.idUser = data.idUser || null;
        this.email = data.email || '';
        this.fullName = data.fullName || '';
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            sessionId: this.sessionId,
            idUser: this.idUser,
            email: this.email,
            fullName: this.fullName,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt
        };
    }
}

module.exports = SessionParticipant;
