const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');

// All marketplace routes require authentication
router.use(authMiddleware);

// Routes
router.use('/companies', require('./companyPage.routes'));
router.use('/company-pages', require('./companyPage.routes'));
router.use('/company-news', require('./companyNews.routes'));
router.use('/company-services', require('./companyService.routes'));
router.use('/company-products', require('./companyProduct.routes'));

module.exports = router;
