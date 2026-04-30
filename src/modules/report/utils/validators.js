const { body, query, param, validationResult } = require('express-validator');

/**
 * Report validation rules
 */
const reportValidationRules = () => [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .optional()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('reportType')
    .optional()
    .isIn(['activity', 'analytics', 'custom']).withMessage('Invalid report type'),
  
  body('scope')
    .optional()
    .isIn(['platform', 'users', 'projects', 'marketplace']).withMessage('Invalid scope'),
  
  body('periodStart')
    .optional()
    .isISO8601().withMessage('Invalid date format for periodStart'),
  
  body('periodEnd')
    .optional()
    .isISO8601().withMessage('Invalid date format for periodEnd'),
  
  body('format')
    .optional()
    .isIn(['json', 'csv', 'pdf']).withMessage('Invalid format'),
];

/**
 * Statistics generation validation rules
 */
const statisticsGenerationRules = () => [
  body('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid period'),
];

/**
 * Report scheduling validation rules
 */
const reportSchedulingRules = () => [
  body('recipients')
    .isArray({ min: 1 }).withMessage('Recipients must be a non-empty array'),
  
  body('recipients.*')
    .isEmail().withMessage('Each recipient must be a valid email address'),
  
  body('frequency')
    .optional()
    .isIn(['daily', 'weekly', 'monthly']).withMessage('Invalid frequency'),
];

/**
 * Query parameters validation for date ranges
 */
const dateRangeValidationRules = () => [
  query('startDate')
    .notEmpty().withMessage('startDate is required')
    .isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
  
  query('endDate')
    .notEmpty().withMessage('endDate is required')
    .isISO8601().withMessage('endDate must be a valid ISO 8601 date'),
];

/**
 * Report ID validation
 */
const reportIdValidationRules = () => [
  param('id')
    .trim()
    .notEmpty().withMessage('Report ID is required'),
];

/**
 * Report type validation for query
 */
const reportTypeValidationRules = () => [
  param('type')
    .isIn(['activity', 'analytics', 'custom']).withMessage('Invalid report type'),
];

/**
 * Archive validation
 */
const archiveValidationRules = () => [
  body('days')
    .optional()
    .isInt({ min: 1 }).withMessage('Days must be a positive integer'),
];

/**
 * Custom error handler for validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  reportValidationRules,
  statisticsGenerationRules,
  reportSchedulingRules,
  dateRangeValidationRules,
  reportIdValidationRules,
  reportTypeValidationRules,
  archiveValidationRules,
  handleValidationErrors
};
