const BaseService = require('./base.service');
const { companyServiceRepository } = require('../repositories');

class CompanyServiceService extends BaseService {
    constructor() {
        super(companyServiceRepository);
    }
}

module.exports = new CompanyServiceService();
