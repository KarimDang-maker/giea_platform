const express = require('express');
const router = express.Router();
const companyNewsController = require('../controllers/companyNews.controller');
const { companyNewsValidator } = require('../validators/marketplace.validator');

router.post('/', companyNewsValidator, companyNewsController.create);
router.get('/', companyNewsController.getAll);
router.get('/:id', companyNewsController.getById);
router.put('/:id', companyNewsController.update);
router.delete('/:id', companyNewsController.delete);

module.exports = router;
