const express = require('express');
const userLogController = require('../controllers/userLog.controller');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { adminOnly } = require('../../authentication/middleware/role.middleware');

const router = express.Router();

// Protection globale
router.use(authMiddleware);
router.use(adminOnly);

// Route de lecture JSON
router.get('/logs/users', userLogController.getUserLogs);

// Route d'export PDF binaire
router.get('/logs/users/export', userLogController.exportUserLogs);

module.exports = router;