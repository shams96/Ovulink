const jwt = require('jsonwebtoken');
const { ApiError } = require('../middleware/errorHandler');
const UserModel = require('../models/user.model');
const config = require('../config');
const { verifyIdToken } = require('../utils/firebase');

/**
 * Authentication controller for handling auth-related HTTP requests
 */
class AuthController {
  /**
   * Verify Firebase token and issue JWT
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async verifyToken(req, res, next) {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        throw ApiError.badRequest('Firebase ID token is required');
      }
      
      // Verify Firebase token
      const decodedToken = await verifyIdToken(idToken);
      
      // Check if user exists in database
      let user;
      try {
        user = await UserModel.getByFirebaseUid(decodedToken.uid);
      } catch (error) {
        if (error.status === 404) {
          // User doesn't exist in database, create a new one
          user = await UserModel.create({
            firebase_uid: decodedToken.uid,
            email: decodedToken.email,
            display_name: decodedToken.name || decodedToken.email.split('@')[0],
            gender: 'other', // Default gender
          });
        } else {
          throw error;
        }
      }
      
      // Generate JWT
      const token = jwt.sign(
        {
          uid: decodedToken.uid,
          email: decodedToken.email,
        },
        config.JWT_SECRET,
        {
          expiresIn: config.JWT_EXPIRES_IN,
        }
      );
      
      res.status(200).json({
        message: 'Authentication successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          gender: user.gender,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Refresh JWT token
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async refreshToken(req, res, next) {
    try {
      const { uid, email } = req.user;
      
      // Generate new JWT
      const token = jwt.sign(
        {
          uid,
          email,
        },
        config.JWT_SECRET,
        {
          expiresIn: config.JWT_EXPIRES_IN,
        }
      );
      
      res.status(200).json({
        message: 'Token refreshed successfully',
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get current authenticated user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCurrentUser(req, res, next) {
    try {
      const { uid } = req.user;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          gender: user.gender,
          birthDate: user.birth_date,
          phoneNumber: user.phone_number,
          height: user.height,
          weight: user.weight,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
