const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { roleMiddleware, adminOnly } = require('../../authentication/middleware/role.middleware');
const upload = require('../middlewares/upload.middleware');
const estProprietaire = require('../middlewares/owner.middleware');

// --- Protection Globale : Toutes les routes ci-dessous nécessitent une connexion ---
router.use(authMiddleware);
const roleAcces = roleMiddleware('admin', 'entrepreneur');

/**
 * @swagger
 * /api/projet/creer-projet:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Projet'
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post('/creer-projet', roleAcces, projetController.creerProjet);

/**
 * @swagger
 * /api/projet/liste-projets:
 *   get:
 *     summary: Lister mes projets
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des projets
 *       401:
 *         description: Non authentifié
 */
router.get('/liste-projets', roleAcces, projetController.listerMesProjets);

/**
 * @swagger
 * /api/projet/mon-projet/{id}:
 *   get:
 *     summary: Obtenir un projet spécifique
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Détails du projet
 *       404:
 *         description: Projet non trouvé
 *       401:
 *         description: Non authentifié
 */
router.get('/mon-projet/:id', roleAcces, estProprietaire, projetController.obtenirProjet);

/**
 * @swagger
 * /api/projet/update-projet/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Projet mis à jour
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.put('/update-projet/:id', roleAcces, estProprietaire, projetController.mettreAJourInfos);

/**
 * @swagger
 * /api/projet/supprime-projet/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet supprimé
 *       404:
 *         description: Projet non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/supprime-projet/:id', roleAcces, estProprietaire, projetController.supprimerProjet);

// Gestion des membres
/**
 * @swagger
 * /api/projet/{id}/membres:
 *   post:
 *     summary: Ajouter un membre au projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembreProjet'
 *     responses:
 *       200:
 *         description: Membre ajouté
 *       400:
 *         description: Erreur
 *       401:
 *         description: Non authentifié
 */
router.post('/:id/membres', roleAcces, estProprietaire, projetController.ajouterMembre);

/**
 * @swagger
 * /api/projet/{id}/membres/{membreId}:
 *   delete:
 *     summary: Retirer un membre du projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *       - in: path
 *         name: membreId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du membre
 *     responses:
 *       200:
 *         description: Membre retiré
 *       404:
 *         description: Membre non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id/membres/:membreId', roleAcces, estProprietaire, projetController.retirerMembre);

// Gestion des documents
/**
 * @swagger
 * /api/projet/{id}/documents:
 *   post:
 *     summary: Ajouter un document au projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fichier:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à uploader
 *               type:
 *                 type: string
 *                 enum: [business_plan, presentation, etude_de_marche, autre]
 *               nomDoc:
 *                 type: string
 *                 example: "Mon Business Plan"
 *     responses:
 *       200:
 *         description: Document ajouté
 *       400:
 *         description: Erreur
 *       401:
 *         description: Non authentifié
 */
router.post('/:id/documents', roleAcces, estProprietaire, upload.single('fichier'), projetController.ajouterDocument);

/**
 * @swagger
 * /api/projet/{id}/documents/{docId}:
 *   delete:
 *     summary: Supprimer un document du projet
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du document
 *     responses:
 *       200:
 *         description: Document supprimé
 *       404:
 *         description: Document non trouvé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id/documents/:docId', roleAcces, estProprietaire, projetController.supprimerDocument);

// --- Routes Admin ---
/**
 * @swagger
 * /api/projet/admin/tous:
 *   get:
 *     summary: Lister tous les projets (Admin)
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les projets
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.get('/admin/tous', adminOnly, projetController.listerTousLesProjets);

/**
 * @swagger
 * /api/projet/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'un projet (Admin)
 *     tags:
 *       - Projets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 example: approuve
 *     responses:
 *       200:
 *         description: Statut changé
 *       400:
 *         description: Erreur
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 */
router.patch('/:id/statut', adminOnly, projetController.changerStatut);

module.exports = router;