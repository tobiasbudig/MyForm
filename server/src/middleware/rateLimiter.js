const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Rate limiter for submission endpoints (100 requests per 15 minutes)
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Rate limiter for answer save endpoint (200 requests per 15 minutes)
const answerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded on answer endpoint', {
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Rate limiter for admin login (10 requests per 15 minutes)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: 'Too many login attempts from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn('Admin login rate limit exceeded', {
      ip: req.ip,
    });
    res.status(429).json({
      success: false,
      error: 'Too many login attempts from this IP, please try again later.',
    });
  },
});

module.exports = {
  submissionLimiter,
  answerLimiter,
  adminLoginLimiter,
};
