const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../modules/authentication/middleware/auth.middleware');
const { checkAbility, adminOnly } = require('../middleware/role.middleware');
const { validationRules, handleValidationErrors } = require('../utils/helpers');
const upload = require('../config/multer');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/users/profile/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User email or ID
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get(
  '/profile/:userId',
  checkAbility('read', 'Profile'),
  userController.getUserById
);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               location:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */
router.put(
  '/profile',
  checkAbility('update', 'Profile'),
  validationRules.updateProfile,
  handleValidationErrors,
  userController.updateProfile
);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid file
 */
router.post(
  '/avatar',
  checkAbility('update', 'Profile'),
  upload.single('avatar'),
  userController.uploadAvatar
);

/**
 * @swagger
 * /api/users/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               notifications:
 *                 type: boolean
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Preferences updated
 */
router.put(
  '/preferences',
  checkAbility('update', 'Profile'),
  userController.updatePreferences
);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password
 */
router.post(
  '/change-password',
  checkAbility('update', 'Profile'),
  validationRules.changePassword,
  handleValidationErrors,
  userController.changePassword
);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(
  '/search',
  checkAbility('read', 'Profile'),
  userController.searchUsers
);

/**
 * @swagger
 * /api/users/deactivate:
 *   delete:
 *     summary: Deactivate user account (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated
 *       403:
 *         description: Admin access required
 */
router.delete(
  '/deactivate',
  adminOnly,
  userController.deactivateAccount
);

// ========== SKILLS ROUTES ==========

/**
 * @swagger
 * /api/users/skills:
 *   get:
 *     summary: Get all user skills
 *     tags:
 *       - Skills
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       level:
 *                         type: string
 *                       yearsOf:
 *                         type: number
 *                       category:
 *                         type: string
 *                 total:
 *                   type: number
 */
router.get(
  '/skills',
  checkAbility('read', 'Profile'),
  userController.getSkills
);

/**
 * @swagger
 * /api/users/skills:
 *   post:
 *     summary: Add a new skill
 *     tags:
 *       - Skills
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: JavaScript
 *               level:
 *                 type: string
 *                 enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
 *                 example: Expert
 *               yearsOf:
 *                 type: number
 *                 example: 5
 *               category:
 *                 type: string
 *                 example: Programming
 *     responses:
 *       201:
 *         description: Skill added successfully
 */
router.post(
  '/skills',
  checkAbility('update', 'Profile'),
  userController.addSkill
);

/**
 * @swagger
 * /api/users/skills/{skillId}:
 *   put:
 *     summary: Update a skill
 *     tags:
 *       - Skills
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: string
 *               yearsOf:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully
 */
router.put(
  '/skills/:skillId',
  checkAbility('update', 'Profile'),
  userController.updateSkill
);

/**
 * @swagger
 * /api/users/skills/{skillId}:
 *   delete:
 *     summary: Remove a skill
 *     tags:
 *       - Skills
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill removed successfully
 */
router.delete(
  '/skills/:skillId',
  checkAbility('update', 'Profile'),
  userController.removeSkill
);

// ========== DOCUMENTS ROUTES ==========

/**
 * @swagger
 * /api/users/documents:
 *   get:
 *     summary: Get all user documents
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       url:
 *                         type: string
 *                       uploadedAt:
 *                         type: string
 *                       fileSize:
 *                         type: number
 *                 total:
 *                   type: number
 */
router.get(
  '/documents',
  checkAbility('read', 'Profile'),
  userController.getDocuments
);

/**
 * @swagger
 * /api/users/documents:
 *   post:
 *     summary: Upload a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               documentType:
 *                 type: string
 *                 example: resume
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 */
router.post(
  '/documents',
  checkAbility('update', 'Profile'),
  upload.single('file'),
  userController.uploadDocument
);

/**
 * @swagger
 * /api/users/documents/{documentId}:
 *   delete:
 *     summary: Remove a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document removed successfully
 */
router.delete(
  '/documents/:documentId',
  checkAbility('update', 'Profile'),
  userController.removeDocument
);

/**
 * @swagger
 * /api/users/documents/{documentId}:
 *   put:
 *     summary: Update document information
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document info updated successfully
 */
router.put(
  '/documents/:documentId',
  checkAbility('update', 'Profile'),
  userController.updateDocumentInfo
);

module.exports = router;
