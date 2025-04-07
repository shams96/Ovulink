/**
 * Logger utility
 * Provides logging functionality for the application
 */

const winston = require('winston');
const config = require('../config');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logLevel || 'info',
  format: logFormat,
  defaultMeta: { service: 'ovulink-api' },
  transports: [
    // Write logs to console
    new winston.transports.Console({
      format: config.nodeEnv === 'production' ? logFormat : consoleFormat,
    }),
  ],
  exitOnError: false,
});

// Add file transports in production
if (config.nodeEnv === 'production') {
  logger.add(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  );
  logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
}

// Create a stream object for Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
