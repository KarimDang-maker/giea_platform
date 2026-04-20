const BaseService = require('./base.service');
const { companyNewsRepository } = require('../repositories');

class CompanyNewsService extends BaseService {
    constructor() {
        super(companyNewsRepository);
    }
}

module.exports = new CompanyNewsService();
