const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const logDir = path.join(__dirname, '..', '..', 'logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (pretty print for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create console transport
const consoleTransport = new winston.transports.Console({
  format: isProduction ? logFormat : consoleFormat,
});

// Build transports array - only include file transports in development
const transports = [consoleTransport];
const exceptionHandlers = [consoleTransport];
const rejectionHandlers = [consoleTransport];

// Add file transports only in development
if (!isProduction) {
  // Create daily rotate file transport for combined logs
  const combinedFileTransport = new DailyRotateFile({
    filename: path.join(logDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  });

  // Create daily rotate file transport for error logs
  const errorFileTransport = new DailyRotateFile({
    level: 'error',
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  });

  // Error handlers for winston-daily-rotate-file v5
  combinedFileTransport.on('error', (error) => {
    console.error('Error writing to combined log file:', error);
  });

  errorFileTransport.on('error', (error) => {
    console.error('Error writing to error log file:', error);
  });

  transports.push(combinedFileTransport, errorFileTransport);
  exceptionHandlers.push(
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
  );
  rejectionHandlers.push(
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })
  );
}

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transports,
  exceptionHandlers,
  rejectionHandlers,
});

module.exports = logger;
