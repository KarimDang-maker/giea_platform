class Event {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.location = data.location || '';
        this.startDate = data.startDate || null;
        this.endDate = data.endDate || null;
        this.coverImage = data.coverImage || '';
        this.createdBy = data.createdBy || '';
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            location: this.location,
            startDate: this.startDate,
            endDate: this.endDate,
            coverImage: this.coverImage,
            createdBy: this.createdBy,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Event;
