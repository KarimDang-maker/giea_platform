const express = require('express');
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const upload = require('../../../config/multer');

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
 */
router.get('/profile/:userId', userController.getUserById);

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
 *               bio:
 *                 type: string
 *                 description: Professional bio
 *               company:
 *                 type: string
 *                 description: Company name
 *               location:
 *                 type: string
 *                 description: Location/City
 *               website:
 *                 type: string
 *                 description: Personal website or portfolio URL
 *               specialization:
 *                 type: string
 *                 description: Area of specialization
 *               yearsOfExperience:
 *                 type: integer
 *                 description: Years of professional experience
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', userController.updateProfile);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     description: Upload avatar image in any format (JPEG, PNG, GIF, WebP, TIFF, BMP, SVG, etc.)
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
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (any image type accepted)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid file or no file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Firebase storage error
 */
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);

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
 *               emailNotifications:
 *                 type: boolean
 *               smsNotifications:
 *                 type: boolean
 *               privateProfile:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated
 */
router.put('/preferences', userController.updatePreferences);

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
 */
router.post('/change-password', userController.changePassword);

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
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', userController.searchUsers);

/**
 * @swagger
 * /api/users/deactivate:
 *   delete:
 *     summary: Deactivate user account
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated
 */
router.delete('/deactivate', userController.deactivateAccount);

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
 */
router.get('/skills', userController.getSkills);

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
 *               yearsOf:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill added successfully
 */
router.post('/skills', userController.addSkill);

/**
 * @swagger
 * /api/users/skills/{skillId}:
 *   get:
 *     summary: Get a specific skill by ID
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
 *         description: Skill details
 *       404:
 *         description: Skill not found
 */
router.get('/skills/:skillId', userController.getSkill);

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
router.put('/skills/:skillId', userController.updateSkill);

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
router.delete('/skills/:skillId', userController.removeSkill);

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
 */
router.get('/documents', userController.getDocuments);

/**
 * @swagger
 * /api/users/documents:
 *   post:
 *     summary: Upload a document
 *     description: Upload a document file (PDF, Word, Excel, PowerPoint, or plain text). Maximum file size is 10MB.
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
 *       400:
 *         description: Invalid file
 *       404:
 *         description: User not found
 *       500:
 *         description: Firebase storage error
 */
router.post('/documents', upload.single('file'), userController.uploadDocument);

/**
 * @swagger
 * /api/users/documents/{documentId}:
 *   get:
 *     summary: Get document details
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
 *         description: Document details
 */
router.delete('/documents/:documentId', userController.removeDocument);

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
router.put('/documents/:documentId', userController.updateDocumentInfo);

module.exports = router;
