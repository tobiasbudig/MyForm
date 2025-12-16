const express = require('express');
const rateLimit = require('express-rate-limit');
const { trackEvent } = require('../controllers/trackingController');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiter for tracking events (200 requests per 15 minutes)
const trackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit since tracking generates many events
  message: {
    success: false,
    error: 'Too many tracking requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Tracking rate limit exceeded', {
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      error: 'Too many tracking requests from this IP, please try again later.',
    });
  },
});

// Track user journey events
router.post('/event', trackingLimiter, trackEvent);

module.exports = router;
