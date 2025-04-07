const UserModel = require('../models/user.model');
const { ApiError } = require('../middleware/errorHandler');
const { createUser, getUserByUid } = require('../utils/firebase');

/**
 * User controller for handling user-related HTTP requests
 */
class UserController {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async register(req, res, next) {
    try {
      const { email, password, displayName, gender, birthDate, phoneNumber } = req.body;
      
      // Create user in Firebase
      const firebaseUser = await createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0],
      });
      
      // Create user in database
      const user = await UserModel.create({
        firebase_uid: firebaseUser.uid,
        email,
        display_name: displayName || email.split('@')[0],
        gender,
        birth_date: birthDate,
        phone_number: phoneNumber,
      });
      
      res.status(201).json({
        message: 'User registered successfully',
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
   * Get current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getProfile(req, res, next) {
    try {
      const { uid } = req.user;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get partner links
      const partnerLinks = await UserModel.getPartnerLinks(user.id);
      
      // Get notification preferences
      const notificationPreferences = await UserModel.getNotificationPreferences(user.id);
      
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
        partnerLinks,
        notificationPreferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateProfile(req, res, next) {
    try {
      const { uid } = req.user;
      const updateData = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update user in database
      const updatedUser = await UserModel.update(user.id, {
        display_name: updateData.displayName,
        phone_number: updateData.phoneNumber,
        birth_date: updateData.birthDate,
        height: updateData.height,
        weight: updateData.weight,
      });
      
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          displayName: updatedUser.display_name,
          gender: updatedUser.gender,
          birthDate: updatedUser.birth_date,
          phoneNumber: updatedUser.phone_number,
          height: updatedUser.height,
          weight: updatedUser.weight,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Link partner
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async linkPartner(req, res, next) {
    try {
      const { uid } = req.user;
      const { partnerEmail } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Link partner
      const partnerLink = await UserModel.linkPartner(user.id, partnerEmail);
      
      res.status(201).json({
        message: 'Partner link request sent successfully',
        partnerLink,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update partner link status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updatePartnerLinkStatus(req, res, next) {
    try {
      const { uid } = req.user;
      const { linkId } = req.params;
      const { status } = req.body;
      
      if (!['accepted', 'rejected'].includes(status)) {
        throw ApiError.badRequest('Invalid status. Must be "accepted" or "rejected"');
      }
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update partner link status
      const updatedLink = await UserModel.updatePartnerLinkStatus(linkId, user.id, status);
      
      res.status(200).json({
        message: `Partner link ${status} successfully`,
        partnerLink: updatedLink,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get partner links
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPartnerLinks(req, res, next) {
    try {
      const { uid } = req.user;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get partner links
      const partnerLinks = await UserModel.getPartnerLinks(user.id);
      
      res.status(200).json({
        partnerLinks,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update notification preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateNotificationPreferences(req, res, next) {
    try {
      const { uid } = req.user;
      const { email, push, sms } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update notification preferences
      const preferences = await UserModel.updateNotificationPreferences(user.id, {
        email,
        push,
        sms,
      });
      
      res.status(200).json({
        message: 'Notification preferences updated successfully',
        preferences,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get notification preferences
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getNotificationPreferences(req, res, next) {
    try {
      const { uid } = req.user;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get notification preferences
      const preferences = await UserModel.getNotificationPreferences(user.id);
      
      res.status(200).json({
        preferences,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
