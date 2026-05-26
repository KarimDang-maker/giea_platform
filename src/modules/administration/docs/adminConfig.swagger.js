/**
 * @swagger
 * /api/admin/config:
 *   get:
 *     summary: Récupérer la configuration globale de la plateforme
 *     description: Récupère tous les paramètres actifs de la plateforme (identité visuelle, sécurité, état des modules et textes légaux). L'accès est restreint aux administrateurs.
 *     tags: [Administration (Configuration)]
 *     responses:
 *       200:
 *         description: Configuration récupérée avec succès
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
 *                   example: "Configuration de la plateforme récupérée avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     general:
 *                       type: object
 *                       properties:
 *                         nomPlateforme:
 *                           type: string
 *                           example: 'GIEA'
 *                         logo:
 *                           type: string
 *                           example: 'https://storage.googleapis.com/giea-bucket/platform/branding/logo_official.png'
 *                         email:
 *                           type: string
 *                           example: 'contact@giea.cm'
 *                     securite:
 *                       type: object
 *                       properties:
 *                         dureeSession:
 *                           type: integer
 *                           example: 60
 *                         tentativesConnexionMax:
 *                           type: integer
 *                           example: 5
 *                     modules:
 *                       type: object
 *                       properties:
 *                         marketplace:
 *                           type: boolean
 *                           example: false
 *                         formation:
 *                           type: boolean
 *                           example: true
 *                     langues:
 *                       type: object
 *                       properties:
 *                         defaut:
 *                           type: string
 *                           example: 'fr'
 *                     legal:
 *                       type: object
 *                       properties:
 *                         cgu:
 *                           type: string
 *                           example: 'Texte des CGU...'
 *       401:
 *         description: Non authentifié - Token manquant ou expiré
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/admin/config:
 *   patch:
 *     summary: Modifier la configuration globale de la plateforme
 *     description: Met à jour partiellement ou totalement les configurations. Le format multipart/form-data est requis pour le fichier binaire du logo. Les autres blocs doivent être envoyés sous forme de chaînes JSON stringifiées.
 *     tags: [Administration (Configuration)]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image pour le logo de la plateforme
 *               general:
 *                 type: string
 *                 example: '{"nomPlateforme":"GIEA","email":"contact@giea.cm"}'
 *               securite:
 *                 type: string
 *                 example: '{"dureeSession":30,"tentativesConnexionMax":3}'
 *               modules:
 *                 type: string
 *                 example: '{"marketplace":true,"formation":false}'
 *               langues:
 *                 type: string
 *                 example: '{"defaut":"fr"}'
 *               legal:
 *                 type: string
 *                 example: '{"cgu":"Nouveau texte..."}'
 *     responses:
 *       200:
 *         description: Configuration mise à jour avec succès
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
 *                   example: "Configuration globale mise à jour avec succès"
 *       400:
 *         description: Format de fichier invalide ou bloc JSON mal formé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       500:
 *         description: Erreur serveur
 */