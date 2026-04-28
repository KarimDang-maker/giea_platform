/**
 * @swagger
 * /api/projet/creer-projet:
 *   post:
 *     summary: Créer un nouveau projet
 *     description: Permet à un utilisateur de créer un projet. Le secteur et le sous-secteur sont automatiquement normalisés ou créés dans le référentiel global.
 *     tags: [Projets]
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
 *         $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 */

/**
 * @swagger
 * /api/projet/liste-projets:
 *   get:
 *     summary: Lister mes projets (Entrepreneur)
 *     description: Récupère uniquement les projets dont l'utilisateur est le porteur.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de vos projets récupérée
 *       401:
 *         description: Non authentifié
 */

/**
 * @swagger
 * /api/projet/mon-projet/{id}:
 *   get:
 *     summary: Obtenir un projet spécifique (Propriétaire/Admin)
 *     description: Accès restreint au porteur du projet ou aux administrateurs.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du projet
 *     responses:
 *       200:
 *         description: Détails du projet récupérés
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé (Vous n'êtes pas propriétaire)
 *       404:
 *         description: Projet introuvable
 */

/**
 * @swagger
 * /api/projet/secteur/{secteurId}:
 *   get:
 *     summary: Lister les projets par secteur (Admin uniquement)
 *     description: Permet à l'administration de filtrer tous les projets par ID de catégorie.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: secteurId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la catégorie secteur
 *     responses:
 *       200:
 *         description: Liste des projets filtrée par secteur
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès restreint aux administrateurs
 */

/**
 * @swagger
 * /api/projet/update-projet/{id}:
 *   put:
 *     summary: Mettre à jour les infos de base (Propriétaire/Admin)
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               secteur:
 *                 type: string
 *                 description: Nom du nouveau secteur ou ID existant
 *               sousSecteur:
 *                 type: string
 *                 description: Nom de la sous-catégorie
 *               montantRecherche:
 *                 type: number
 *               financement:
 *                 type: string
 *               niveauMaturite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Projet mis à jour
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /api/projet/supprime-projet/{id}:
 *   delete:
 *     summary: Supprimer un projet complet (Propriétaire/Admin)
 *     description: Supprime le document Firestore et tous les fichiers Storage associés.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projet et documents supprimés
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Projet introuvable
 */

/**
 * @swagger
 * /api/projet/{id}/membres:
 *   post:
 *     summary: Ajouter un membre à l'équipe (Propriétaire/Admin)
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembreProjet'
 *     responses:
 *       201:
 *         description: Membre ajouté
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /api/projet/{id}/membres/{membreId}:
 *   delete:
 *     summary: Retirer un membre (Propriétaire/Admin)
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: membreId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Membre retiré
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Membre ou projet introuvable
 */

/**
 * @swagger
 * /api/projet/{id}/documents:
 *   post:
 *     summary: Uploader un document (Propriétaire/Admin)
 *     description: Enregistre le fichier dans Storage et ajoute l'entrée dans le projet.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fichier:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 enum: [business_plan, presentation, etude_de_marche, autre]
 *               nomDoc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploadé avec succès
 *       400:
 *         description: Format de fichier invalide ou manquant
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /api/projet/{id}/documents/{docId}:
 *   delete:
 *     summary: Supprimer un document (Propriétaire/Admin)
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document supprimé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Document introuvable
 */

/**
 * @swagger
 * /api/projet/admin/tous:
 *   get:
 *     summary: Voir tous les projets (Admin uniquement)
 *     description: Liste globale sans restriction de propriété.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste complète récupérée
 *       403:
 *         description: Réservé à l'administration
 */

/**
 * @swagger
 * /api/projet/{id}/statut:
 *   patch:
 *     summary: Évaluer/Valider un projet (Admin uniquement)
 *     description: Permet de changer le statut et d'ajouter une suggestion pour le porteur.
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [statut]
 *             properties:
 *               statut:
 *                 type: string
 *               suggestion:
 *                 type: string
 *                 description: Commentaire de l'admin expliquant le changement de statut
 *     responses:
 *       200:
 *         description: Statut changé
 *       400:
 *         description: Transition de statut non autorisée
 *       403:
 *         description: Réservé à l'administration
 *       404:
 *         description: Projet introuvable
 */