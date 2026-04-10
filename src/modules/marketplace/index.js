const express = require('express');
const router = express.Router();

router.use('/company-pages', require('./routes/companyPage.routes'));
router.use('/company-news', require('./routes/companyNews.routes'));
router.use('/company-services', require('./routes/companyService.routes'));

module.exports = router;
