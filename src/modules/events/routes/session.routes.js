const express = require('express');
const router = express.Router();
const { eventSessionController, sessionParticipantController } = require('../controllers');
const { authMiddleware, optionalAuth } = require('../../authentication/middleware/auth.middleware');
const { isAdmin, isAdminOrEventCreatorForSession, isAdminOrCreatorOrSessionParticipantOwner } = require('../middleware/events.middleware');

// Root is /api/events or /api/sessions depending on mounting
// Mounted at /api/events
/**
 * @swagger
 * /api/events/{eventId}/sessions:
 *   post:
 *     summary: Créer une session pour un événement
 *     tags: [Event Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, startTime, endTime]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               type: { type: string }
 *               speakerName: { type: string }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *               maxParticipants: { type: integer }
 *     responses:
 *       201:
 *         description: Session créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventSession'
 * 
 *   get:
 *     summary: Lister les sessions d'un événement
 *     tags: [Event Sessions]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventSession'
 */
router.post('/:eventId/sessions', authMiddleware, isAdmin, eventSessionController.create);
router.get('/:eventId/sessions', authMiddleware, eventSessionController.findByEvent);

// Also need separate routes for session-specific actions
// These will be mounted at /api/sessions
const sessionRouter = express.Router();

/**
 * @swagger
 * /api/sessions/{sessionId}:
 *   put:
 *     summary: Modifier une session
 *     tags: [Event Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Session mise à jour
 * 
 *   delete:
 *     summary: Supprimer une session
 *     tags: [Event Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Session supprimée
 * 
 * /api/sessions/{sessionId}/join:
 *   post:
 *     summary: S'inscrire à une session (via inscription événement)
 *     tags: [Session Participants]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [registrationId]
 *             properties:
 *               registrationId: { type: string, description: "ID de l'inscription à l'événement parent" }
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionParticipant'
 * 
 * /api/sessions/{sessionId}/participants:
 *   get:
 *     summary: Lister les participants d'une session
 *     tags: [Session Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SessionParticipant'
 * 
 * /api/sessions/{sessionId}/participants/{id}:
 *   delete:
 *     summary: Quitter une session
 *     tags: [Session Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Désinscription réussie
 */
sessionRouter.put('/:sessionId', authMiddleware, isAdmin, eventSessionController.update);
sessionRouter.delete('/:sessionId', authMiddleware, isAdminOrEventCreatorForSession, eventSessionController.delete);

// Participants
sessionRouter.post('/:sessionId/join', authMiddleware, sessionParticipantController.join);
sessionRouter.get('/:sessionId/participants', authMiddleware, isAdminOrEventCreatorForSession, sessionParticipantController.findBySession);
sessionRouter.delete('/:sessionId/participants/:id', authMiddleware, isAdminOrCreatorOrSessionParticipantOwner, sessionParticipantController.leave);

module.exports = {
    eventSessionRoutes: router,
    sessionSpecificRoutes: sessionRouter
};
