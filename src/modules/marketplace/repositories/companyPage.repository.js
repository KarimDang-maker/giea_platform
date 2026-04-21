const BaseRepository = require('./base.repository');
const { CompanyPage } = require('../models');
const { admin } = require('../../../config/database');

class CompanyPageRepository extends BaseRepository {
    constructor() {
        super('companyPages', CompanyPage);
    }

    get newsCollection() {
        return this.db.collection('companyNews');
    }

    get servicesCollection() {
        return this.db.collection('companyServices');
    }

    get productsCollection() {
        return this.db.collection('companyProducts');
    }

    /**
     * Cascade Soft Delete: Page + All related items
     */
    async deleteWithCascade(id) {
        const batch = this.db.batch();
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // 1. Mark Page as deleted
        const pageRef = this.collection.doc(id);
        const pageDoc = await pageRef.get();
        if (!pageDoc.exists || pageDoc.data().isDeleted) return false;

        batch.update(pageRef, { isDeleted: true, updatedAt: timestamp });

        // Helper for cascade update
        const markDeleted = async (collection, foreignKey) => {
            const snapshot = await collection.where(foreignKey, '==', id).where('isDeleted', '==', false).get();
            snapshot.forEach(doc => {
                batch.update(doc.ref, { isDeleted: true, updatedAt: timestamp });
            });
        };

        // 2. Mark related items as deleted
        await markDeleted(this.newsCollection, 'companyPageId');
        await markDeleted(this.servicesCollection, 'companyPageId');
        await markDeleted(this.productsCollection, 'companyPageId');

        await batch.commit();
        return true;
    }
}

module.exports = new CompanyPageRepository();
