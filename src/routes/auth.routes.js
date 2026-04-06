const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { validationRules, handleValidationErrors } = require('../utils/helpers');

const router = express.Router();

// Register
router.post(
  '/register',
  validationRules.register,
  handleValidationErrors,
  authController.register
);

// Email verification
router.post('/verify-email', authController.verifyEmail);

// Login
router.post(
  '/login',
  validationRules.login,
  handleValidationErrors,
  authController.login
);

// Logout
router.post('/logout', authController.logout);

// Forgot password
router.post(
  '/forgot-password',
  validationRules.forgotPassword,
  handleValidationErrors,
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password',
  validationRules.resetPassword,
  handleValidationErrors,
  authController.resetPassword
);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

// Facebook OAuth
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  authController.facebookCallback
);

module.exports = router;
