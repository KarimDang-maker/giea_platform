const BaseService = require('./base.service');
const { companyProductRepository } = require('../repositories');

class CompanyProductService extends BaseService {
    constructor() {
        super(companyProductRepository);
    }
}

module.exports = new CompanyProductService();
