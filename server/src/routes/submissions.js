const express = require('express');
const router = express.Router();
const {
  startSubmission,
  saveAnswer,
  completeSubmission,
} = require('../controllers/submissionController');
const { submissionValidators } = require('../middleware/validator');
const { validateCSRF } = require('../middleware/csrf');
const { submissionLimiter, answerLimiter } = require('../middleware/rateLimiter');

// POST /api/submissions/start - Start new submission
router.post(
  '/start',
  submissionLimiter,
  submissionValidators.start,
  startSubmission
);

// POST /api/submissions/:submissionId/answer - Save answer
router.post(
  '/:submissionId/answer',
  answerLimiter,
  validateCSRF,
  submissionValidators.saveAnswer,
  saveAnswer
);

// POST /api/submissions/:submissionId/complete - Complete submission
router.post(
  '/:submissionId/complete',
  validateCSRF,
  completeSubmission
);

module.exports = router;
