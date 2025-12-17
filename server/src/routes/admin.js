const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  checkSession,
  getForms,
  getFormSubmissions,
  uploadForm,
} = require('../controllers/adminController');
const {
  getFunnelMetrics,
  getDropoffAnalysis,
  getSourcePerformance,
  getDeviceBreakdown,
  getTimingMetrics,
} = require('../controllers/analyticsController');
const { verifyAdminSession } = require('../middleware/adminAuth');
const { adminValidators } = require('../middleware/validator');
const { adminLoginLimiter } = require('../middleware/rateLimiter');
const { uploadFormFile, uploadFormFiles } = require('../middleware/fileUpload');
const { exportFormToCSV } = require('../services/csvExporter');
const logger = require('../utils/logger');

// POST /api/admin/login - Admin login
router.post('/login', adminLoginLimiter, adminValidators.login, login);

// POST /api/admin/logout - Admin logout
router.post('/logout', verifyAdminSession, logout);

// GET /api/admin/session - Check session validity
router.get('/session', verifyAdminSession, checkSession);

// GET /api/admin/forms - Get all forms with stats
router.get('/forms', verifyAdminSession, getForms);

// POST /api/admin/forms/upload - Upload form markdown file(s)
router.post('/forms/upload', verifyAdminSession, uploadFormFiles, uploadForm);

// GET /api/admin/forms/:formId/submissions - Get submissions for a form
router.get('/forms/:formId/submissions', verifyAdminSession, getFormSubmissions);

// GET /api/admin/forms/:formId/export - Export submissions as CSV
router.get('/forms/:formId/export', verifyAdminSession, async (req, res) => {
  try {
    const { formId } = req.params;

    const csv = await exportFormToCSV(formId);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${formId}-submissions.csv"`);
    res.send(csv);
  } catch (error) {
    logger.error('Error exporting CSV', {
      formId: req.params.formId,
      error: error.message,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to export CSV',
    });
  }
});

// Analytics routes
// GET /api/admin/analytics/funnel - Get conversion funnel metrics
router.get('/analytics/funnel', verifyAdminSession, getFunnelMetrics);

// GET /api/admin/analytics/dropoff - Get question drop-off analysis
router.get('/analytics/dropoff', verifyAdminSession, getDropoffAnalysis);

// GET /api/admin/analytics/sources - Get QR source performance
router.get('/analytics/sources', verifyAdminSession, getSourcePerformance);

// GET /api/admin/analytics/devices - Get device breakdown
router.get('/analytics/devices', verifyAdminSession, getDeviceBreakdown);

// GET /api/admin/analytics/timing - Get timing metrics
router.get('/analytics/timing', verifyAdminSession, getTimingMetrics);

module.exports = router;
