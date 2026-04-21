const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { createCategoryValidator } = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category and subcategory management operations
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     description: Retrieve all active categories. Can be filtered by type.
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of category to filter by (e.g., user_role, business_classification)
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       subCategories:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: The category data
 *       404:
 *         description: Category not found
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Project Bearer'
 *               description:
 *                 type: string
 *                 example: 'Users who carry a project'
 *               type:
 *                 type: string
 *                 enum: [user_role, business_classification, project_type, other]
 *                 example: 'user_role'
 *               subCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Tech', 'Agriculture']
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', createCategoryValidator, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (soft delete)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete('/:id', categoryController.deleteCategory);

/**
 * @swagger
 * /api/categories/{id}/subcategories:
 *   post:
 *     summary: Add a subcategory to an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subCategory
 *             properties:
 *               subCategory:
 *                 type: string
 *                 example: 'SaaS'
 *     responses:
 *       200:
 *         description: Subcategory added
 *       400:
 *         description: Subcategory already exists or invalid data
 *       404:
 *         description: Category not found
 */
router.post('/:id/subcategories', categoryController.addSubCategory);

/**
 * @swagger
 * /api/categories/{id}/subcategories/{subCategory}:
 *   delete:
 *     summary: Remove a subcategory from an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subCategory
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory removed
 *       404:
 *         description: Category not found
 */
router.delete('/:id/subcategories/:subCategory', categoryController.removeSubCategory);

module.exports = router;
