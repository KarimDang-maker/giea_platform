const express = require('express');
const { activityController } = require('../controllers');
const { authMiddleware } = require('../../authentication/middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Activities
 *     description: User activity tracking and management
 */

/**
 * @swagger
 * /api/dashboard/activities:
 *   get:
 *     summary: Get recent activities
 *     description: Retrieve a list of recent activities for the authenticated user, including project updates, comments, resources, and other platform activities.
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of activities to retrieve
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
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
 *                     $ref: '#/components/schemas/Activity'
 *                 message:
 *                   type: string
 *                   example: Activities retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch activities
 */
router.get('/', authMiddleware, activityController.getRecentActivities);

/**
 * @swagger
 * /api/dashboard/activities/type/{type}:
 *   get:
 *     summary: Get activities by type
 *     description: Filter user activities by type (project_created, comment_added, resource_uploaded, etc.)
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: project_created
 *         description: Activity type to filter by (project_created, project_updated, comment_added, resource_uploaded, message_received, etc.)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *           maximum: 100
 *         description: Number of activities to retrieve
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Activity'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch activities
 */
router.get('/type/:type', authMiddleware, activityController.getActivitiesByType);

/**
 * @swagger
 * /api/dashboard/activities/unread/count:
 *   get:
 *     summary: Get unread activities count
 *     description: Get the total count of unread activities for the current user
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
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
 *                     unreadCount:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: Unread count retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch unread count
 */
router.get('/unread/count', authMiddleware, activityController.getUnreadCount);

/**
 * @swagger
 * /api/dashboard/activities/{id}/read:
 *   post:
 *     summary: Mark activity as read
 *     description: Mark a specific activity as read
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123def456
 *         description: Activity ID
 *     responses:
 *       200:
 *         description: Activity marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Activity marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to mark activity as read
 */
router.post('/:id/read', authMiddleware, activityController.markAsRead);

/**
 * @swagger
 * /api/dashboard/activities/read-all:
 *   post:
 *     summary: Mark all activities as read
 *     description: Mark all unread activities as read for the current user
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All activities marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All activities marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to mark all activities as read
 */
router.post('/read-all', authMiddleware, activityController.markAllAsRead);

/**
 * @swagger
 * /api/dashboard/activities/cleanup:
 *   post:
 *     summary: Clean up old activities
 *     description: Delete activities older than the specified number of days (default 90 days)
 *     tags:
 *       - Activities
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: integer
 *                 default: 90
 *                 minimum: 1
 *                 example: 90
 *                 description: Delete activities older than this many days
 *           example:
 *             days: 90
 *     responses:
 *       200:
 *         description: Old activities deleted
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
 *                     deletedCount:
 *                       type: integer
 *                       example: 15
 *                 message:
 *                   type: string
 *                   example: 15 old activities deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to cleanup old activities
 */
router.post('/cleanup', authMiddleware, activityController.cleanupOldActivities);

module.exports = router;
