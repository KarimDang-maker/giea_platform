const { admin } = require('../../../config/database');

class BaseService {
    constructor(collectionName) {
        this.db = admin.firestore();
        this.collection = this.db.collection(collectionName);
    }

    /**
     * Create a new document
     * @param {Object} data 
     * @returns {Promise<Object>} Created document with ID
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
     * Get all active documents
     * @param {Object} filters optional filters
     * @returns {Promise<Array>} List of documents
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
     * Get document by ID
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists || doc.data().isDeleted) return null;
        return doc.data();
    }

    /**
     * Update a document
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
     * Soft delete a document
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

module.exports = BaseService;
