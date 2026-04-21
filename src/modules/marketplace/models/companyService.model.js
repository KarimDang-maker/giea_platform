class CompanyService {
    constructor(data = {}) {
        this.id = data.id || '';
        this.companyPageId = data.companyPageId || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.price = data.price || 0;
        this.duration = data.duration || '';
        this.image = data.image || '';
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            companyPageId: this.companyPageId,
            name: this.name,
            description: this.description,
            price: this.price,
            duration: this.duration,
            image: this.image,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = CompanyService;
