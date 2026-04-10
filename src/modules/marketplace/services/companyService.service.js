const BaseService = require('./base.service');

class CompanyServiceService extends BaseService {
    constructor() {
        super('companyServices');
    }

    get pagesCollection() {
        return this.db.collection('companyPages');
    }

    async create(data) {
        const pageDoc = await this.pagesCollection.doc(data.companyPageId).get();
        if (!pageDoc.exists || pageDoc.data().isDeleted) {
            throw new Error('Page entreprise non trouvée ou supprimée');
        }

        // Default availability
        if (data.isAvailable === undefined) {
            data.isAvailable = true;
        }

        return super.create(data);
    }
}

module.exports = new CompanyServiceService();
