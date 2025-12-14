const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');
const logger = require('../utils/logger');

/**
 * Start a new submission
 * POST /api/submissions/start
 */
async function startSubmission(req, res) {
  try {
    const { formId } = req.body;

    if (!formId) {
      return res.status(400).json({
        success: false,
        error: 'formId is required',
      });
    }

    // Generate CSRF token
    const csrfToken = uuidv4();

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || null;

    // Insert submission
    const result = await db.query(
      `INSERT INTO submissions (form_id, ip_address, user_agent, csrf_token)
       VALUES ($1, $2, $3, $4)
       RETURNING id, session_id, csrf_token`,
      [formId, ipAddress, userAgent, csrfToken]
    );

    const submission = result.rows[0];

    logger.info('Submission started', {
      submissionId: submission.id,
      formId,
      ip: ipAddress,
    });

    res.status(201).json({
      success: true,
      data: {
        submissionId: submission.id,
        sessionId: submission.session_id,
        csrfToken: submission.csrf_token,
      },
    });
  } catch (error) {
    logger.error('Error starting submission', {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to start submission',
    });
  }
}

/**
 * Save an answer
 * POST /api/submissions/:submissionId/answer
 */
async function saveAnswer(req, res) {
  try {
    const { submissionId } = req.params;
    const { questionId, questionText, value, comment } = req.body;

    if (!questionId || value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'questionId and value are required',
      });
    }

    // Check if submission exists
    const submissionCheck = await db.query(
      'SELECT id FROM submissions WHERE id = $1',
      [submissionId]
    );

    if (submissionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    // Convert value to string for storage
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

    // Check if answer already exists for this question
    const checkExisting = await db.query(
      'SELECT id FROM answers WHERE submission_id = $1 AND question_id = $2',
      [submissionId, questionId]
    );

    if (checkExisting.rows.length > 0) {
      // Update existing answer
      await db.query(
        `UPDATE answers
         SET answer_value = $1, comment = $2, answered_at = NOW()
         WHERE submission_id = $3 AND question_id = $4`,
        [valueStr, comment || null, submissionId, questionId]
      );
    } else {
      // Insert new answer
      await db.query(
        `INSERT INTO answers (submission_id, question_id, question_text, answer_value, comment)
         VALUES ($1, $2, $3, $4, $5)`,
        [submissionId, questionId, questionText, valueStr, comment || null]
      );
    }

    logger.debug('Answer saved', {
      submissionId,
      questionId,
      hasComment: !!comment,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    logger.error('Error saving answer', {
      submissionId: req.params.submissionId,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to save answer',
    });
  }
}

/**
 * Complete a submission
 * POST /api/submissions/:submissionId/complete
 */
async function completeSubmission(req, res) {
  try {
    const { submissionId } = req.params;

    // Update submission as complete
    const result = await db.query(
      `UPDATE submissions
       SET is_complete = true, completed_at = NOW()
       WHERE id = $1
       RETURNING id, form_id`,
      [submissionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
    }

    logger.info('Submission completed', {
      submissionId,
      formId: result.rows[0].form_id,
    });

    res.json({
      success: true,
    });
  } catch (error) {
    logger.error('Error completing submission', {
      submissionId: req.params.submissionId,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to complete submission',
    });
  }
}

module.exports = {
  startSubmission,
  saveAnswer,
  completeSubmission,
};
