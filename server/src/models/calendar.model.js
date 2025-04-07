const { query, getClient } = require('../utils/db');
const { ApiError } = require('../middleware/errorHandler');
const UserModel = require('./user.model');

/**
 * Calendar model for database operations
 */
class CalendarModel {
  /**
   * Create a new appointment
   * @param {string} userId - User ID
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} - Created appointment
   */
  static async createAppointment(userId, appointmentData) {
    const { title, date, time, location, notes, reminderTime, isShared } = appointmentData;
    
    try {
      const result = await query(
        `INSERT INTO appointments (user_id, title, date, time, location, notes, reminder_time, is_shared)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, title, date, time, location, notes, reminderTime, isShared]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update an appointment
   * @param {string} appointmentId - Appointment ID
   * @param {string} userId - User ID
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise<Object>} - Updated appointment
   */
  static async updateAppointment(appointmentId, userId, appointmentData) {
    const { title, date, time, location, notes, reminderTime, isShared } = appointmentData;
    
    // Get the current appointment
    const currentAppointment = await this.getAppointmentById(appointmentId, userId);
    
    // Update the appointment
    const result = await query(
      `UPDATE appointments
       SET title = $1, date = $2, time = $3, location = $4, notes = $5, reminder_time = $6, is_shared = $7
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [
        title || currentAppointment.title,
        date || currentAppointment.date,
        time || currentAppointment.time,
        location !== undefined ? location : currentAppointment.location,
        notes !== undefined ? notes : currentAppointment.notes,
        reminderTime !== undefined ? reminderTime : currentAppointment.reminder_time,
        isShared !== undefined ? isShared : currentAppointment.is_shared,
        appointmentId,
        userId,
      ]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Appointment not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get an appointment by ID
   * @param {string} appointmentId - Appointment ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Appointment
   */
  static async getAppointmentById(appointmentId, userId) {
    const result = await query(
      'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
      [appointmentId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Appointment not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get all appointments for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Appointments
   */
  static async getAppointments(userId, options = {}) {
    const { startDate, endDate, includePartnerAppointments = false } = options;
    
    let queryText = 'SELECT * FROM appointments WHERE user_id = $1';
    const params = [userId];
    
    if (startDate) {
      queryText += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      queryText += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    // Get user's appointments
    const result = await query(queryText, params);
    let appointments = result.rows;
    
    // If includePartnerAppointments is true, get partner's shared appointments
    if (includePartnerAppointments) {
      // Get partner links
      const partnerLinks = await query(
        `SELECT partner_id FROM partner_links 
         WHERE user_id = $1 AND status = 'accepted'
         UNION
         SELECT user_id FROM partner_links
         WHERE partner_id = $1 AND status = 'accepted'`,
        [userId]
      );
      
      // If user has partners, get their shared appointments
      if (partnerLinks.rows.length > 0) {
        const partnerIds = partnerLinks.rows.map(row => row.partner_id);
        
        let partnerQueryText = 'SELECT a.*, u.display_name as partner_name FROM appointments a JOIN users u ON a.user_id = u.id WHERE a.user_id = ANY($1) AND a.is_shared = true';
        const partnerParams = [partnerIds];
        
        if (startDate) {
          partnerQueryText += ' AND a.date >= $' + (partnerParams.length + 1);
          partnerParams.push(startDate);
        }
        
        if (endDate) {
          partnerQueryText += ' AND a.date <= $' + (partnerParams.length + 1);
          partnerParams.push(endDate);
        }
        
        const partnerResult = await query(partnerQueryText, partnerParams);
        
        // Add partner appointments to the result
        appointments = appointments.concat(partnerResult.rows);
      }
    }
    
    // Sort appointments by date and time
    appointments.sort((a, b) => {
      const dateA = new Date(a.date + 'T' + (a.time || '00:00:00'));
      const dateB = new Date(b.date + 'T' + (b.time || '00:00:00'));
      return dateA - dateB;
    });
    
    return appointments;
  }
  
  /**
   * Delete an appointment
   * @param {string} appointmentId - Appointment ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteAppointment(appointmentId, userId) {
    const result = await query(
      'DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING id',
      [appointmentId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Appointment not found or not owned by user');
    }
    
    return true;
  }
  
  /**
   * Create a new intimacy log
   * @param {string} userId - User ID
   * @param {Object} intimacyData - Intimacy log data
   * @returns {Promise<Object>} - Created intimacy log
   */
  static async createIntimacyLog(userId, intimacyData) {
    const { date, time, isProtected, notes } = intimacyData;
    
    try {
      const result = await query(
        `INSERT INTO intimacy_logs (user_id, date, time, is_protected, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, date, time, isProtected, notes]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update an intimacy log
   * @param {string} intimacyId - Intimacy log ID
   * @param {string} userId - User ID
   * @param {Object} intimacyData - Intimacy log data
   * @returns {Promise<Object>} - Updated intimacy log
   */
  static async updateIntimacyLog(intimacyId, userId, intimacyData) {
    const { time, isProtected, notes } = intimacyData;
    
    // Get the current intimacy log
    const currentIntimacy = await this.getIntimacyLogById(intimacyId, userId);
    
    // Update the intimacy log
    const result = await query(
      `UPDATE intimacy_logs
       SET time = $1, is_protected = $2, notes = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [
        time || currentIntimacy.time,
        isProtected !== undefined ? isProtected : currentIntimacy.is_protected,
        notes !== undefined ? notes : currentIntimacy.notes,
        intimacyId,
        userId,
      ]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Intimacy log not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get an intimacy log by ID
   * @param {string} intimacyId - Intimacy log ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Intimacy log
   */
  static async getIntimacyLogById(intimacyId, userId) {
    const result = await query(
      'SELECT * FROM intimacy_logs WHERE id = $1 AND user_id = $2',
      [intimacyId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Intimacy log not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get all intimacy logs for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Intimacy logs
   */
  static async getIntimacyLogs(userId, options = {}) {
    const { startDate, endDate, limit = 30, offset = 0 } = options;
    
    let queryText = 'SELECT * FROM intimacy_logs WHERE user_id = $1';
    const params = [userId];
    
    if (startDate) {
      queryText += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      queryText += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    queryText += ' ORDER BY date DESC, time DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    return result.rows;
  }
  
  /**
   * Delete an intimacy log
   * @param {string} intimacyId - Intimacy log ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteIntimacyLog(intimacyId, userId) {
    const result = await query(
      'DELETE FROM intimacy_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [intimacyId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Intimacy log not found or not owned by user');
    }
    
    return true;
  }
  
  /**
   * Get upcoming fertility events
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look ahead
   * @returns {Promise<Object>} - Fertility events
   */
  static async getUpcomingFertilityEvents(userId, days = 30) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get user
      const userResult = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        throw ApiError.notFound('User not found');
      }
      
      const user = userResult.rows[0];
      
      // Calculate date range
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + days);
      
      const todayStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Initialize events array
      let events = [];
      
      // Get appointments in the date range
      const appointmentsResult = await client.query(
        'SELECT * FROM appointments WHERE user_id = $1 AND date >= $2 AND date <= $3',
        [userId, todayStr, endDateStr]
      );
      
      // Add appointments to events
      events = events.concat(
        appointmentsResult.rows.map(appointment => ({
          type: 'appointment',
          title: appointment.title,
          date: appointment.date,
          time: appointment.time,
          data: appointment,
        }))
      );
      
      // If user is female, get fertility predictions
      if (user.gender === 'female') {
        // Get the last menstrual cycle
        const cyclesResult = await client.query(
          'SELECT * FROM menstrual_cycles WHERE user_id = $1 ORDER BY start_date DESC LIMIT 6',
          [userId]
        );
        
        if (cyclesResult.rows.length >= 2) {
          const cycles = cyclesResult.rows;
          
          // Calculate average cycle length
          let totalDays = 0;
          for (let i = 0; i < cycles.length - 1; i++) {
            const currentCycle = cycles[i];
            const nextCycle = cycles[i + 1];
            
            const currentStart = new Date(currentCycle.start_date);
            const nextStart = new Date(nextCycle.start_date);
            
            const diffTime = Math.abs(nextStart - currentStart);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            totalDays += diffDays;
          }
          
          const avgCycleLength = Math.round(totalDays / (cycles.length - 1));
          
          // Get the most recent cycle
          const lastCycle = cycles[0];
          const lastCycleStart = new Date(lastCycle.start_date);
          
          // Predict next period
          const nextPeriodDate = new Date(lastCycleStart);
          nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
          
          // If next period is within the date range, add it to events
          if (nextPeriodDate >= today && nextPeriodDate <= endDate) {
            events.push({
              type: 'period',
              title: 'Predicted Period Start',
              date: nextPeriodDate.toISOString().split('T')[0],
              time: null,
              data: {
                predictedDate: nextPeriodDate.toISOString().split('T')[0],
                avgCycleLength,
              },
            });
          }
          
          // Predict ovulation (typically 14 days before next period)
          const ovulationDate = new Date(nextPeriodDate);
          ovulationDate.setDate(ovulationDate.getDate() - 14);
          
          // If ovulation is within the date range, add it to events
          if (ovulationDate >= today && ovulationDate <= endDate) {
            events.push({
              type: 'ovulation',
              title: 'Predicted Ovulation',
              date: ovulationDate.toISOString().split('T')[0],
              time: null,
              data: {
                predictedDate: ovulationDate.toISOString().split('T')[0],
              },
            });
          }
          
          // Calculate fertile window (typically 5 days before ovulation to 1 day after)
          const fertileWindowStart = new Date(ovulationDate);
          fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);
          
          const fertileWindowEnd = new Date(ovulationDate);
          fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);
          
          // If fertile window start is within the date range, add it to events
          if (fertileWindowStart >= today && fertileWindowStart <= endDate) {
            events.push({
              type: 'fertile_window_start',
              title: 'Fertile Window Start',
              date: fertileWindowStart.toISOString().split('T')[0],
              time: null,
              data: {
                predictedDate: fertileWindowStart.toISOString().split('T')[0],
              },
            });
          }
          
          // If fertile window end is within the date range, add it to events
          if (fertileWindowEnd >= today && fertileWindowEnd <= endDate) {
            events.push({
              type: 'fertile_window_end',
              title: 'Fertile Window End',
              date: fertileWindowEnd.toISOString().split('T')[0],
              time: null,
              data: {
                predictedDate: fertileWindowEnd.toISOString().split('T')[0],
              },
            });
          }
        }
      }
      
      // Get partner's shared appointments
      const partnerLinks = await client.query(
        `SELECT partner_id FROM partner_links 
         WHERE user_id = $1 AND status = 'accepted'
         UNION
         SELECT user_id FROM partner_links
         WHERE partner_id = $1 AND status = 'accepted'`,
        [userId]
      );
      
      if (partnerLinks.rows.length > 0) {
        const partnerIds = partnerLinks.rows.map(row => row.partner_id);
        
        const partnerAppointmentsResult = await client.query(
          `SELECT a.*, u.display_name as partner_name 
           FROM appointments a 
           JOIN users u ON a.user_id = u.id 
           WHERE a.user_id = ANY($1) AND a.is_shared = true AND a.date >= $2 AND a.date <= $3`,
          [partnerIds, todayStr, endDateStr]
        );
        
        // Add partner appointments to events
        events = events.concat(
          partnerAppointmentsResult.rows.map(appointment => ({
            type: 'partner_appointment',
            title: `${appointment.partner_name}: ${appointment.title}`,
            date: appointment.date,
            time: appointment.time,
            data: appointment,
          }))
        );
      }
      
      // Sort events by date and time
      events.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + (a.time || '00:00:00'));
        const dateB = new Date(b.date + 'T' + (b.time || '00:00:00'));
        return dateA - dateB;
      });
      
      await client.query('COMMIT');
      
      return {
        events,
        dateRange: {
          start: todayStr,
          end: endDateStr,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = CalendarModel;
