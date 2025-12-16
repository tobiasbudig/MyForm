const db = require('../models/database');
const logger = require('../utils/logger');

/**
 * Track an event in the user journey
 * POST /api/tracking/event
 */
async function trackEvent(req, res) {
  try {
    const {
      session_id,
      form_id,
      event_type,
      event_data = {},
      qr_source,
      user_agent
    } = req.body;

    // Validation
    if (!session_id || !form_id || !event_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: session_id, form_id, event_type'
      });
    }

    // Validate event_type
    const validEventTypes = ['page_view', 'survey_start', 'question_view', 'survey_complete'];
    if (!validEventTypes.includes(event_type)) {
      return res.status(400).json({
        success: false,
        error: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}`
      });
    }

    // Insert event into database
    const query = `
      INSERT INTO tracking_events (
        session_id,
        form_id,
        event_type,
        event_data,
        qr_source,
        user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, timestamp
    `;

    const values = [
      session_id,
      form_id,
      event_type,
      JSON.stringify(event_data),
      qr_source || null,
      user_agent || req.headers['user-agent'] || null
    ];

    const result = await db.query(query, values);

    logger.info('Event tracked', {
      session_id,
      form_id,
      event_type,
      qr_source,
      event_id: result.rows[0].id
    });

    res.json({
      success: true,
      data: {
        event_id: result.rows[0].id,
        timestamp: result.rows[0].timestamp
      }
    });
  } catch (error) {
    logger.error('Error tracking event', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    res.status(500).json({
      success: false,
      error: 'Failed to track event'
    });
  }
}

module.exports = {
  trackEvent
};
