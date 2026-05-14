const express = require('express');
const adminUserController = require('../controllers/adminUser.controller');
const { authMiddleware } = require('../../authentication/middleware/auth.middleware');
const { authValidationRules, handleAuthValidationErrors } = require('../../authentication/utils/validators');
const { adminOnly } = require('../../authentication/middleware/role.middleware');
const upload = require('../../../config/multer');

const router = express.Router();

// Toutes les routes de ce routeur sont réservées aux administrateurs.
router.use(authMiddleware);
router.use(adminOnly);

router.post('/users/create', authValidationRules.adminCreateUser, handleAuthValidationErrors, adminUserController.createUser);
router.get('/users', adminUserController.getAllUsers);
router.post('/users/:userId/approve', adminUserController.approveUser);
router.post('/users/:userId/suspend', adminUserController.suspendUser);
router.post('/users/:userId/activate', adminUserController.activateUser);
router.put('/users/:userId/role', adminUserController.changeUserRole);
router.get('/users/:userId/profile', adminUserController.getUserProfile);
router.delete('/users/:userId', adminUserController.deleteUser);
router.post('/members/import', adminUserController.importMembers);
router.post('/members/import-excel', upload.single('file'), adminUserController.importMembersFromExcel);
router.get('/users/:userId/membership-status', adminUserController.getMembershipStatus);
router.get('/members', adminUserController.getAllGieaMembers);

module.exports = router;
