class CompanyPage {
    constructor(data = {}) {
        this.id = data.id || '';
        this.idUser = data.idUser || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.logo = data.logo || '';
        this.coverImage = data.coverImage || '';
        this.category = data.category || '';
        this.contactEmail = data.contactEmail || '';
        this.contactPhone = data.contactPhone || '';
        this.website = data.website || '';
        this.address = data.address || '';
        this.socialLinks = data.socialLinks || {
            facebook: '',
            instagram: '',
            linkedin: '',
            twitter: ''
        };
        this.isDeleted = data.isDeleted || false;
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    toJSON() {
        return {
            id: this.id,
            idUser: this.idUser,
            name: this.name,
            description: this.description,
            logo: this.logo,
            coverImage: this.coverImage,
            category: this.category,
            contactEmail: this.contactEmail,
            contactPhone: this.contactPhone,
            website: this.website,
            address: this.address,
            socialLinks: this.socialLinks,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = CompanyPage;
