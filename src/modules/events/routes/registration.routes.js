const express = require('express');
const router = express.Router();
const { eventRegistrationController } = require('../controllers');
const { authMiddleware, optionalAuth } = require('../../authentication/middleware/auth.middleware');

/**
 * @swagger
 * /api/events/{eventId}/register:
 *   post:
 *     summary: S'inscrire à un événement
 *     tags: [Event Registrations]
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
 *             required: [has_account]
 *             properties:
 *               has_account: { type: boolean }
 *               email: { type: string }
 *               fullName: { type: string }
 *               idUser: { type: string }
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventRegistration'
 * 
 * /api/events/{eventId}/participants:
 *   get:
 *     summary: Lister les participants d'un événement
 *     tags: [Event Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, cancelled] }
 *     responses:
 *       200:
 *         description: Liste des participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventRegistration'
 * 
 * /api/events/{eventId}/participants/{id}:
 *   patch:
 *     summary: Modifier le statut d'une inscription
 *     tags: [Event Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [pending, confirmed, cancelled] }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 * 
 *   delete:
 *     summary: Annuler une inscription
 *     tags: [Event Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inscription annulée
 */
router.post('/:eventId/register', optionalAuth, eventRegistrationController.register);
router.get('/:eventId/participants', authMiddleware, eventRegistrationController.findByEvent);
router.patch('/:eventId/participants/:id', authMiddleware, eventRegistrationController.updateStatus);
router.delete('/:eventId/participants/:id', authMiddleware, eventRegistrationController.cancel);

module.exports = router;
