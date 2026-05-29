/**
 * @swagger
 * /api/admin/projet/details/{id}:
 *   get:
 *     summary: Récupérer les détails complets d'un projet unique
 *     description: Permet à un administrateur d'accéder à l'intégralité des informations d'un projet spécifique via son identifiant unique, y compris l'équipe, les documents et les suggestions associées.
 *     tags: [Administration (gestion des projets)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique du projet à récupérer
 *     responses:
 *       200:
 *         description: Détails du projet récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Projet'
 *       401:
 *         description: Non authentifié (Token manquant ou invalide)
 *       403:
 *         description: Accès refusé - Réservé aux administrateurs
 *       404:
 *         description: Projet introuvable en base de données
 */

/**
 * @swagger
 * /api/admin/projets/touslister:
 *   get:
 *     summary: Lister et filtrer l'ensemble des projets soumis
 *     description: Renvoie la liste globale des projets en appliquant les critères de filtrage passés en paramètres de requête. Retourne également les filtres qui ont été appliqués.
 *     tags: [Administration (gestion des projets)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [soumis, en_evaluation, en_revision, bancable, rejete, archivé]
 *         description: Filtrer les projets par leur statut actuel.
 *       - in: query
 *         name: secteur
 *         schema:
 *           type: string
 *         description: Filtrer par l'identifiant ou le nom du secteur d'activité.
 *       - in: query
 *         name: estPublie
 *         schema:
 *           type: boolean
 *         description: Filtrer selon que le projet soit publié (true) ou non (false) sur la marketplace.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Clé de filtrage par date de création (optionnelle).
 *     responses:
 *       200:
 *         description: Liste filtrée des projets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Liste des projets récupéré"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Projet'
 *                 filters:
 *                   type: object
 *                   properties:
 *                     statut:
 *                       type: string
 *                       nullable: true
 *                       example: "en_evaluation"
 *                     secteur:
 *                       type: string
 *                       nullable: true
 *                       example: "Environnement"
 *                     estPublie:
 *                       type: string
 *                       nullable: true
 *                       example: "false"
 *                     date:
 *                       type: string
 *                       nullable: true
 *                       example: "2026-05-22"
 *       400:
 *         description: Erreur lors de la récupération des projets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des projets : [Message d'erreur]"
 */
/**
 * @swagger
 * /api/admin/projet/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'un projet (Évaluation, Révision, Validation, Rejet)
 *     description: Permet à un administrateur de faire progresser le projet dans son cycle de vie. Applique les règles de transition métier définies côté serveur.
 *     tags: [Administration (gestion des projets)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant unique du projet à modifier
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
 *                 enum: [soumis, en_evaluation, en_revision, bancable, rejete, archivé]
 *                 example: "en_evaluation"
 *                 description: Le nouveau statut cible à appliquer au projet.
 *               raisonRejet:
 *                 type: string
 *                 example: "Le modèle financier n'est pas réaliste sur le marché local."
 *                 description: Requis uniquement si le statut passe à 'rejete'.
 *     responses:
 *       200:
 *         description: Statut du projet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Statut du projet mis à jour avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Projet'
 *       400:
 *         description: Requête invalide (Transition de statut interdite par les règles métiers ou paramètre manquant)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Projet introuvable
 */

/**
 * @swagger
 * /api/admin/projet-supprime/{id}:
 *   delete:
 *     summary: Supprimer définitivement ou archiver un projet par l'administrateur
 *     description: Permet à l'administrateur de nettoyer la base de données ou de supprimer un projet ne respectant pas les conditions de la plateforme.
 *     tags: [Administration (gestion des projets)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du projet à supprimer
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReponseMessage'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Projet introuvable
 */