const express = require('express');
const { reportController } = require('../controllers');
const { authMiddleware } = require('../../authentication/middleware');
const { adminMiddleware } = require('../middleware');
const {
  reportValidationRules,
  reportSchedulingRules,
  reportIdValidationRules,
  reportTypeValidationRules,
  archiveValidationRules,
  handleValidationErrors
} = require('../utils/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Activity reports and analytics (Admin only)
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create activity report
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               scope:
 *                 type: string
 *                 enum: [platform, users, projects, marketplace]
 *               periodStart:
 *                 type: string
 *                 format: date-time
 *               periodEnd:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Report created successfully
 */
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  reportValidationRules(),
  handleValidationErrors,
  reportController.createActivityReport
);

/**
 * @swagger
 * /api/reports/analytics:
 *   post:
 *     summary: Create analytics report
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               scope:
 *                 type: string
 *     responses:
 *       201:
 *         description: Analytics report created successfully
 */
router.post(
  '/analytics',
  authMiddleware,
  adminMiddleware,
  reportValidationRules(),
  handleValidationErrors,
  reportController.createAnalyticsReport
);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports (with optional filters)
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [generated, scheduled, archived]
 *       - in: query
 *         name: reportType
 *         schema:
 *           type: string
 *           enum: [activity, analytics, custom]
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [platform, users, projects, marketplace]
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 */
router.get('/', authMiddleware, adminMiddleware, reportController.getAllReports);

/**
 * @swagger
 * /api/reports/type/{type}:
 *   get:
 *     summary: Get reports by type
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [activity, analytics, custom]
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 */
router.get(
  '/type/:type',
  authMiddleware,
  adminMiddleware,
  reportTypeValidationRules(),
  handleValidationErrors,
  reportController.getReportsByType
);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 */
router.get(
  '/:id',
  authMiddleware,
  adminMiddleware,
  reportIdValidationRules(),
  handleValidationErrors,
  reportController.getReport
);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update report
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Report updated successfully
 */
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  reportIdValidationRules(),
  handleValidationErrors,
  reportController.updateReport
);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete report
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted successfully
 */
router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  reportIdValidationRules(),
  handleValidationErrors,
  reportController.deleteReport
);

/**
 * @swagger
 * /api/reports/{id}/schedule:
 *   post:
 *     summary: Schedule report for distribution
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipients
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *     responses:
 *       200:
 *         description: Report scheduled successfully
 */
router.post(
  '/:id/schedule',
  authMiddleware,
  adminMiddleware,
  reportIdValidationRules(),
  reportSchedulingRules(),
  handleValidationErrors,
  reportController.scheduleReportDistribution
);

/**
 * @swagger
 * /api/reports/{id}/unschedule:
 *   post:
 *     summary: Unschedule report
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report unscheduled successfully
 */
router.post(
  '/:id/unschedule',
  authMiddleware,
  adminMiddleware,
  reportIdValidationRules(),
  handleValidationErrors,
  reportController.unscheduleReport
);

/**
 * @swagger
 * /api/reports/{id}/export:
 *   get:
 *     summary: Export report
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *           default: json
 *     responses:
 *       200:
 *         description: Report exported successfully
 */
router.get(
  '/:id/export',
  authMiddleware,
  adminMiddleware,
  reportIdValidationRules(),
  handleValidationErrors,
  reportController.exportReport
);

/**
 * @swagger
 * /api/reports/archive:
 *   post:
 *     summary: Archive old reports
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: integer
 *                 default: 180
 *     responses:
 *       200:
 *         description: Reports archived successfully
 */
router.post(
  '/archive',
  authMiddleware,
  adminMiddleware,
  archiveValidationRules(),
  handleValidationErrors,
  reportController.archiveOldReports
);

module.exports = router;
