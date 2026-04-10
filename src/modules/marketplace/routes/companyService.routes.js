const express = require('express');
const router = express.Router();
const companyServiceController = require('../controllers/companyService.controller');
const { companyServiceValidator } = require('../validators/marketplace.validator');

router.post('/', companyServiceValidator, companyServiceController.create);
router.get('/', companyServiceController.getAll);
router.get('/:id', companyServiceController.getById);
router.put('/:id', companyServiceController.update);
router.delete('/:id', companyServiceController.delete);

module.exports = router;
