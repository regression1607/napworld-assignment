const { body, query, validationResult } = require('express-validator');
const { setupLogger } = require('../utils/logger');

const logger = setupLogger();

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    
    logger.warn('Validation errors', { 
      path: req.path, 
      method: req.method, 
      errors: errorMessages 
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Validators for signup
const signupValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
];

// Validators for login
const loginValidators = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
];

// Validators for creating a post
const postValidators = [
  body('postName')
    .trim()
    .notEmpty().withMessage('Post name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Post name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('imageUrl')
    .optional()
    .isURL().withMessage('Image URL must be valid')
];

// Validators for getting posts with filters
const postFilterValidators = [
  query('searchText')
    .optional()
    .trim(),
  
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),
  
  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid date'),
  
  query('tags')
    .optional()
    .customSanitizer(value => {
      // Convert comma-separated string to array
      if (typeof value === 'string') {
        return value.split(',').map(tag => tag.trim());
      }
      return value;
    }),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt()
];

module.exports = {
  validate,
  signupValidators,
  loginValidators,
  postValidators,
  postFilterValidators
}; 