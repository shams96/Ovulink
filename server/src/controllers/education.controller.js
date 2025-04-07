const EducationModel = require('../models/education.model');
const UserModel = require('../models/user.model');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Education controller for handling educational content-related HTTP requests
 */
class EducationController {
  /**
   * Get all educational content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getAllContent(req, res, next) {
    try {
      const { limit, offset, category, tags, search } = req.query;
      
      // Parse tags if provided
      let parsedTags = null;
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch (error) {
          throw ApiError.badRequest('Invalid tags format. Must be a JSON array.');
        }
      }
      
      // Get content
      const content = await EducationModel.getAllContent({
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        category,
        tags: parsedTags,
        search,
      });
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get educational content by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getContentById(req, res, next) {
    try {
      const { contentId } = req.params;
      
      // Get content
      const content = await EducationModel.getContentById(contentId);
      
      // If user is authenticated, record view interaction
      if (req.user) {
        try {
          const user = await UserModel.getByFirebaseUid(req.user.uid);
          await EducationModel.createContentInteraction(user.id, contentId, 'view');
        } catch (error) {
          // Ignore interaction errors
          console.error('Error recording view interaction:', error);
        }
      }
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get educational content by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getContentByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const { limit, offset } = req.query;
      
      // Get content
      const content = await EducationModel.getContentByCategory(category, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get educational content by tags
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getContentByTags(req, res, next) {
    try {
      const { tags } = req.body;
      const { limit, offset } = req.query;
      
      if (!Array.isArray(tags)) {
        throw ApiError.badRequest('Tags must be an array');
      }
      
      // Get content
      const content = await EducationModel.getContentByTags(tags, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Search educational content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async searchContent(req, res, next) {
    try {
      const { q } = req.query;
      const { limit, offset } = req.query;
      
      if (!q) {
        throw ApiError.badRequest('Search query is required');
      }
      
      // Search content
      const content = await EducationModel.searchContent(q, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Create a content interaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createContentInteraction(req, res, next) {
    try {
      const { uid } = req.user;
      const { contentId, interactionType } = req.body;
      
      if (!['view', 'like', 'bookmark', 'share'].includes(interactionType)) {
        throw ApiError.badRequest('Invalid interaction type. Must be one of: view, like, bookmark, share');
      }
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Create interaction
      const interaction = await EducationModel.createContentInteraction(user.id, contentId, interactionType);
      
      res.status(201).json({
        message: 'Content interaction created successfully',
        interaction,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a content interaction
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteContentInteraction(req, res, next) {
    try {
      const { uid } = req.user;
      const { contentId, interactionType } = req.params;
      
      if (!['view', 'like', 'bookmark', 'share'].includes(interactionType)) {
        throw ApiError.badRequest('Invalid interaction type. Must be one of: view, like, bookmark, share');
      }
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete interaction
      await EducationModel.deleteContentInteraction(user.id, contentId, interactionType);
      
      res.status(200).json({
        message: 'Content interaction deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get user interactions with content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getUserContentInteractions(req, res, next) {
    try {
      const { uid } = req.user;
      const { contentId } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get interactions
      const interactions = await EducationModel.getUserContentInteractions(user.id, contentId);
      
      res.status(200).json({
        interactions,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get recommended content for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getRecommendedContent(req, res, next) {
    try {
      const { uid } = req.user;
      const { limit } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get recommended content
      const content = await EducationModel.getRecommendedContent(
        user.id,
        limit ? parseInt(limit) : undefined
      );
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get popular content
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getPopularContent(req, res, next) {
    try {
      const { limit } = req.query;
      
      // Get popular content
      const content = await EducationModel.getPopularContent(
        limit ? parseInt(limit) : undefined
      );
      
      res.status(200).json({
        content,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get content categories
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getContentCategories(req, res, next) {
    try {
      // Get categories
      const categories = await EducationModel.getContentCategories();
      
      res.status(200).json({
        categories,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get content tags
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getContentTags(req, res, next) {
    try {
      // Get tags
      const tags = await EducationModel.getContentTags();
      
      res.status(200).json({
        tags,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EducationController;
