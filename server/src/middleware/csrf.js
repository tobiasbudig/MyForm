const logger = require('../utils/logger');
const db = require('../models/database');

/**
 * Validate CSRF token for submission endpoints
 * Token should be passed in X-CSRF-Token header and match the submission's token
 */
const validateCSRF = async (req, res, next) => {
  try {
    const token = req.get('X-CSRF-Token');
    const { submissionId } = req.params;

    if (!token) {
      logger.warn('CSRF token missing', { ip: req.ip, url: req.url });
      return res.status(403).json({
        success: false,
        error: 'CSRF token is required',
      });
    }

    // Verify token matches submission
    const result = await db.query(
      'SELECT csrf_token FROM submissions WHERE id = $1',
      [submissionId]
    );

    if (result.rows.length === 0) {
      logger.warn('Submission not found for CSRF validation', { submissionId, ip: req.ip });
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    if (result.rows[0].csrf_token !== token) {
      logger.warn('Invalid CSRF token', { submissionId, ip: req.ip });
      return res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
      });
    }

    next();
  } catch (error) {
    logger.error('CSRF validation error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Failed to validate CSRF token',
    });
  }
};

module.exports = { validateCSRF };
