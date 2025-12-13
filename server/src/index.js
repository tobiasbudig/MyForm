require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const db = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.query('SELECT NOW()');
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
});

// API routes
app.use('/api/forms', require('./routes/forms'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});
