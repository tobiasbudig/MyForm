const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err.message, stack: err.stack });
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection failed', { error: err.message });
  } else {
    logger.info('Database connected successfully', { time: res.rows[0].now });
  }
});

// Export close function for graceful shutdown
const closePool = async () => {
  logger.info('Closing database pool...');
  await pool.end();
  logger.info('Database pool closed');
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  closePool,
};
