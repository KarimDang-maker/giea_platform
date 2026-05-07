const express = require('express');
const { dashboardController } = require('../controllers');
const { authMiddleware } = require('../../authentication/middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Personal user dashboard with activities, recommendations, and quick links (Authenticated users only)
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get user personalized dashboard
 *     description: Retrieve the complete personalized dashboard with recent activities, recommendations, quick links, and user statistics. This is the main dashboard endpoint.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Dashboard'
 *                 message:
 *                   type: string
 *                   example: Dashboard retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, dashboardController.getDashboard);

/**
 * @swagger
 * /api/dashboard/refresh:
 *   post:
 *     summary: Refresh dashboard data
 *     description: Refresh all dashboard data including activities, recommendations, and user statistics. Call this to get the latest data.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Dashboard'
 *                 message:
 *                   type: string
 *                   example: Dashboard refreshed successfully
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh', authMiddleware, dashboardController.refreshDashboard);

/**
 * @swagger
 * /api/dashboard/statistics:
 *   get:
 *     summary: Get user statistics
 *     description: Retrieve user-specific statistics including project count, resource count, profile completion percentage, and user role.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProjects:
 *                       type: integer
 *                       example: 5
 *                       description: Number of projects created by user
 *                     totalResources:
 *                       type: integer
 *                       example: 12
 *                       description: Number of resources uploaded
 *                     profileCompletion:
 *                       type: integer
 *                       example: 75
 *                       description: Profile completion percentage (0-100)
 *                     role:
 *                       type: string
 *                       example: student
 *                       enum: [student, entrepreneur, company, investor, mentor, admin]
 *                     joinedDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *                 message:
 *                   type: string
 *                   example: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
router.get('/statistics', authMiddleware, dashboardController.getStatistics);

module.exports = router;
