const BaseService = require('./base.service');

class CompanyNewsService extends BaseService {
    constructor() {
        super('companyNews');
    }

    get pagesCollection() {
        return this.db.collection('companyPages');
    }

    async create(data) {
        const pageDoc = await this.pagesCollection.doc(data.companyPageId).get();
        if (!pageDoc.exists || pageDoc.data().isDeleted) {
            throw new Error('Page entreprise non trouvée ou supprimée');
        }

        // Add default publishedAt if not provided
        if (!data.publishedAt) {
            data.publishedAt = new Date();
        }

        return super.create(data);
    }
}

module.exports = new CompanyNewsService();
