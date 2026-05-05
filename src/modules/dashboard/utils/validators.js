const { body, param, validationResult } = require('express-validator');

/**
 * Activity and Recommendation Validators
 */

// Validate activity ID
const activityIdValidationRules = () => {
  return [
    param('id').trim().notEmpty().withMessage('Activity ID is required')
  ];
};

// Validate recommendation ID
const recommendationIdValidationRules = () => {
  return [
    param('id').trim().notEmpty().withMessage('Recommendation ID is required')
  ];
};

// Validate activity type
const activityTypeValidationRules = () => {
  return [
    param('type')
      .trim()
      .notEmpty()
      .withMessage('Activity type is required')
  ];
};

// Validate recommendation type
const recommendationTypeValidationRules = () => {
  return [
    param('type')
      .trim()
      .notEmpty()
      .withMessage('Recommendation type is required')
  ];
};

// Validate cleanup parameters
const cleanupValidationRules = () => {
  return [
    body('days')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Days must be a positive integer')
  ];
};

// Validate pagination parameters
const paginationValidationRules = () => {
  return [
    body('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ];
};

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  activityIdValidationRules,
  recommendationIdValidationRules,
  activityTypeValidationRules,
  recommendationTypeValidationRules,
  cleanupValidationRules,
  paginationValidationRules,
  handleValidationErrors
};
