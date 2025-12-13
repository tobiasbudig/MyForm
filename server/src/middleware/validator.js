const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Validation middleware to check for validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      errors: errors.array(),
      url: req.url,
      body: req.body,
    });

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }

  next();
};

/**
 * Validators for submission endpoints
 */
const submissionValidators = {
  start: [
    body('formId')
      .trim()
      .notEmpty()
      .withMessage('formId is required')
      .isLength({ max: 255 })
      .withMessage('formId must be less than 255 characters'),
    handleValidationErrors,
  ],

  saveAnswer: [
    body('questionId')
      .trim()
      .notEmpty()
      .withMessage('questionId is required')
      .isLength({ max: 255 })
      .withMessage('questionId must be less than 255 characters'),
    body('questionText')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('questionText must be less than 1000 characters'),
    body('value')
      .exists()
      .withMessage('value is required')
      .custom((value) => {
        // Convert value to string to check size (handles strings, arrays, objects)
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
        if (valueStr.length > 10000) {
          throw new Error('value must be less than 10000 characters');
        }
        return true;
      }),
    handleValidationErrors,
  ],
};

/**
 * Validators for admin endpoints
 */
const adminValidators = {
  login: [
    body('password')
      .notEmpty()
      .withMessage('password is required'),
    handleValidationErrors,
  ],
};

module.exports = {
  submissionValidators,
  adminValidators,
  handleValidationErrors,
};
