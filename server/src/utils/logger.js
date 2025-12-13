const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

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

// Create console transport
const consoleTransport = new winston.transports.Console({
  format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
});

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  transports: [
    consoleTransport,
    combinedFileTransport,
    errorFileTransport,
  ],
  exceptionHandlers: [
    consoleTransport,
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    consoleTransport,
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

module.exports = logger;
