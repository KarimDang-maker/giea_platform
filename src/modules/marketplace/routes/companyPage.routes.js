const express = require('express');
const router = express.Router();
const companyPageController = require('../controllers/companyPage.controller');
const { companyPageValidator } = require('../utils/validators');
const { roleMiddleware } = require('../../authentication/middleware/role.middleware');


// Middleware for write operations (entrepreneur or admin)
const entrepreneurOrAdmin = roleMiddleware('entrepreneur', 'admin');

/**
 * @swagger
 * tags:
 *   name: CompanyPages
 *   description: Management of company pages
 */

/**
 * @swagger
 * /api/marketplace/company-pages:
 *   post:
 *     summary: Create a new company page (Entrepreneur/Admin only)
 *     tags: [CompanyPages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyPage'
 *     responses:
 *       201:
 *         description: Company page created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Entrepreneur/Admin role required
 *       400:
 *         description: Invalid input
 */
router.post('/', entrepreneurOrAdmin, companyPageValidator, companyPageController.create);

/**
 * @swagger
 * /api/marketplace/companies:
 *   get:
 *     summary: List all companies (alias for company-pages)
 *     tags: [CompanyPages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get('/', companyPageController.getAll);

/**
 * @swagger
 * /api/marketplace/company-pages:
 *   get:
 *     summary: List all company pages
 *     tags: [CompanyPages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idUser
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: List of company pages
 */
router.get('/', companyPageController.getAll);

/**
 * @swagger
 * /api/marketplace/company-pages/{id}:
 *   get:
 *     summary: Get a company page by ID
 *     tags: [CompanyPages]
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
 *         description: Company page details
 *       404:
 *         description: Page not found
 */
router.get('/:id', companyPageController.getById);

/**
 * @swagger
 * /api/marketplace/company-pages/{id}:
 *   put:
 *     summary: Update a company page (Entrepreneur/Admin only)
 *     tags: [CompanyPages]
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
 *             $ref: '#/components/schemas/CompanyPage'
 *     responses:
 *       200:
 *         description: Company page updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Page not found
 */
router.put('/:id', entrepreneurOrAdmin, companyPageValidator, companyPageController.update);

/**
 * @swagger
 * /api/marketplace/company-pages/{id}:
 *   delete:
 *     summary: Soft delete a company page (Entrepreneur/Admin only)
 *     tags: [CompanyPages]
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
 *         description: Page and related entities deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Page not found
 */
router.delete('/:id', entrepreneurOrAdmin, companyPageController.delete);

module.exports = router;
