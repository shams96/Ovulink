const { query, getClient } = require('../utils/db');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Female Health model for database operations
 */
class FemaleHealthModel {
  /**
   * Create a new menstrual cycle record
   * @param {string} userId - User ID
   * @param {Object} cycleData - Cycle data
   * @returns {Promise<Object>} - Created cycle
   */
  static async createCycle(userId, cycleData) {
    const { start_date, end_date, flow, notes } = cycleData;
    
    try {
      const result = await query(
        `INSERT INTO menstrual_cycles (user_id, start_date, end_date, flow, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, start_date, end_date, flow, notes]
      );
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update a menstrual cycle record
   * @param {string} cycleId - Cycle ID
   * @param {string} userId - User ID
   * @param {Object} cycleData - Cycle data
   * @returns {Promise<Object>} - Updated cycle
   */
  static async updateCycle(cycleId, userId, cycleData) {
    const { end_date, flow, notes } = cycleData;
    
    // Get the current cycle
    const currentCycle = await this.getCycleById(cycleId, userId);
    
    // Update the cycle
    const result = await query(
      `UPDATE menstrual_cycles
       SET end_date = $1, flow = $2, notes = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [
        end_date || currentCycle.end_date,
        flow || currentCycle.flow,
        notes || currentCycle.notes,
        cycleId,
        userId,
      ]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Cycle not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get a menstrual cycle by ID
   * @param {string} cycleId - Cycle ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Cycle
   */
  static async getCycleById(cycleId, userId) {
    const result = await query(
      'SELECT * FROM menstrual_cycles WHERE id = $1 AND user_id = $2',
      [cycleId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Cycle not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get all menstrual cycles for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Cycles
   */
  static async getCycles(userId, options = {}) {
    const { limit = 12, offset = 0, startDate, endDate } = options;
    
    let query = 'SELECT * FROM menstrual_cycles WHERE user_id = $1';
    const params = [userId];
    
    if (startDate) {
      query += ' AND start_date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND start_date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    query += ' ORDER BY start_date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(query, params);
    
    return result.rows;
  }
  
  /**
   * Delete a menstrual cycle
   * @param {string} cycleId - Cycle ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteCycle(cycleId, userId) {
    const result = await query(
      'DELETE FROM menstrual_cycles WHERE id = $1 AND user_id = $2 RETURNING id',
      [cycleId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Cycle not found or not owned by user');
    }
    
    return true;
  }
  
  /**
   * Create a new temperature record
   * @param {string} userId - User ID
   * @param {Object} tempData - Temperature data
   * @returns {Promise<Object>} - Created temperature record
   */
  static async createTemperature(userId, tempData) {
    const { date, time, value, notes } = tempData;
    
    try {
      const result = await query(
        `INSERT INTO temperatures (user_id, date, time, value, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, date, time, value, notes]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw ApiError.conflict('Temperature record already exists for this date');
      }
      throw error;
    }
  }
  
  /**
   * Update a temperature record
   * @param {string} tempId - Temperature ID
   * @param {string} userId - User ID
   * @param {Object} tempData - Temperature data
   * @returns {Promise<Object>} - Updated temperature record
   */
  static async updateTemperature(tempId, userId, tempData) {
    const { time, value, notes } = tempData;
    
    // Get the current temperature record
    const currentTemp = await this.getTemperatureById(tempId, userId);
    
    // Update the temperature record
    const result = await query(
      `UPDATE temperatures
       SET time = $1, value = $2, notes = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [
        time || currentTemp.time,
        value || currentTemp.value,
        notes || currentTemp.notes,
        tempId,
        userId,
      ]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Temperature record not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get a temperature record by ID
   * @param {string} tempId - Temperature ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Temperature record
   */
  static async getTemperatureById(tempId, userId) {
    const result = await query(
      'SELECT * FROM temperatures WHERE id = $1 AND user_id = $2',
      [tempId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Temperature record not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get all temperature records for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Temperature records
   */
  static async getTemperatures(userId, options = {}) {
    const { limit = 30, offset = 0, startDate, endDate } = options;
    
    let query = 'SELECT * FROM temperatures WHERE user_id = $1';
    const params = [userId];
    
    if (startDate) {
      query += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    query += ' ORDER BY date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(query, params);
    
    return result.rows;
  }
  
  /**
   * Delete a temperature record
   * @param {string} tempId - Temperature ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteTemperature(tempId, userId) {
    const result = await query(
      'DELETE FROM temperatures WHERE id = $1 AND user_id = $2 RETURNING id',
      [tempId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Temperature record not found or not owned by user');
    }
    
    return true;
  }
  
  /**
   * Create a new cervical mucus record
   * @param {string} userId - User ID
   * @param {Object} mucusData - Cervical mucus data
   * @returns {Promise<Object>} - Created cervical mucus record
   */
  static async createCervicalMucus(userId, mucusData) {
    const { date, type, amount, notes } = mucusData;
    
    try {
      const result = await query(
        `INSERT INTO cervical_mucus (user_id, date, type, amount, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, date, type, amount, notes]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw ApiError.conflict('Cervical mucus record already exists for this date');
      }
      throw error;
    }
  }
  
  /**
   * Update a cervical mucus record
   * @param {string} mucusId - Cervical mucus ID
   * @param {string} userId - User ID
   * @param {Object} mucusData - Cervical mucus data
   * @returns {Promise<Object>} - Updated cervical mucus record
   */
  static async updateCervicalMucus(mucusId, userId, mucusData) {
    const { type, amount, notes } = mucusData;
    
    // Get the current cervical mucus record
    const currentMucus = await this.getCervicalMucusById(mucusId, userId);
    
    // Update the cervical mucus record
    const result = await query(
      `UPDATE cervical_mucus
       SET type = $1, amount = $2, notes = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [
        type || currentMucus.type,
        amount || currentMucus.amount,
        notes || currentMucus.notes,
        mucusId,
        userId,
      ]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Cervical mucus record not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get a cervical mucus record by ID
   * @param {string} mucusId - Cervical mucus ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Cervical mucus record
   */
  static async getCervicalMucusById(mucusId, userId) {
    const result = await query(
      'SELECT * FROM cervical_mucus WHERE id = $1 AND user_id = $2',
      [mucusId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Cervical mucus record not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get all cervical mucus records for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Cervical mucus records
   */
  static async getCervicalMucusRecords(userId, options = {}) {
    const { limit = 30, offset = 0, startDate, endDate } = options;
    
    let query = 'SELECT * FROM cervical_mucus WHERE user_id = $1';
    const params = [userId];
    
    if (startDate) {
      query += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    query += ' ORDER BY date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(query, params);
    
    return result.rows;
  }
  
  /**
   * Delete a cervical mucus record
   * @param {string} mucusId - Cervical mucus ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteCervicalMucus(mucusId, userId) {
    const result = await query(
      'DELETE FROM cervical_mucus WHERE id = $1 AND user_id = $2 RETURNING id',
      [mucusId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Cervical mucus record not found or not owned by user');
    }
    
    return true;
  }
  
  /**
   * Predict ovulation based on menstrual cycle data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Prediction results
   */
  static async predictOvulation(userId) {
    // Get the last 6 cycles
    const cycles = await this.getCycles(userId, { limit: 6 });
    
    if (cycles.length < 2) {
      return {
        message: 'Not enough cycle data for prediction',
        prediction: null,
      };
    }
    
    // Calculate average cycle length
    let totalDays = 0;
    let cycleLengths = [];
    
    for (let i = 0; i < cycles.length - 1; i++) {
      const currentCycle = cycles[i];
      const nextCycle = cycles[i + 1];
      
      const currentStart = new Date(currentCycle.start_date);
      const nextStart = new Date(nextCycle.start_date);
      
      const diffTime = Math.abs(nextStart - currentStart);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      cycleLengths.push(diffDays);
      totalDays += diffDays;
    }
    
    const avgCycleLength = Math.round(totalDays / (cycles.length - 1));
    
    // Get the most recent cycle
    const lastCycle = cycles[0];
    const lastCycleStart = new Date(lastCycle.start_date);
    
    // Predict next period
    const nextPeriodDate = new Date(lastCycleStart);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
    
    // Predict ovulation (typically 14 days before next period)
    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);
    
    // Calculate fertile window (typically 5 days before ovulation to 1 day after)
    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);
    
    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);
    
    return {
      message: 'Prediction based on your last ' + cycles.length + ' cycles',
      prediction: {
        averageCycleLength: avgCycleLength,
        cycleLengths,
        lastPeriodStart: lastCycleStart.toISOString().split('T')[0],
        nextPeriodPrediction: nextPeriodDate.toISOString().split('T')[0],
        ovulationPrediction: ovulationDate.toISOString().split('T')[0],
        fertileWindowStart: fertileWindowStart.toISOString().split('T')[0],
        fertileWindowEnd: fertileWindowEnd.toISOString().split('T')[0],
      },
    };
  }
}

module.exports = FemaleHealthModel;
