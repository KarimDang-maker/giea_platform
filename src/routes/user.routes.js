const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { checkAbility, adminOnly } = require('../middleware/role.middleware');
const { validationRules, handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// User profile - read own profile
router.get(
  '/profile/:userId',
  checkAbility('read', 'Profile'),
  userController.getUserById
);

// Update profile
router.put(
  '/profile',
  checkAbility('update', 'Profile'),
  validationRules.updateProfile,
  handleValidationErrors,
  userController.updateProfile
);

// Avatar upload
router.post(
  '/avatar',
  checkAbility('update', 'Profile'),
  userController.uploadAvatar
);

// Preferences
router.put(
  '/preferences',
  checkAbility('update', 'Profile'),
  userController.updatePreferences
);

// Change password
router.post(
  '/change-password',
  checkAbility('update', 'Profile'),
  validationRules.changePassword,
  handleValidationErrors,
  userController.changePassword
);

// Search users
router.get(
  '/search',
  checkAbility('read', 'Profile'),
  userController.searchUsers
);

// Deactivate account - admin only
router.delete(
  '/deactivate',
  adminOnly,
  userController.deactivateAccount
);

module.exports = router;
