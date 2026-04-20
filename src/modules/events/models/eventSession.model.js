class EventSession {
    constructor(data = {}) {
        this.id = data.id || '';
        this.eventId = data.eventId || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.type = data.type || ''; // e.g., conference, workshop
        this.speakerName = data.speakerName || '';
        this.startTime = data.startTime || null;
        this.endTime = data.endTime || null;
        this.maxParticipants = data.maxParticipants || 0;
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            eventId: this.eventId,
            title: this.title,
            description: this.description,
            type: this.type,
            speakerName: this.speakerName,
            startTime: this.startTime,
            endTime: this.endTime,
            maxParticipants: this.maxParticipants,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = EventSession;
