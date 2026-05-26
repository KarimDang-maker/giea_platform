const express = require('express');
const adminLogController = require('../controllers/adminLog.controller');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { adminOnly } = require('../../authentication/middleware/role.middleware');

const router = express.Router();

/**
 * Déclaration de la route de consultation des logs admins
 * HTTP Méthode : GET
 * Endpoint : /logs/admins
 */
router.get('/logs/admins',authMiddleware,adminOnly,adminLogController.getAdminLogs);

/**
 * Déclaration de la route d'export PDF des logs admins
 * HTTP Méthode : GET
 * Endpoint : /logs/admins/export
 */
router.get('/logs/admins/export',authMiddleware,adminOnly,adminLogController.exportAdminLogs);

module.exports = router;