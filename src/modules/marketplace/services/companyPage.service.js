const BaseService = require('./base.service');
const { admin } = require('../../../config/database');

class CompanyPageService extends BaseService {
    constructor() {
        super('companyPages');
    }

    get newsCollection() {
        return this.db.collection('companyNews');
    }

    get servicesCollection() {
        return this.db.collection('companyServices');
    }

    get usersCollection() {
        return this.db.collection('users');
    }

    /**
     * Create a page after verifying user exists
     */
    async create(data) {
        const userDoc = await this.usersCollection.doc(data.idUser).get();
        if (!userDoc.exists) {
        
            throw new Error('Utilisateur non trouvé');
        }
        return super.create(data);
    }

    /**
     * Cascade Soft Delete: Page + All News + All Services
     */
    async delete(id) {
        const batch = this.db.batch();
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // 1. Mark Page as deleted
        const pageRef = this.collection.doc(id);
        const pageDoc = await pageRef.get();
        if (!pageDoc.exists || pageDoc.data().isDeleted) return false;

        batch.update(pageRef, { isDeleted: true, updatedAt: timestamp });

        // 2. Mark News as deleted
        const newsSnapshot = await this.newsCollection.where('companyPageId', '==', id).where('isDeleted', '==', false).get();
        newsSnapshot.forEach(doc => {
            batch.update(doc.ref, { isDeleted: true, updatedAt: timestamp });
        });

        // 3. Mark Services as deleted
        const servicesSnapshot = await this.servicesCollection.where('companyPageId', '==', id).where('isDeleted', '==', false).get();
        servicesSnapshot.forEach(doc => {
            batch.update(doc.ref, { isDeleted: true, updatedAt: timestamp });
        });

        await batch.commit();
        return true;
    }
}

module.exports = new CompanyPageService();
