const express = require('express');
const router = express.Router();
const companyPageController = require('../controllers/companyPage.controller');
const { companyPageValidator } = require('../validators/marketplace.validator');

router.post('/', companyPageValidator, companyPageController.create);
router.get('/', companyPageController.getAll);
router.get('/:id', companyPageController.getById);
router.put('/:id', companyPageController.update);
router.delete('/:id', companyPageController.delete);

module.exports = router;
