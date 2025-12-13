const db = require('../models/database');
const logger = require('../utils/logger');
const { parseForm } = require('./markdownParser');

/**
 * Export form submissions as CSV
 * @param {string} formId - The form ID
 * @returns {Promise<string>} CSV content
 */
async function exportFormToCSV(formId) {
  try {
    // Get form configuration to determine columns
    const form = await parseForm(formId);
    if (!form) {
      throw new Error('Form not found');
    }

    // Get all submissions
    const submissionsResult = await db.query(
      `SELECT id, session_id, ip_address, started_at, completed_at, is_complete
       FROM submissions
       WHERE form_id = $1
       ORDER BY created_at ASC`,
      [formId]
    );

    if (submissionsResult.rows.length === 0) {
      // Return empty CSV with headers only
      const headers = [
        'submission_id',
        'session_id',
        'ip_address',
        'started_at',
        'completed_at',
        'is_complete',
      ];
      return headers.join(',') + '\n';
    }

    // Build CSV headers
    const headers = [
      'submission_id',
      'session_id',
      'ip_address',
      'started_at',
      'completed_at',
      'is_complete',
    ];

    // Add question IDs as headers
    const questionHeaders = form.questions.map(q => q.id);
    headers.push(...questionHeaders);

    // Build CSV rows
    const rows = await Promise.all(
      submissionsResult.rows.map(async (submission) => {
        // Get answers for this submission
        const answersResult = await db.query(
          `SELECT question_id, answer_value
           FROM answers
           WHERE submission_id = $1`,
          [submission.id]
        );

        // Create a map of questionId -> answer
        const answersMap = {};
        answersResult.rows.forEach(row => {
          answersMap[row.question_id] = row.answer_value;
        });

        // Build row data
        const rowData = [
          submission.id,
          submission.session_id,
          submission.ip_address || '',
          submission.started_at ? submission.started_at.toISOString() : '',
          submission.completed_at ? submission.completed_at.toISOString() : '',
          submission.is_complete ? 'true' : 'false',
        ];

        // Add answers in the same order as headers
        questionHeaders.forEach(questionId => {
          const answer = answersMap[questionId] || '';
          // Escape commas and quotes in CSV
          const escapedAnswer = escapeCSV(answer);
          rowData.push(escapedAnswer);
        });

        return rowData.join(',');
      })
    );

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');

    return csv;
  } catch (error) {
    logger.error('Error exporting CSV', { formId, error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCSV(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

module.exports = {
  exportFormToCSV,
};
