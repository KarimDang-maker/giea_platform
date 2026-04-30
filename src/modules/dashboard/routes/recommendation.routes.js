const express = require('express');
const { recommendationController } = require('../controllers');
const { authMiddleware } = require('../../authentication/middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Recommendations
 *     description: Personalized recommendations for users based on role and activity
 */

/**
 * @swagger
 * /api/dashboard/recommendations:
 *   get:
 *     summary: Get active recommendations
 *     description: Retrieve personalized recommendations for the user. Recommendations are based on user role (student, entrepreneur, investor, etc.) and include projects, resources, connections, and learning materials.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 50
 *         description: Number of recommendations to retrieve
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
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
 *                     $ref: '#/components/schemas/Recommendation'
 *                 message:
 *                   type: string
 *                   example: Recommendations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch recommendations
 */
router.get('/', authMiddleware, recommendationController.getRecommendations);

/**
 * @swagger
 * /api/dashboard/recommendations/type/{type}:
 *   get:
 *     summary: Get recommendations by type
 *     description: Filter recommendations by type. Examples - project (project opportunities), resource (learning materials), connection (network suggestions), skill (skill development), category (area recommendations), etc.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           example: project
 *         description: Recommendation type (project, resource, connection, skill, category, etc.)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of recommendations to retrieve
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
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
 *                     $ref: '#/components/schemas/Recommendation'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch recommendations
 */
router.get('/type/:type', authMiddleware, recommendationController.getRecommendationsByType);

/**
 * @swagger
 * /api/dashboard/recommendations/generate:
 *   post:
 *     summary: Generate new recommendations
 *     description: |
 *       Generate fresh personalized recommendations based on the user's role.
 *       Role-specific recommendations:
 *       - Students: project and resource recommendations
 *       - Entrepreneurs: investor connections and business tools
 *       - Investors: investment opportunities
 *       - Companies: talent recommendations
 *       - All users: community event recommendations
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Recommendations generated successfully
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
 *                     $ref: '#/components/schemas/Recommendation'
 *                 message:
 *                   type: string
 *                   example: Recommendations generated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to generate recommendations
 */
router.post('/generate', authMiddleware, recommendationController.generateRecommendations);

/**
 * @swagger
 * /api/dashboard/recommendations/{id}/dismiss:
 *   post:
 *     summary: Dismiss recommendation
 *     description: Dismiss (reject) a recommendation. The recommendation will no longer appear in the active recommendations list.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: abc123def456
 *         description: Recommendation ID
 *     responses:
 *       200:
 *         description: Recommendation dismissed
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
 *                   example: Recommendation dismissed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to dismiss recommendation
 */
router.post('/:id/dismiss', authMiddleware, recommendationController.dismissRecommendation);

/**
 * @swagger
 * /api/dashboard/recommendations/cleanup:
 *   post:
 *     summary: Clean up expired recommendations
 *     description: Delete all expired recommendations for the current user. Recommendations expire based on their expiresAt timestamp.
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired recommendations deleted
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
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: 3 expired recommendations deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to cleanup expired recommendations
 */
router.post('/cleanup', authMiddleware, recommendationController.cleanupExpiredRecommendations);

module.exports = router;
