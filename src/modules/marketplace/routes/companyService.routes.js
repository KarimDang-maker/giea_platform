const express = require('express');
const router = express.Router();
const companyServiceController = require('../controllers/companyService.controller');
const { companyServiceValidator } = require('../utils/validators');
const { roleMiddleware } = require('../../authentication/middleware/role.middleware');


// Middleware for write operations (entrepreneur or admin)
const entrepreneurOrAdmin = roleMiddleware('entrepreneur', 'admin');

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
 *     summary: Create a new company service (Entrepreneur/Admin only)
 *     tags: [CompanyServices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyService'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', entrepreneurOrAdmin, companyServiceValidator, companyServiceController.create);

/**
 * @swagger
 * /api/marketplace/company-services:
 *   get:
 *     summary: List all company services
 *     tags: [CompanyServices]
 *     security:
 *       - bearerAuth: []
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
 */
router.get('/', companyServiceController.getAll);

/**
 * @swagger
 * /api/marketplace/company-services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [CompanyServices]
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
 *         description: Service details
 *       404:
 *         description: Service not found
 */
router.get('/:id', companyServiceController.getById);

/**
 * @swagger
 * /api/marketplace/company-services/{id}:
 *   put:
 *     summary: Update a service (Entrepreneur/Admin only)
 *     tags: [CompanyServices]
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
 *             $ref: '#/components/schemas/CompanyService'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.put('/:id', entrepreneurOrAdmin, companyServiceValidator, companyServiceController.update);

/**
 * @swagger
 * /api/marketplace/company-services/{id}:
 *   delete:
 *     summary: Soft delete a service (Entrepreneur/Admin only)
 *     tags: [CompanyServices]
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
 *         description: Service deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Service not found
 */
router.delete('/:id', entrepreneurOrAdmin, companyServiceController.delete);

module.exports = router;
