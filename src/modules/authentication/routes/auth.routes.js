const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { authValidationRules, handleAuthValidationErrors } = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: TestPass123!
 *               role:
 *                 type: string
 *                 enum: [student, entrepreneur, company, investor, mentor, admin]
 *                 example: student
 *               adminTestMode:
 *                 type: boolean
 *                 example: false
 *                 description: "Option de test Swagger : si true et role=admin, le compte est créé directement approuvé pour permettre l'accès immédiat. À utiliser uniquement pour les tests."
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Validation error or email already exists
 */
router.post(
  '/register',
  authValidationRules.register,
  handleAuthValidationErrors,
  authController.register
);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               token:
 *                 type: string
 *                 example: abc123def456...
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
router.post('/verify-email', authController.verifyEmail);

/**
 * @swagger
 * /api/auth/verify-email-link:
 *   get:
 *     summary: Verify email via clickable link (from email)
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
router.get('/verify-email-link', authController.verifyEmailLink);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: TestPass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  authValidationRules.login,
  handleAuthValidationErrors,
  authController.login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset - Send OTP via email
 *     tags:
 *       - Authentication (OTP-based Password Reset)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent to email if account exists
 *       400:
 *         description: Email is required
 */
router.post(
  '/forgot-password',
  authValidationRules.forgotPassword,
  handleAuthValidationErrors,
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/verify-password-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags:
 *       - Authentication (OTP-based Password Reset)
 *     description: |
 *       Verify the OTP sent to user's email.
 *       Email is retrieved from session (stored in Step 1).
 *       User can then proceed to reset password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: 6-digit OTP sent to email
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired OTP, or session expired
 */
router.post('/verify-password-otp', authController.verifyPasswordOTP);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags:
 *       - Authentication (OTP-based Password Reset)
 *     description: |
 *       Reset password after OTP verification.
 *       Email and verified OTP are retrieved from session.
 *       Steps: 1) forgot-password → 2) verify-password-otp → 3) reset-password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPass123!
 *                 description: New password (minimum 8 characters)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPass123!
 *                 description: Confirm new password (must match)
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid passwords, session expired, or verification not completed
 */
router.post('/reset-password', authController.resetPasswordWithOTP);

/**
 * ============================================
 * ❌ OLD TOKEN-BASED PASSWORD RESET ROUTES (COMMENTED OUT - DO NOT USE)
 * ============================================
 */

/*
// Old route: Get password reset link from email
router.get('/verify-password-reset', authController.verifyPasswordResetLink);

// Old route: Verify password reset token (mobile)
router.post('/verify-password-reset-token', authController.verifyPasswordResetToken);

// Old route: Reset password from link
router.post('/reset-password-from-link', authController.resetPasswordFromLink);
*/

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags:
 *       - OAuth
 *     responses:
 *       307:
 *         description: Redirect to Google OAuth
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - OAuth
 *     responses:
 *       307:
 *         description: Redirect to application with token
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

module.exports = router;
