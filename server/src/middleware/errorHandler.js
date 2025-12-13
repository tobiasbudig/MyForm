const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.statusCode || 500).json({
    success: false,
    error: isDevelopment ? err.message : 'An unexpected error occurred',
    ...(isDevelopment && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
