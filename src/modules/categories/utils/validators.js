const { body } = require('express-validator');

exports.createCategoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .trim(),
  body('type')
    .notEmpty()
    .withMessage('Category type is required')
    .isIn(['user_role', 'business_classification', 'project_type', 'other'])
    .withMessage('Invalid category type'),
  body('subCategories')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array')
];
