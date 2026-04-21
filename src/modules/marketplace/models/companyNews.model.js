class CompanyNews {
    constructor(data = {}) {
        this.id = data.id || '';
        this.companyPageId = data.companyPageId || '';
        this.title = data.title || '';
        this.content = data.content || '';
        this.image = data.image || '';
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            companyPageId: this.companyPageId,
            title: this.title,
            content: this.content,
            image: this.image,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = CompanyNews;
