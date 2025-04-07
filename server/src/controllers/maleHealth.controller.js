const MaleHealthModel = require('../models/maleHealth.model');
const UserModel = require('../models/user.model');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Male Health controller for handling male health-related HTTP requests
 */
class MaleHealthController {
  /**
   * Create a new sperm health record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createSpermHealth(req, res, next) {
    try {
      const { uid } = req.user;
      const { date, count, motility, morphology, volume, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is male
      if (user.gender !== 'male') {
        throw ApiError.forbidden('Only male users can create sperm health records');
      }
      
      // Create sperm health record
      const spermHealth = await MaleHealthModel.createSpermHealth(user.id, {
        date,
        count,
        motility,
        morphology,
        volume,
        notes,
      });
      
      // Calculate sperm health score
      const score = MaleHealthModel.calculateSpermHealthScore(spermHealth);
      
      res.status(201).json({
        message: 'Sperm health record created successfully',
        spermHealth,
        score,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update a sperm health record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateSpermHealth(req, res, next) {
    try {
      const { uid } = req.user;
      const { spermId } = req.params;
      const { count, motility, morphology, volume, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update sperm health record
      const spermHealth = await MaleHealthModel.updateSpermHealth(spermId, user.id, {
        count,
        motility,
        morphology,
        volume,
        notes,
      });
      
      // Calculate sperm health score
      const score = MaleHealthModel.calculateSpermHealthScore(spermHealth);
      
      res.status(200).json({
        message: 'Sperm health record updated successfully',
        spermHealth,
        score,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get a sperm health record by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getSpermHealth(req, res, next) {
    try {
      const { uid } = req.user;
      const { spermId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get sperm health record
      const spermHealth = await MaleHealthModel.getSpermHealthById(spermId, user.id);
      
      // Calculate sperm health score
      const score = MaleHealthModel.calculateSpermHealthScore(spermHealth);
      
      res.status(200).json({
        spermHealth,
        score,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all sperm health records for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getSpermHealthRecords(req, res, next) {
    try {
      const { uid } = req.user;
      const { limit, offset, startDate, endDate } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get sperm health records
      const spermHealthRecords = await MaleHealthModel.getSpermHealthRecords(user.id, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        startDate,
        endDate,
      });
      
      // Calculate sperm health scores for each record
      const recordsWithScores = spermHealthRecords.map(record => ({
        record,
        score: MaleHealthModel.calculateSpermHealthScore(record),
      }));
      
      res.status(200).json({
        spermHealthRecords: recordsWithScores,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a sperm health record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteSpermHealth(req, res, next) {
    try {
      const { uid } = req.user;
      const { spermId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete sperm health record
      await MaleHealthModel.deleteSpermHealth(spermId, user.id);
      
      res.status(200).json({
        message: 'Sperm health record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Calculate sperm health score
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async calculateSpermHealthScore(req, res, next) {
    try {
      const { count, motility, morphology, volume } = req.body;
      
      // Calculate sperm health score
      const score = MaleHealthModel.calculateSpermHealthScore({
        count,
        motility,
        morphology,
        volume,
      });
      
      res.status(200).json({
        score,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get sperm health trends for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getSpermHealthTrends(req, res, next) {
    try {
      const { uid } = req.user;
      const { months } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is male
      if (user.gender !== 'male') {
        throw ApiError.forbidden('Only male users can access sperm health trends');
      }
      
      // Get sperm health trends
      const trends = await MaleHealthModel.getSpermHealthTrends(
        user.id,
        months ? parseInt(months) : undefined
      );
      
      res.status(200).json(trends);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get latest sperm health record and score
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getLatestSpermHealth(req, res, next) {
    try {
      const { uid } = req.user;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is male
      if (user.gender !== 'male') {
        throw ApiError.forbidden('Only male users can access sperm health records');
      }
      
      // Get latest sperm health record
      const records = await MaleHealthModel.getSpermHealthRecords(user.id, {
        limit: 1,
      });
      
      if (records.length === 0) {
        return res.status(200).json({
          message: 'No sperm health records found',
          latestRecord: null,
          score: null,
        });
      }
      
      const latestRecord = records[0];
      
      // Calculate sperm health score
      const score = MaleHealthModel.calculateSpermHealthScore(latestRecord);
      
      res.status(200).json({
        latestRecord,
        score,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MaleHealthController;
