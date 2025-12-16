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
const { verifyAdminSession } = require('../middleware/adminAuth');
const { adminValidators } = require('../middleware/validator');
const { adminLoginLimiter } = require('../middleware/rateLimiter');
const { uploadFormFile } = require('../middleware/fileUpload');
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

// POST /api/admin/forms/upload - Upload a form markdown file
router.post('/forms/upload', verifyAdminSession, uploadFormFile, uploadForm);

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

module.exports = router;
