class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Create a new document
     * @param {Object} data 
     * @returns {Promise<Object>} Created document
     */
    async create(data) {
        return this.repository.create(data);
    }

    /**
     * Get all active documents
     * @param {Object} filters optional filters
     * @returns {Promise<Array>} List of documents
     */
    async findAll(filters = {}) {
        return this.repository.findAll(filters);
    }

    /**
     * Get document by ID
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    async findById(id) {
        return this.repository.findById(id);
    }

    /**
     * Update a document
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<Object|null>}
     */
    async update(id, data) {
        return this.repository.update(id, data);
    }

    /**
     * Soft delete a document
     * @param {string} id 
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        return this.repository.delete(id);
    }
}

module.exports = BaseService;
