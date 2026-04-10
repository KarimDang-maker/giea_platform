const express = require('express');
const router = express.Router();
const companyPageController = require('../controllers/companyPage.controller');
const { companyPageValidator } = require('../validators/marketplace.validator');

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
 *     summary: Create a new company page
 *     tags: [CompanyPages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyPage'
 *     responses:
 *       201:
 *         description: Company page created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyPage'
 *       400:
 *         description: Invalid input or user not found
 */
router.post('/', companyPageValidator, companyPageController.create);

/**
 * @swagger
 * /api/marketplace/company-pages:
 *   get:
 *     summary: List all company pages
 *     tags: [CompanyPages]
 *     parameters:
 *       - in: query
 *         name: idUser
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: List of company pages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyPage'
 */
router.get('/', companyPageController.getAll);

/**
 * @swagger
 * /api/marketplace/company-pages/{id}:
 *   get:
 *     summary: Get a company page by ID
 *     tags: [CompanyPages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company page details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyPage'
 *       404:
 *         description: Page not found
 */
router.get('/:id', companyPageController.getById);

/**
 * @swagger
 * /api/marketplace/company-pages/{id}:
 *   put:
 *     summary: Update a company page
 *     tags: [CompanyPages]
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
 *       404:
 *         description: Page not found
 */
router.put('/:id', companyPageController.update);

/**
 * @swagger
 * /api/marketplace/company-pages/{id}:
 *   delete:
 *     summary: Soft delete a company page (cascade)
 *     tags: [CompanyPages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page and related entities deleted successfully
 *       404:
 *         description: Page not found
 */
router.delete('/:id', companyPageController.delete);

module.exports = router;
