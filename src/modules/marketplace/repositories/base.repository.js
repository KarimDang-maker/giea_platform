const { admin } = require('../../../config/database');

class BaseRepository {
    constructor(collectionName, Model) {
        this.collectionName = collectionName;
        this.Model = Model;
    }

    get db() {
        return admin.firestore();
    }

    get collection() {
        return this.db.collection(this.collectionName);
    }

    /**
     * Create a new document from model instance
     * @param {Object} data 
     * @returns {Promise<Object>} Created document data
     */
    async create(data) {
        const docRef = this.collection.doc();
        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        const newData = {
            ...data,
            id: docRef.id,
            isDeleted: false,
            createdAt: timestamp,
            updatedAt: timestamp
        };

        await docRef.set(newData);
        return newData;
    }

    /**
     * Find all active documents
     * @param {Object} filters 
     * @returns {Promise<Array>}
     */
    async findAll(filters = {}) {
        let query = this.collection.where('isDeleted', '==', false);

        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined) {
                query = query.where(key, '==', filters[key]);
            }
        });

        const snapshot = await query.get();
        return snapshot.docs.map(doc => doc.data());
    }

    /**
     * Find by ID
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists || doc.data().isDeleted) return null;
        return doc.data();
    }

    /**
     * Update document
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<Object|null>}
     */
    async update(id, data) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists || doc.data().isDeleted) return null;

        const updatedData = {
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await docRef.update(updatedData);
        const updatedDoc = await docRef.get();
        return updatedDoc.data();
    }

    /**
     * Soft delete
     * @param {string} id 
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists || doc.data().isDeleted) return false;

        await docRef.update({
            isDeleted: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return true;
    }
}

module.exports = BaseRepository;
