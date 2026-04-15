const { validationResult } = require('express-validator');
const { body } = require('express-validator');

// Auth-specific validation rules
const authValidationRules = {
  register: [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/),
    body('role')
      .optional()
      .isIn(['student', 'entrepreneur', 'investor', 'mentor', 'company', 'admin'])
      .withMessage('Invalid role'),
  ],

  login: [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],

  forgotPassword: [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],

  resetPassword: [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/),
  ],

  updateProfile: [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('phone')
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage('Invalid phone number'),
    body('website')
      .optional()
      .isURL()
      .withMessage('Invalid website URL'),
  ],

  changePassword: [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/),
  ],
};

// Auth-specific error handler
const handleAuthValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array(),
    });
  }
  next();
};

// Auth-specific response formatters
const formatUserResponse = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified,
    profile: user.profile,
    createdAt: user.createdAt,
  };
};

module.exports = {
  authValidationRules,
  handleAuthValidationErrors,
  formatUserResponse,
};
