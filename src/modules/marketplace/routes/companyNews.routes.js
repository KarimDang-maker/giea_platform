const express = require('express');
const router = express.Router();
const companyNewsController = require('../controllers/companyNews.controller');
const { companyNewsValidator } = require('../validators/marketplace.validator');

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
 *     summary: Create a new company news
 *     tags: [CompanyNews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyNews'
 *     responses:
 *       201:
 *         description: News created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyNews'
 *       400:
 *         description: Invalid input or page not found
 */
router.post('/', companyNewsValidator, companyNewsController.create);

/**
 * @swagger
 * /api/marketplace/company-news:
 *   get:
 *     summary: List all company news
 *     tags: [CompanyNews]
 *     parameters:
 *       - in: query
 *         name: companyPageId
 *         schema:
 *           type: string
 *         description: Filter by company page ID
 *     responses:
 *       200:
 *         description: List of news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyNews'
 */
router.get('/', companyNewsController.getAll);

/**
 * @swagger
 * /api/marketplace/company-news/{id}:
 *   get:
 *     summary: Get a news by ID
 *     tags: [CompanyNews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyNews'
 *       404:
 *         description: News not found
 */
router.get('/:id', companyNewsController.getById);

/**
 * @swagger
 * /api/marketplace/company-news/{id}:
 *   put:
 *     summary: Update a news
 *     tags: [CompanyNews]
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
 *       404:
 *         description: News not found
 */
router.put('/:id', companyNewsController.update);

/**
 * @swagger
 * /api/marketplace/company-news/{id}:
 *   delete:
 *     summary: Soft delete a news
 *     tags: [CompanyNews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 */
router.delete('/:id', companyNewsController.delete);

module.exports = router;
