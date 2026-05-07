const express = require('express');
const { statisticsController } = require('../controllers');
const { authMiddleware } = require('../../authentication/middleware');
const { adminMiddleware } = require('../middleware');
const {
  statisticsGenerationRules,
  handleValidationErrors
} = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: Platform statistics and analytics (Admin only)
 */

/**
 * @swagger
 * /api/statistics/latest:
 *   get:
 *     summary: Get latest statistics
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the most recent comprehensive statistics
 *     responses:
 *       200:
 *         description: Latest statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Statistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin role required)
 */
router.get('/latest', authMiddleware, adminMiddleware, statisticsController.getLatestStatistics);

/**
 * @swagger
 * /api/statistics/period:
 *   get:
 *     summary: Get statistics by period
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, yearly]
 *           default: monthly
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/period', authMiddleware, adminMiddleware, statisticsController.getStatisticsByPeriod);

/**
 * @swagger
 * /api/statistics/trends:
 *   get:
 *     summary: Get statistics trends over a date range
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Statistics trends retrieved successfully
 */
router.get('/trends', authMiddleware, adminMiddleware, statisticsController.getStatisticsTrends);

/**
 * @swagger
 * /api/statistics/generate:
 *   post:
 *     summary: Generate comprehensive statistics
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               period:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *     responses:
 *       201:
 *         description: Statistics generated successfully
 */
router.post(
  '/generate',
  authMiddleware,
  adminMiddleware,
  statisticsGenerationRules(),
  handleValidationErrors,
  statisticsController.generateStatistics
);

/**
 * @swagger
 * /api/statistics/users:
 *   get:
 *     summary: Get user statistics
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
router.get('/users', authMiddleware, adminMiddleware, statisticsController.getUserStatistics);

/**
 * @swagger
 * /api/statistics/projects:
 *   get:
 *     summary: Get project statistics
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project statistics retrieved successfully
 */
router.get('/projects', authMiddleware, adminMiddleware, statisticsController.getProjectStatistics);

/**
 * @swagger
 * /api/statistics/marketplace:
 *   get:
 *     summary: Get marketplace statistics
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Marketplace statistics retrieved successfully
 */
router.get('/marketplace', authMiddleware, adminMiddleware, statisticsController.getMarketplaceStatistics);

module.exports = router;
