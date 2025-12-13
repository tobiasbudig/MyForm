const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../models/database');
const logger = require('../utils/logger');
const { parseForm, listForms } = require('../services/markdownParser');

/**
 * Admin login
 * POST /api/admin/login
 */
async function login(req, res) {
  try {
    const { password } = req.body;

    // ADMIN_PASSWORD in .env should be a bcrypt hash
    // To generate: node -e "console.log(require('bcrypt').hashSync('your-password', 12))"
    const isValidPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);

    if (!isValidPassword) {
      logger.warn('Failed admin login attempt', { ip: req.ip });
      return res.status(401).json({
        success: false,
        error: 'Invalid password',
      });
    }

    // Generate session token
    const token = uuidv4();
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || null;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now

    // Store session in database
    await db.query(
      `INSERT INTO admin_sessions (token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [token, ipAddress, userAgent, expiresAt]
    );

    logger.info('Admin logged in', { ip: ipAddress });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    logger.error('Admin login error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
}

/**
 * Admin logout
 * POST /api/admin/logout
 */
async function logout(req, res) {
  try {
    const { adminSession } = req;

    // Delete session from database
    await db.query('DELETE FROM admin_sessions WHERE id = $1', [adminSession.id]);

    logger.info('Admin logged out', { sessionId: adminSession.id });

    res.json({
      success: true,
    });
  } catch (error) {
    logger.error('Admin logout error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
}

/**
 * Check session validity
 * GET /api/admin/session
 */
async function checkSession(req, res) {
  // If we got here, the session is valid (checked by middleware)
  res.json({
    success: true,
    session: {
      expiresAt: req.adminSession.expires_at,
      lastActivity: req.adminSession.last_activity,
    },
  });
}

/**
 * Get list of all forms with stats
 * GET /api/admin/forms
 */
async function getForms(req, res) {
  try {
    const formIds = await listForms();

    // Get stats for each form
    const formsWithStats = await Promise.all(
      formIds.map(async (formId) => {
        // Parse form to get title
        const form = await parseForm(formId);

        // Get submission count
        const countResult = await db.query(
          'SELECT COUNT(*) as count FROM submissions WHERE form_id = $1',
          [formId]
        );

        // Get last submission date
        const lastSubmissionResult = await db.query(
          `SELECT MAX(created_at) as last_submission
           FROM submissions
           WHERE form_id = $1 AND is_complete = true`,
          [formId]
        );

        return {
          id: formId,
          title: form ? form.title : formId,
          submissionCount: parseInt(countResult.rows[0].count),
          lastSubmission: lastSubmissionResult.rows[0].last_submission,
        };
      })
    );

    res.json({
      success: true,
      data: formsWithStats,
    });
  } catch (error) {
    logger.error('Error getting forms list', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Failed to get forms list',
    });
  }
}

/**
 * Get submissions for a specific form
 * GET /api/admin/forms/:formId/submissions
 */
async function getFormSubmissions(req, res) {
  try {
    const { formId } = req.params;

    // Get form info
    const form = await parseForm(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        error: 'Form not found',
      });
    }

    // Get all submissions for this form
    const submissionsResult = await db.query(
      `SELECT id, session_id, ip_address, started_at, completed_at, is_complete
       FROM submissions
       WHERE form_id = $1
       ORDER BY created_at DESC`,
      [formId]
    );

    // For each submission, get all answers
    const submissions = await Promise.all(
      submissionsResult.rows.map(async (submission) => {
        const answersResult = await db.query(
          `SELECT question_id, question_text, answer_value, answered_at
           FROM answers
           WHERE submission_id = $1
           ORDER BY answered_at ASC`,
          [submission.id]
        );

        return {
          ...submission,
          answers: answersResult.rows,
        };
      })
    );

    res.json({
      success: true,
      data: {
        form: {
          id: form.id,
          title: form.title,
        },
        submissions,
      },
    });
  } catch (error) {
    logger.error('Error getting form submissions', {
      formId: req.params.formId,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to get submissions',
    });
  }
}

module.exports = {
  login,
  logout,
  checkSession,
  getForms,
  getFormSubmissions,
};
