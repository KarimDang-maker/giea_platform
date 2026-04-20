const BaseRepository = require('./base.repository');
const { CompanyService } = require('../models');

class CompanyServiceRepository extends BaseRepository {
    constructor() {
        super('companyServices', CompanyService);
    }
}

module.exports = new CompanyServiceRepository();
