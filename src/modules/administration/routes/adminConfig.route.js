const express = require('express');
const upload = require('../../../config/multer');
const adminConfigController = require('../controllers/adminConfig.controller');

// Importation de tes middlewares de sécurité
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { adminOnly } = require('../../authentication/middleware/role.middleware');

const router = express.Router();

router.get('/config', authMiddleware,adminOnly,adminConfigController.getPlatformConfig);
router.patch('/config',authMiddleware,adminOnly,upload.single('logo'),adminConfigController.updatePlatformConfig);

module.exports = router;