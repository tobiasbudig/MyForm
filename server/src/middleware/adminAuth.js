const db = require('../models/database');
const logger = require('../utils/logger');

/**
 * Middleware to verify admin session
 * Checks that token exists, is valid, and not expired
 */
const verifyAdminSession = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Check if session exists and is valid
    const result = await db.query(
      `SELECT * FROM admin_sessions
       WHERE token = $1
       AND expires_at > NOW()
       AND (last_activity + INTERVAL '30 minutes') > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      logger.warn('Invalid or expired admin session', { ip: req.ip });
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
      });
    }

    const session = result.rows[0];

    // Update last_activity
    await db.query(
      'UPDATE admin_sessions SET last_activity = NOW() WHERE id = $1',
      [session.id]
    );

    // Attach session to request
    req.adminSession = session;
    next();
  } catch (error) {
    logger.error('Admin auth error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

module.exports = { verifyAdminSession };
