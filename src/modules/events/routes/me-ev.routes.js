const express = require('express');
const router = express.Router();
const { meController } = require('../controllers');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');

/**
 * @swagger
 * /api/me/events:
 *   get:
 *     summary: Lister mes événements (inscriptions)
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de mes événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 * 
 * /api/me/sessions:
 *   get:
 *     summary: Lister mes sessions (participations)
 *     tags: [Me]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de mes sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventSession'
 */
router.get('/events', authMiddleware, meController.getMyEvents);
router.get('/sessions', authMiddleware, meController.getMySessions);

module.exports = router;
