const express = require('express');
const router = express.Router();
const companyProductController = require('../controllers/companyProduct.controller');
const { companyProductValidator } = require('../utils/validators');
const { roleMiddleware } = require('../../authentication/middleware/role.middleware');

// Middleware for write operations (entrepreneur or admin)
const entrepreneurOrAdmin = roleMiddleware('entrepreneur', 'admin');

/**
 * @swagger
 * tags:
 *   name: CompanyProducts
 *   description: Management of company products
 */

/**
 * @swagger
 * /api/marketplace/company-products:
 *   post:
 *     summary: Create a new product (Entrepreneur/Admin only)
 *     tags: [CompanyProducts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyProduct'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', entrepreneurOrAdmin, companyProductValidator, companyProductController.create);

/**
 * @swagger
 * /api/marketplace/company-products:
 *   get:
 *     summary: List all products
 *     tags: [CompanyProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyPageId
 *         schema:
 *           type: string
 *         description: Filter by company page ID
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', companyProductController.getAll);

/**
 * @swagger
 * /api/marketplace/company-products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [CompanyProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:id', companyProductController.getById);

/**
 * @swagger
 * /api/marketplace/company-products/{id}:
 *   put:
 *     summary: Update a product (Entrepreneur/Admin only)
 *     tags: [CompanyProducts]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/CompanyProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.put('/:id', entrepreneurOrAdmin, companyProductValidator, companyProductController.update);

/**
 * @swagger
 * /api/marketplace/company-products/{id}:
 *   delete:
 *     summary: Soft delete a product (Entrepreneur/Admin only)
 *     tags: [CompanyProducts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
router.delete('/:id', entrepreneurOrAdmin, companyProductController.delete);

module.exports = router;
