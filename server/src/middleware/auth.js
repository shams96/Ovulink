/**
 * Authentication middleware
 * Verifies JWT tokens and adds user to request object
 */

const jwt = require('jsonwebtoken');
const { ApiError, ERROR_CODES } = require('./errorHandler');
const config = require('../config');
const logger = require('../utils/logger');
const userModel = require('../models/user.model');

/**
 * Verify JWT token from Authorization header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        ERROR_CODES.UNAUTHORIZED,
        'UNAUTHORIZED',
        'Authentication required'
      );
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError(
        ERROR_CODES.UNAUTHORIZED,
        'UNAUTHORIZED',
        'Authentication required'
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Get user from database
    const user = await userModel.findById(decoded.id);
    
    if (!user) {
      throw new ApiError(
        ERROR_CODES.UNAUTHORIZED,
        'UNAUTHORIZED',
        'User not found'
      );
    }
    
    // Add user to request object
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(
        new ApiError(
          ERROR_CODES.UNAUTHORIZED,
          'UNAUTHORIZED',
          'Invalid token'
        )
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(
        new ApiError(
          ERROR_CODES.UNAUTHORIZED,
          'UNAUTHORIZED',
          'Token expired'
        )
      );
    }
    
    next(error);
  }
};

/**
 * Check if user has required role
 * @param {string[]} roles - Array of required roles
 * @returns {Function} Express middleware
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          ERROR_CODES.UNAUTHORIZED,
          'UNAUTHORIZED',
          'Authentication required'
        );
      }
      
      // Convert single role to array
      if (typeof roles === 'string') {
        roles = [roles];
      }
      
      // Check if user has required role
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        throw new ApiError(
          ERROR_CODES.FORBIDDEN,
          'FORBIDDEN',
          'Insufficient permissions'
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {Object} Decoded token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
  authenticate,
  authorize,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
};
