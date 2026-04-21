const express = require('express');
const router = express.Router();
const companyNewsController = require('../controllers/companyNews.controller');
const { companyNewsValidator } = require('../utils/validators');
const { roleMiddleware } = require('../../authentication/middleware/role.middleware');


// Middleware for write operations (entrepreneur or admin)
const entrepreneurOrAdmin = roleMiddleware('entrepreneur', 'admin');

/**
 * @swagger
 * tags:
 *   name: CompanyNews
 *   description: Management of company news
 */

/**
 * @swagger
 * /api/marketplace/company-news:
 *   post:
 *     summary: Create a new company news (Entrepreneur/Admin only)
 *     tags: [CompanyNews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyNews'
 *     responses:
 *       201:
 *         description: News created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', entrepreneurOrAdmin, companyNewsValidator, companyNewsController.create);

/**
 * @swagger
 * /api/marketplace/company-news:
 *   get:
 *     summary: List all company news
 *     tags: [CompanyNews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: companyPageId
 *         schema:
 *           type: string
 *         description: Filter by company page ID
 *     responses:
 *       200:
 *         description: List of news
 */
router.get('/', companyNewsController.getAll);

/**
 * @swagger
 * /api/marketplace/company-news/{id}:
 *   get:
 *     summary: Get a news by ID
 *     tags: [CompanyNews]
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
 *         description: News details
 *       404:
 *         description: News not found
 */
router.get('/:id', companyNewsController.getById);

/**
 * @swagger
 * /api/marketplace/company-news/{id}:
 *   put:
 *     summary: Update a news (Entrepreneur/Admin only)
 *     tags: [CompanyNews]
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
 *             $ref: '#/components/schemas/CompanyNews'
 *     responses:
 *       200:
 *         description: News updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News not found
 */
router.put('/:id', entrepreneurOrAdmin, companyNewsValidator, companyNewsController.update);

/**
 * @swagger
 * /api/marketplace/company-news/{id}:
 *   delete:
 *     summary: Soft delete a news (Entrepreneur/Admin only)
 *     tags: [CompanyNews]
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
 *         description: News deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News not found
 */
router.delete('/:id', entrepreneurOrAdmin, companyNewsController.delete);

module.exports = router;
