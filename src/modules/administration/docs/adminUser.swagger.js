/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Renvoie une liste filtrée des comptes utilisateurs avec leurs statuts et rôles.
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filtrer par rôle
 *       - in: query
 *         name: statusAccount
 *         schema:
 *           type: string
 *         description: Filtrer par statut de compte
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filtrer par activité du compte
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UtilisateurPublic'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Créer un utilisateur avec rôle par un administrateur
 *     description: Permet à un administrateur de créer un utilisateur. Le compte est directement approuvé et l'utilisateur peut se connecter immédiatement. L'admin renseigne l'essentiel (nom, email, password, rôle). L'utilisateur complètera son profil après connexion.
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCreateUser'
 *     responses:
 *       201:
 *         description: Utilisateur créé et directement approuvé par l'administrateur - accès immédiat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé et approuvé par l'administrateur - accès immédiat"
 *                 data:
 *                   $ref: '#/components/schemas/UtilisateurPublic'
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/users/{userId}/approve:
 *   post:
 *     summary: Approuver un utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à approuver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DemandMessageAdmin'
 *     responses:
 *       200:
 *         description: Utilisateur approuvé
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/users/{userId}/suspend:
 *   post:
 *     summary: Suspendre un compte utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à suspendre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DemandRaisonAdmin'
 *     responses:
 *       200:
 *         description: Compte suspendu
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/users/{userId}/activate:
 *   post:
 *     summary: Réactiver un compte utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à réactiver
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactiveMessageAdmin'
 *     responses:
 *       200:
 *         description: Compte activé
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   put:
 *     summary: Changer le rôle d'un utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DemandChangementRoleAdmin'
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/users/{userId}/profile:
 *   get:
 *     summary: Obtenir le profil d'un utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UtilisateurPublic'
 *       403:
 *         description: Accès réservé aux administrateurs
 *       404:
 *         description: Utilisateur introuvable
 */

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReponseMessage'
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/members/import:
 *   post:
 *     summary: Importer des membres GIEA via JSON
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DemandImportMembres'
 *     responses:
 *       200:
 *         description: Membres importés
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReponseMessage'
 *       400:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/members/import-excel:
 *   post:
 *     summary: Importer des membres GIEA depuis un fichier Excel
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier importé avec succès
 *       400:
 *         $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/users/{userId}/membership-status:
 *   get:
 *     summary: Obtenir le statut de membership GIEA d'un utilisateur
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Statut de membership récupéré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReponseStatutMembership'
 *       403:
 *         description: Accès réservé aux administrateurs
 */

/**
 * @swagger
 * /api/admin/members:
 *   get:
 *     summary: Récupérer tous les membres GIEA actifs
 *     tags: [Administration (gestion des utilisateurs et validation de compte)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membres GIEA récupérés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MembreGiea'
 *       403:
 *         description: Accès réservé aux administrateurs
 */
