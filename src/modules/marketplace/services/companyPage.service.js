const BaseService = require('./base.service');
const { companyPageRepository } = require('../repositories');
const { admin } = require('../../../config/database');

class CompanyPageService extends BaseService {
    constructor() {
        super(companyPageRepository);
    }

    get usersCollection() {
        return admin.firestore().collection('users');
    }

    /**
     * Get all active documents with user verification
     */
    async findAll(filters = {}) {
        if (filters.idUser) {
            const userDoc = await this.usersCollection.doc(filters.idUser).get();
            if (!userDoc.exists) {
                const error = new Error('Utilisateur non trouvé');
                error.statusCode = 404;
                throw error;
            }
        }
        return super.findAll(filters);
    }

    /**
     * Create a page after verifying user exists
     */
    async create(data) {
        const userDoc = await this.usersCollection.doc(data.idUser).get();
        if (!userDoc.exists) {
            const error = new Error('Utilisateur non trouvé');
            error.statusCode = 404;
            throw error;
        }
        return super.create(data);
    }

    /**
     * Cascade Soft Delete
     */
    async delete(id) {
        return this.repository.deleteWithCascade(id);
    }
}

module.exports = new CompanyPageService();
