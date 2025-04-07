const FemaleHealthModel = require('../models/femaleHealth.model');
const UserModel = require('../models/user.model');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Female Health controller for handling female health-related HTTP requests
 */
class FemaleHealthController {
  /**
   * Create a new menstrual cycle record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createCycle(req, res, next) {
    try {
      const { uid } = req.user;
      const { startDate, endDate, flow, symptoms, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is female
      if (user.gender !== 'female') {
        throw ApiError.forbidden('Only female users can create menstrual cycle records');
      }
      
      // Create cycle
      const cycle = await FemaleHealthModel.createCycle(user.id, {
        start_date: startDate,
        end_date: endDate,
        flow,
        notes,
      });
      
      res.status(201).json({
        message: 'Menstrual cycle record created successfully',
        cycle,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update a menstrual cycle record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateCycle(req, res, next) {
    try {
      const { uid } = req.user;
      const { cycleId } = req.params;
      const { endDate, flow, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update cycle
      const cycle = await FemaleHealthModel.updateCycle(cycleId, user.id, {
        end_date: endDate,
        flow,
        notes,
      });
      
      res.status(200).json({
        message: 'Menstrual cycle record updated successfully',
        cycle,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get a menstrual cycle record by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCycle(req, res, next) {
    try {
      const { uid } = req.user;
      const { cycleId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get cycle
      const cycle = await FemaleHealthModel.getCycleById(cycleId, user.id);
      
      res.status(200).json({
        cycle,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all menstrual cycles for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCycles(req, res, next) {
    try {
      const { uid } = req.user;
      const { limit, offset, startDate, endDate } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get cycles
      const cycles = await FemaleHealthModel.getCycles(user.id, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        startDate,
        endDate,
      });
      
      res.status(200).json({
        cycles,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a menstrual cycle record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteCycle(req, res, next) {
    try {
      const { uid } = req.user;
      const { cycleId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete cycle
      await FemaleHealthModel.deleteCycle(cycleId, user.id);
      
      res.status(200).json({
        message: 'Menstrual cycle record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Create a new temperature record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createTemperature(req, res, next) {
    try {
      const { uid } = req.user;
      const { date, time, value, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is female
      if (user.gender !== 'female') {
        throw ApiError.forbidden('Only female users can create temperature records');
      }
      
      // Create temperature record
      const temperature = await FemaleHealthModel.createTemperature(user.id, {
        date,
        time,
        value,
        notes,
      });
      
      res.status(201).json({
        message: 'Temperature record created successfully',
        temperature,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update a temperature record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateTemperature(req, res, next) {
    try {
      const { uid } = req.user;
      const { tempId } = req.params;
      const { time, value, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update temperature record
      const temperature = await FemaleHealthModel.updateTemperature(tempId, user.id, {
        time,
        value,
        notes,
      });
      
      res.status(200).json({
        message: 'Temperature record updated successfully',
        temperature,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get a temperature record by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getTemperature(req, res, next) {
    try {
      const { uid } = req.user;
      const { tempId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get temperature record
      const temperature = await FemaleHealthModel.getTemperatureById(tempId, user.id);
      
      res.status(200).json({
        temperature,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all temperature records for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getTemperatures(req, res, next) {
    try {
      const { uid } = req.user;
      const { limit, offset, startDate, endDate } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get temperature records
      const temperatures = await FemaleHealthModel.getTemperatures(user.id, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        startDate,
        endDate,
      });
      
      res.status(200).json({
        temperatures,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a temperature record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteTemperature(req, res, next) {
    try {
      const { uid } = req.user;
      const { tempId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete temperature record
      await FemaleHealthModel.deleteTemperature(tempId, user.id);
      
      res.status(200).json({
        message: 'Temperature record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Create a new cervical mucus record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createCervicalMucus(req, res, next) {
    try {
      const { uid } = req.user;
      const { date, type, amount, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is female
      if (user.gender !== 'female') {
        throw ApiError.forbidden('Only female users can create cervical mucus records');
      }
      
      // Create cervical mucus record
      const cervicalMucus = await FemaleHealthModel.createCervicalMucus(user.id, {
        date,
        type,
        amount,
        notes,
      });
      
      res.status(201).json({
        message: 'Cervical mucus record created successfully',
        cervicalMucus,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update a cervical mucus record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateCervicalMucus(req, res, next) {
    try {
      const { uid } = req.user;
      const { mucusId } = req.params;
      const { type, amount, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update cervical mucus record
      const cervicalMucus = await FemaleHealthModel.updateCervicalMucus(mucusId, user.id, {
        type,
        amount,
        notes,
      });
      
      res.status(200).json({
        message: 'Cervical mucus record updated successfully',
        cervicalMucus,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get a cervical mucus record by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCervicalMucus(req, res, next) {
    try {
      const { uid } = req.user;
      const { mucusId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get cervical mucus record
      const cervicalMucus = await FemaleHealthModel.getCervicalMucusById(mucusId, user.id);
      
      res.status(200).json({
        cervicalMucus,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all cervical mucus records for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getCervicalMucusRecords(req, res, next) {
    try {
      const { uid } = req.user;
      const { limit, offset, startDate, endDate } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get cervical mucus records
      const cervicalMucusRecords = await FemaleHealthModel.getCervicalMucusRecords(user.id, {
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
        startDate,
        endDate,
      });
      
      res.status(200).json({
        cervicalMucusRecords,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete a cervical mucus record
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteCervicalMucus(req, res, next) {
    try {
      const { uid } = req.user;
      const { mucusId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete cervical mucus record
      await FemaleHealthModel.deleteCervicalMucus(mucusId, user.id);
      
      res.status(200).json({
        message: 'Cervical mucus record deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Predict ovulation based on menstrual cycle data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async predictOvulation(req, res, next) {
    try {
      const { uid } = req.user;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Check if user is female
      if (user.gender !== 'female') {
        throw ApiError.forbidden('Only female users can predict ovulation');
      }
      
      // Predict ovulation
      const prediction = await FemaleHealthModel.predictOvulation(user.id);
      
      res.status(200).json(prediction);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FemaleHealthController;
