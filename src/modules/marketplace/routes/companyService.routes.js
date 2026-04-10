const express = require('express');
const router = express.Router();
const companyServiceController = require('../controllers/companyService.controller');
const { companyServiceValidator } = require('../validators/marketplace.validator');

/**
 * @swagger
 * tags:
 *   name: CompanyServices
 *   description: Management of company services
 */

/**
 * @swagger
 * /api/marketplace/company-services:
 *   post:
 *     summary: Create a new company service
 *     tags: [CompanyServices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyService'
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyService'
 *       400:
 *         description: Invalid input or page not found
 */
router.post('/', companyServiceValidator, companyServiceController.create);

/**
 * @swagger
 * /api/marketplace/company-services:
 *   get:
 *     summary: List all company services
 *     tags: [CompanyServices]
 *     parameters:
 *       - in: query
 *         name: companyPageId
 *         schema:
 *           type: string
 *         description: Filter by company page ID
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CompanyService'
 */
router.get('/', companyServiceController.getAll);

/**
 * @swagger
 * /api/marketplace/company-services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [CompanyServices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyService'
 *       404:
 *         description: Service not found
 */
router.get('/:id', companyServiceController.getById);

/**
 * @swagger
 * /api/marketplace/company-services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [CompanyServices]
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
 *             $ref: '#/components/schemas/CompanyService'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 */
router.put('/:id', companyServiceController.update);

/**
 * @swagger
 * /api/marketplace/company-services/{id}:
 *   delete:
 *     summary: Soft delete a service
 *     tags: [CompanyServices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */
router.delete('/:id', companyServiceController.delete);

module.exports = router;
