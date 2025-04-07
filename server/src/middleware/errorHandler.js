/**
 * Global error handler middleware
 * Handles all errors thrown in the application and returns a standardized response
 */

const logger = require('../utils/logger');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Indicates if this is an operational error that we can handle
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error codes mapping
 */
const ERROR_CODES = {
  INVALID_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
};

/**
 * Create a standardized error response
 * @param {Error} err - The error object
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Standardized error response
 */
const createErrorResponse = (err, statusCode) => {
  // Default error response
  const errorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  
  // If this is an ApiError, use its properties
  if (err instanceof ApiError) {
    errorResponse.error.code = err.code;
    errorResponse.error.message = err.message;
    
    if (err.details) {
      errorResponse.error.details = err.details;
    }
    
    return errorResponse;
  }
  
  // Handle Joi validation errors
  if (err.isJoi) {
    errorResponse.error.code = 'VALIDATION_ERROR';
    errorResponse.error.message = 'Validation error';
    errorResponse.error.details = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
    
    return errorResponse;
  }
  
  // Handle database errors
  if (err.code === '23505') { // Unique violation in PostgreSQL
    errorResponse.error.code = 'CONFLICT';
    errorResponse.error.message = 'Resource already exists';
    
    return errorResponse;
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.error.code = 'UNAUTHORIZED';
    errorResponse.error.message = 'Invalid token';
    
    return errorResponse;
  }
  
  if (err.name === 'TokenExpiredError') {
    errorResponse.error.code = 'UNAUTHORIZED';
    errorResponse.error.message = 'Token expired';
    
    return errorResponse;
  }
  
  // In development, include the error stack
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }
  
  return errorResponse;
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Set default status code
  let statusCode = err.statusCode || 500;
  
  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
    logger.error(err.stack);
  } else {
    logger.warn(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
  }
  
  // Create error response
  const errorResponse = createErrorResponse(err, statusCode);
  
  // Send response
  res.status(statusCode).json(errorResponse);
};

module.exports = {
  errorHandler,
  ApiError,
  ERROR_CODES,
};
