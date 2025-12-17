const db = require('../models/database');

/**
 * Get funnel metrics (page_view -> survey_start -> survey_complete)
 * GET /api/admin/analytics/funnel?formId=doctor
 */
async function getFunnelMetrics(req, res) {
  try {
    const { formId } = req.query;

    if (!formId) {
      return res.status(400).json({ success: false, error: 'formId is required' });
    }

    const result = await db.query(`
      SELECT
        event_type,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(*) as total_events
      FROM tracking_events
      WHERE form_id = $1
      GROUP BY event_type
    `, [formId]);

    // Transform into funnel structure
    const metrics = {
      page_views: 0,
      survey_starts: 0,
      survey_completions: 0
    };

    result.rows.forEach(row => {
      if (row.event_type === 'page_view') {
        metrics.page_views = parseInt(row.unique_sessions);
      } else if (row.event_type === 'survey_start') {
        metrics.survey_starts = parseInt(row.unique_sessions);
      } else if (row.event_type === 'survey_complete') {
        metrics.survey_completions = parseInt(row.unique_sessions);
      }
    });

    // Calculate conversion rates
    const startRate = metrics.page_views > 0
      ? ((metrics.survey_starts / metrics.page_views) * 100).toFixed(1)
      : 0;
    const completionRate = metrics.survey_starts > 0
      ? ((metrics.survey_completions / metrics.survey_starts) * 100).toFixed(1)
      : 0;
    const overallConversion = metrics.page_views > 0
      ? ((metrics.survey_completions / metrics.page_views) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        metrics,
        rates: {
          startRate: parseFloat(startRate),
          completionRate: parseFloat(completionRate),
          overallConversion: parseFloat(overallConversion)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching funnel metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch funnel metrics' });
  }
}

/**
 * Get question-by-question drop-off analysis
 * GET /api/admin/analytics/dropoff?formId=doctor
 */
async function getDropoffAnalysis(req, res) {
  try {
    const { formId } = req.query;

    if (!formId) {
      return res.status(400).json({ success: false, error: 'formId is required' });
    }

    const result = await db.query(`
      SELECT
        (event_data->>'question_number')::int as question_number,
        event_data->>'question_id' as question_id,
        COUNT(DISTINCT session_id) as sessions_reached
      FROM tracking_events
      WHERE event_type = 'question_view' AND form_id = $1
      GROUP BY question_number, question_id
      ORDER BY question_number
    `, [formId]);

    // Calculate drop-off rates
    const dropoffData = result.rows.map((row, index, arr) => {
      const sessionsReached = parseInt(row.sessions_reached);
      const nextRow = arr[index + 1];
      const sessionsCompleted = nextRow ? parseInt(nextRow.sessions_reached) : null;

      const dropoffRate = sessionsCompleted !== null
        ? (((sessionsReached - sessionsCompleted) / sessionsReached) * 100).toFixed(1)
        : 0;

      return {
        questionNumber: row.question_number,
        questionId: row.question_id,
        sessionsReached,
        sessionsCompleted,
        dropoffRate: parseFloat(dropoffRate)
      };
    });

    res.json({
      success: true,
      data: dropoffData
    });
  } catch (error) {
    console.error('Error fetching dropoff analysis:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dropoff analysis' });
  }
}

/**
 * Get QR source performance comparison
 * GET /api/admin/analytics/sources?formId=doctor
 */
async function getSourcePerformance(req, res) {
  try {
    const { formId } = req.query;

    if (!formId) {
      return res.status(400).json({ success: false, error: 'formId is required' });
    }

    const result = await db.query(`
      SELECT
        COALESCE(qr_source, 'direct') as qr_source,
        COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as scans,
        COUNT(DISTINCT CASE WHEN event_type = 'survey_start' THEN session_id END) as starts,
        COUNT(DISTINCT CASE WHEN event_type = 'survey_complete' THEN session_id END) as completions
      FROM tracking_events
      WHERE form_id = $1
      GROUP BY qr_source
      ORDER BY scans DESC
    `, [formId]);

    // Calculate conversion rates for each source
    const sourceData = result.rows.map(row => {
      const scans = parseInt(row.scans);
      const starts = parseInt(row.starts);
      const completions = parseInt(row.completions);

      const conversionRate = scans > 0
        ? ((completions / scans) * 100).toFixed(1)
        : 0;

      return {
        source: row.qr_source,
        scans,
        starts,
        completions,
        conversionRate: parseFloat(conversionRate)
      };
    });

    res.json({
      success: true,
      data: sourceData
    });
  } catch (error) {
    console.error('Error fetching source performance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch source performance' });
  }
}

/**
 * Get device breakdown from user agents
 * GET /api/admin/analytics/devices?formId=doctor
 */
async function getDeviceBreakdown(req, res) {
  try {
    const { formId } = req.query;

    if (!formId) {
      return res.status(400).json({ success: false, error: 'formId is required' });
    }

    const result = await db.query(`
      SELECT
        user_agent,
        COUNT(DISTINCT session_id) as sessions
      FROM tracking_events
      WHERE event_type = 'page_view' AND form_id = $1
      GROUP BY user_agent
    `, [formId]);

    // Parse user agents to categorize devices
    const deviceCategories = {
      ios: 0,
      android: 0,
      desktop: 0,
      other: 0
    };

    const browserCategories = {
      safari: 0,
      chrome: 0,
      firefox: 0,
      other: 0
    };

    result.rows.forEach(row => {
      const ua = row.user_agent.toLowerCase();
      const count = parseInt(row.sessions);

      // Device detection
      if (ua.includes('iphone') || ua.includes('ipad')) {
        deviceCategories.ios += count;
      } else if (ua.includes('android')) {
        deviceCategories.android += count;
      } else if (ua.includes('windows') || ua.includes('mac') || ua.includes('linux')) {
        deviceCategories.desktop += count;
      } else {
        deviceCategories.other += count;
      }

      // Browser detection
      if (ua.includes('safari') && !ua.includes('chrome')) {
        browserCategories.safari += count;
      } else if (ua.includes('chrome')) {
        browserCategories.chrome += count;
      } else if (ua.includes('firefox')) {
        browserCategories.firefox += count;
      } else {
        browserCategories.other += count;
      }
    });

    const totalSessions = result.rows.reduce((sum, row) => sum + parseInt(row.sessions), 0);

    // Calculate percentages
    const deviceData = Object.entries(deviceCategories).map(([device, count]) => ({
      device,
      count,
      percentage: totalSessions > 0 ? ((count / totalSessions) * 100).toFixed(1) : 0
    }));

    const browserData = Object.entries(browserCategories).map(([browser, count]) => ({
      browser,
      count,
      percentage: totalSessions > 0 ? ((count / totalSessions) * 100).toFixed(1) : 0
    }));

    res.json({
      success: true,
      data: {
        devices: deviceData,
        browsers: browserData,
        totalSessions
      }
    });
  } catch (error) {
    console.error('Error fetching device breakdown:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch device breakdown' });
  }
}

/**
 * Get timing metrics (time to start, completion time)
 * GET /api/admin/analytics/timing?formId=doctor
 */
async function getTimingMetrics(req, res) {
  try {
    const { formId } = req.query;

    if (!formId) {
      return res.status(400).json({ success: false, error: 'formId is required' });
    }

    const result = await db.query(`
      WITH session_times AS (
        SELECT
          session_id,
          MIN(CASE WHEN event_type = 'page_view' THEN timestamp END) as page_load,
          MIN(CASE WHEN event_type = 'survey_start' THEN timestamp END) as survey_start,
          MAX(CASE WHEN event_type = 'survey_complete' THEN timestamp END) as survey_complete
        FROM tracking_events
        WHERE form_id = $1
        GROUP BY session_id
      )
      SELECT
        AVG(EXTRACT(EPOCH FROM (survey_start - page_load))) as avg_time_to_start,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (survey_start - page_load))) as median_time_to_start,
        AVG(EXTRACT(EPOCH FROM (survey_complete - survey_start))) as avg_completion_time,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (survey_complete - survey_start))) as median_completion_time,
        COUNT(CASE WHEN EXTRACT(EPOCH FROM (survey_start - page_load)) < 5 THEN 1 END) as quick_exits,
        COUNT(CASE WHEN EXTRACT(EPOCH FROM (survey_complete - survey_start)) > 300 THEN 1 END) as confused_users,
        COUNT(*) as total_sessions
      FROM session_times
      WHERE survey_start IS NOT NULL
        AND page_load IS NOT NULL
        AND survey_complete IS NOT NULL
    `, [formId]);

    const metrics = result.rows[0];
    const totalSessions = parseInt(metrics.total_sessions) || 1;

    res.json({
      success: true,
      data: {
        avgTimeToStart: metrics.avg_time_to_start ? parseFloat(metrics.avg_time_to_start.toFixed(1)) : 0,
        medianTimeToStart: metrics.median_time_to_start ? parseFloat(metrics.median_time_to_start.toFixed(1)) : 0,
        avgCompletionTime: metrics.avg_completion_time ? parseFloat(metrics.avg_completion_time.toFixed(1)) : 0,
        medianCompletionTime: metrics.median_completion_time ? parseFloat(metrics.median_completion_time.toFixed(1)) : 0,
        quickExitsCount: parseInt(metrics.quick_exits) || 0,
        quickExitsRate: ((parseInt(metrics.quick_exits) / totalSessions) * 100).toFixed(1),
        confusedUsersCount: parseInt(metrics.confused_users) || 0,
        confusedUsersRate: ((parseInt(metrics.confused_users) / totalSessions) * 100).toFixed(1)
      }
    });
  } catch (error) {
    console.error('Error fetching timing metrics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch timing metrics' });
  }
}

module.exports = {
  getFunnelMetrics,
  getDropoffAnalysis,
  getSourcePerformance,
  getDeviceBreakdown,
  getTimingMetrics
};
