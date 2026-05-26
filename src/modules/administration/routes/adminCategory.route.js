const express = require('express');
const router = express.Router();
const adminCategoryController = require('../controllers/adminCategory.controller');
const { createCategoryValidator } = require('../../categories/utils/validators');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { adminOnly } = require('../../authentication/middleware/role.middleware');

router.use(authMiddleware);
router.use(adminOnly);

router.get('/list-category', adminCategoryController.getCategories);
router.get('/category/:id', adminCategoryController.getCategoryById);
router.post('/create-category', adminCategoryController.createCategory);
router.put('/update-category/:id', adminCategoryController.updateCategory);
router.delete('/supprime-category/:id', adminCategoryController.deleteCategory);
router.post('/:id/add-subcategories', adminCategoryController.addSubCategory);
router.delete('/:id/retirer-subcategories/:subCategory', adminCategoryController.removeSubCategory);

module.exports = router;
