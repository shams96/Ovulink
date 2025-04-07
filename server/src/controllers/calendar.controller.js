const CalendarModel = require('../models/calendar.model');
const UserModel = require('../models/user.model');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Calendar controller for handling calendar-related HTTP requests
 */
class CalendarController {
  /**
   * Create a new appointment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createAppointment(req, res, next) {
    try {
      const { uid } = req.user;
      const { title, date, time, location, notes, reminderTime, isShared } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Create appointment
      const appointment = await CalendarModel.createAppointment(user.id, {
        title,
        date,
        time,
        location,
        notes,
        reminderTime,
        isShared,
      });
      
      res.status(201).json({
        message: 'Appointment created successfully',
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update an appointment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateAppointment(req, res, next) {
    try {
      const { uid } = req.user;
      const { appointmentId } = req.params;
      const { title, date, time, location, notes, reminderTime, isShared } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update appointment
      const appointment = await CalendarModel.updateAppointment(appointmentId, user.id, {
        title,
        date,
        time,
        location,
        notes,
        reminderTime,
        isShared,
      });
      
      res.status(200).json({
        message: 'Appointment updated successfully',
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get an appointment by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getAppointment(req, res, next) {
    try {
      const { uid } = req.user;
      const { appointmentId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get appointment
      const appointment = await CalendarModel.getAppointmentById(appointmentId, user.id);
      
      res.status(200).json({
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all appointments for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getAppointments(req, res, next) {
    try {
      const { uid } = req.user;
      const { startDate, endDate, includePartnerAppointments } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get appointments
      const appointments = await CalendarModel.getAppointments(user.id, {
        startDate,
        endDate,
        includePartnerAppointments: includePartnerAppointments === 'true',
      });
      
      res.status(200).json({
        appointments,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete an appointment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteAppointment(req, res, next) {
    try {
      const { uid } = req.user;
      const { appointmentId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete appointment
      await CalendarModel.deleteAppointment(appointmentId, user.id);
      
      res.status(200).json({
        message: 'Appointment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Create a new intimacy log
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createIntimacyLog(req, res, next) {
    try {
      const { uid } = req.user;
      const { date, time, isProtected, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Create intimacy log
      const intimacyLog = await CalendarModel.createIntimacyLog(user.id, {
        date,
        time,
        isProtected,
        notes,
      });
      
      res.status(201).json({
        message: 'Intimacy log created successfully',
        intimacyLog,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Update an intimacy log
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateIntimacyLog(req, res, next) {
    try {
      const { uid } = req.user;
      const { intimacyId } = req.params;
      const { time, isProtected, notes } = req.body;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Update intimacy log
      const intimacyLog = await CalendarModel.updateIntimacyLog(intimacyId, user.id, {
        time,
        isProtected,
        notes,
      });
      
      res.status(200).json({
        message: 'Intimacy log updated successfully',
        intimacyLog,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get an intimacy log by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getIntimacyLog(req, res, next) {
    try {
      const { uid } = req.user;
      const { intimacyId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get intimacy log
      const intimacyLog = await CalendarModel.getIntimacyLogById(intimacyId, user.id);
      
      res.status(200).json({
        intimacyLog,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get all intimacy logs for a user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getIntimacyLogs(req, res, next) {
    try {
      const { uid } = req.user;
      const { startDate, endDate, limit, offset } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get intimacy logs
      const intimacyLogs = await CalendarModel.getIntimacyLogs(user.id, {
        startDate,
        endDate,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });
      
      res.status(200).json({
        intimacyLogs,
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Delete an intimacy log
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteIntimacyLog(req, res, next) {
    try {
      const { uid } = req.user;
      const { intimacyId } = req.params;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Delete intimacy log
      await CalendarModel.deleteIntimacyLog(intimacyId, user.id);
      
      res.status(200).json({
        message: 'Intimacy log deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Get upcoming fertility events
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getUpcomingFertilityEvents(req, res, next) {
    try {
      const { uid } = req.user;
      const { days } = req.query;
      
      // Get user from database
      const user = await UserModel.getByFirebaseUid(uid);
      
      // Get upcoming fertility events
      const events = await CalendarModel.getUpcomingFertilityEvents(
        user.id,
        days ? parseInt(days) : undefined
      );
      
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CalendarController;
