const BaseRepository = require('./base.repository');
const { CompanyNews } = require('../models');

class CompanyNewsRepository extends BaseRepository {
    constructor() {
        super('companyNews', CompanyNews);
    }
}

module.exports = new CompanyNewsRepository();
