class Event {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.date = data.date || null;
        this.location = data.location || '';
        this.type = data.type || 'conference'; // conference, workshop, webinar, etc.
        this.organizer = data.organizer || 'GIEA Platform';
        this.creatorId = data.creatorId || '';
        this.creatorName = data.creatorName || '';
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            date: this.date,
            location: this.location,
            type: this.type,
            organizer: this.organizer,
            creatorId: this.creatorId,
            creatorName: this.creatorName,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Event;
