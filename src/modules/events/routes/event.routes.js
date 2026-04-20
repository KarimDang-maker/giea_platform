const express = require('express');
const router = express.Router();
const { eventController } = require('../controllers');
const { authMiddleware, optionalAuth } = require('../../authentication/middleware/auth.middleware');

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Créer un événement
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, location, startDate, endDate]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               location: { type: string }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *               coverImage: { type: string }
 *     responses:
 *       201:
 *         description: Événement créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erreur de validation
 * 
 *   get:
 *     summary: Lister les événements
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: upcoming
 *         schema: { type: boolean }
 *       - in: query
 *         name: createdBy
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 * 
 * /api/events/{id}:
 *   get:
 *     summary: Détail de l'événement (enrichi)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail complet (event + sessions + registrations count)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *                 sessions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventSession'
 *                 registrationsCount:
 *                   type: integer
 *       404:
 *         description: Événement non trouvé
 * 
 *   put:
 *     summary: Modifier un événement
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Événement mis à jour
 * 
 *   delete:
 *     summary: Supprimer un événement
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Événement supprimé
 */
router.post('/', authMiddleware, eventController.create);
router.get('/', optionalAuth, eventController.findAll);
router.get('/:id', optionalAuth, eventController.findById);
router.put('/:id', authMiddleware, eventController.update);
router.delete('/:id', authMiddleware, eventController.delete);

module.exports = router;
