const BaseRepository = require('./base.repository');
const { CompanyProduct } = require('../models');

class CompanyProductRepository extends BaseRepository {
    constructor() {
        super('companyProducts', CompanyProduct);
    }
}

module.exports = new CompanyProductRepository();
