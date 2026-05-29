/**
 * @swagger
 * /api/admin/logs/admins:
 *   get:
 *     summary: Consulter les logs d'activité des administrateurs
 *     description: Récupère la liste des actions et événements systèmes déclenchés par les administrateurs. Possibilité de filtrer et de paginer les résultats. Accès restreint aux administrateurs.
 *     tags: [Administration (Gestion des Logs)]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de logs à récupérer par page
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filtrer par type d'action (ex. create_category, update_config)
 *     responses:
 *       200:
 *         description: Liste des logs récupérée avec succès
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "65f1234abcde567890f1f2f3"
 *                       adminId:
 *                         type: string
 *                         example: "65e9876fedcba3210fedcba9"
 *                       adminName:
 *                         type: string
 *                         example: "Armel"
 *                       action:
 *                         type: string
 *                         example: "update_config"
 *                       description:
 *                         type: string
 *                         example: "Mise à jour du logo de la plateforme"
 *                       ipAddress:
 *                         type: string
 *                         example: "192.168.1.100"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-05-26T20:25:00.000Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 87
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 9
 *       401:
 *         description: Non authentifié - Token manquant ou expiré
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       500:
 *         description: Erreur serveur lors de la récupération des logs
 */

/**
 * @swagger
 * /api/admin/logs/admins/export:
 *   get:
 *     summary: Exporter les logs d'activité au format PDF
 *     description: Génère et télécharge un document PDF contenant l'historique des actions des administrateurs. Les mêmes filtres que la route de consultation sont disponibles. Accès restreint aux administrateurs.
 *     tags: [Administration (Gestion des Logs)]
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filtrer les logs exportés par type d'action (ex. create_category, update_config)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de la page à exporter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de logs à inclure dans le PDF
 *     responses:
 *       200:
 *         description: Le fichier PDF des logs a été généré avec succès
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié - Token manquant ou expiré
 *       403:
 *         description: Accès refusé - Droits administrateur requis
 *       500:
 *         description: Erreur serveur lors de la génération du PDF
 */