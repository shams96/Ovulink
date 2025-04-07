const { query, getClient } = require('../utils/db');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Male Health model for database operations
 */
class MaleHealthModel {
  /**
   * Create a new sperm health record
   * @param {string} userId - User ID
   * @param {Object} spermData - Sperm health data
   * @returns {Promise<Object>} - Created sperm health record
   */
  static async createSpermHealth(userId, spermData) {
    const { date, count, motility, morphology, volume, notes } = spermData;
    
    try {
      const result = await query(
        `INSERT INTO sperm_health (user_id, date, count, motility, morphology, volume, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, date, count, motility, morphology, volume, notes]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw ApiError.conflict('Sperm health record already exists for this date');
      }
      throw error;
    }
  }
  
  /**
   * Update a sperm health record
   * @param {string} spermId - Sperm health ID
   * @param {string} userId - User ID
   * @param {Object} spermData - Sperm health data
   * @returns {Promise<Object>} - Updated sperm health record
   */
  static async updateSpermHealth(spermId, userId, spermData) {
    const { count, motility, morphology, volume, notes } = spermData;
    
    // Get the current sperm health record
    const currentSperm = await this.getSpermHealthById(spermId, userId);
    
    // Update the sperm health record
    const result = await query(
      `UPDATE sperm_health
       SET count = $1, motility = $2, morphology = $3, volume = $4, notes = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        count !== undefined ? count : currentSperm.count,
        motility !== undefined ? motility : currentSperm.motility,
        morphology !== undefined ? morphology : currentSperm.morphology,
        volume !== undefined ? volume : currentSperm.volume,
        notes || currentSperm.notes,
        spermId,
        userId,
      ]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Sperm health record not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get a sperm health record by ID
   * @param {string} spermId - Sperm health ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Sperm health record
   */
  static async getSpermHealthById(spermId, userId) {
    const result = await query(
      'SELECT * FROM sperm_health WHERE id = $1 AND user_id = $2',
      [spermId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Sperm health record not found or not owned by user');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get all sperm health records for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Sperm health records
   */
  static async getSpermHealthRecords(userId, options = {}) {
    const { limit = 30, offset = 0, startDate, endDate } = options;
    
    let queryText = 'SELECT * FROM sperm_health WHERE user_id = $1';
    const params = [userId];
    
    if (startDate) {
      queryText += ' AND date >= $' + (params.length + 1);
      params.push(startDate);
    }
    
    if (endDate) {
      queryText += ' AND date <= $' + (params.length + 1);
      params.push(endDate);
    }
    
    queryText += ' ORDER BY date DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    return result.rows;
  }
  
  /**
   * Delete a sperm health record
   * @param {string} spermId - Sperm health ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteSpermHealth(spermId, userId) {
    const result = await query(
      'DELETE FROM sperm_health WHERE id = $1 AND user_id = $2 RETURNING id',
      [spermId, userId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Sperm health record not found or not owned by user');
    }
    
    return true;
  }
  
  /**
   * Calculate sperm health score
   * @param {Object} spermData - Sperm health data
   * @returns {Object} - Sperm health score and analysis
   */
  static calculateSpermHealthScore(spermData) {
    const { count, motility, morphology, volume } = spermData;
    
    // Define reference ranges based on WHO guidelines
    const countRange = { min: 15, optimal: 40 }; // millions/ml
    const motilityRange = { min: 40, optimal: 60 }; // percentage
    const morphologyRange = { min: 4, optimal: 15 }; // percentage
    const volumeRange = { min: 1.5, optimal: 4 }; // ml
    
    // Calculate individual scores (0-100)
    let countScore = 0;
    let motilityScore = 0;
    let morphologyScore = 0;
    let volumeScore = 0;
    
    if (count !== undefined && count !== null) {
      if (count >= countRange.optimal) {
        countScore = 100;
      } else if (count >= countRange.min) {
        countScore = 50 + (count - countRange.min) / (countRange.optimal - countRange.min) * 50;
      } else if (count > 0) {
        countScore = count / countRange.min * 50;
      }
    }
    
    if (motility !== undefined && motility !== null) {
      if (motility >= motilityRange.optimal) {
        motilityScore = 100;
      } else if (motility >= motilityRange.min) {
        motilityScore = 50 + (motility - motilityRange.min) / (motilityRange.optimal - motilityRange.min) * 50;
      } else if (motility > 0) {
        motilityScore = motility / motilityRange.min * 50;
      }
    }
    
    if (morphology !== undefined && morphology !== null) {
      if (morphology >= morphologyRange.optimal) {
        morphologyScore = 100;
      } else if (morphology >= morphologyRange.min) {
        morphologyScore = 50 + (morphology - morphologyRange.min) / (morphologyRange.optimal - morphologyRange.min) * 50;
      } else if (morphology > 0) {
        morphologyScore = morphology / morphologyRange.min * 50;
      }
    }
    
    if (volume !== undefined && volume !== null) {
      if (volume >= volumeRange.optimal) {
        volumeScore = 100;
      } else if (volume >= volumeRange.min) {
        volumeScore = 50 + (volume - volumeRange.min) / (volumeRange.optimal - volumeRange.min) * 50;
      } else if (volume > 0) {
        volumeScore = volume / volumeRange.min * 50;
      }
    }
    
    // Calculate overall score
    let totalFactors = 0;
    let totalScore = 0;
    
    if (count !== undefined && count !== null) {
      totalFactors++;
      totalScore += countScore;
    }
    
    if (motility !== undefined && motility !== null) {
      totalFactors++;
      totalScore += motilityScore;
    }
    
    if (morphology !== undefined && morphology !== null) {
      totalFactors++;
      totalScore += morphologyScore;
    }
    
    if (volume !== undefined && volume !== null) {
      totalFactors++;
      totalScore += volumeScore;
    }
    
    const overallScore = totalFactors > 0 ? Math.round(totalScore / totalFactors) : 0;
    
    // Generate analysis
    let analysis = '';
    let category = '';
    
    if (overallScore >= 80) {
      category = 'Excellent';
      analysis = 'Your sperm health parameters are excellent, indicating optimal fertility potential.';
    } else if (overallScore >= 60) {
      category = 'Good';
      analysis = 'Your sperm health parameters are good, indicating favorable fertility potential.';
    } else if (overallScore >= 40) {
      category = 'Fair';
      analysis = 'Your sperm health parameters are fair, indicating moderate fertility potential.';
    } else if (overallScore > 0) {
      category = 'Poor';
      analysis = 'Your sperm health parameters are below optimal levels, which may affect fertility potential.';
    } else {
      category = 'Unknown';
      analysis = 'Not enough data to provide an accurate analysis.';
    }
    
    // Add specific recommendations
    let recommendations = [];
    
    if (count !== undefined && count !== null && count < countRange.min) {
      recommendations.push('Sperm count is below the recommended range. Consider lifestyle changes such as reducing alcohol consumption, quitting smoking, and maintaining a healthy weight.');
    }
    
    if (motility !== undefined && motility !== null && motility < motilityRange.min) {
      recommendations.push('Sperm motility is below the recommended range. Regular exercise, a balanced diet rich in antioxidants, and reducing stress may help improve motility.');
    }
    
    if (morphology !== undefined && morphology !== null && morphology < morphologyRange.min) {
      recommendations.push('Sperm morphology is below the recommended range. Avoiding excessive heat exposure to the testicles, reducing alcohol intake, and increasing intake of fruits and vegetables may help improve morphology.');
    }
    
    if (volume !== undefined && volume !== null && volume < volumeRange.min) {
      recommendations.push('Semen volume is below the recommended range. Staying well-hydrated, maintaining a balanced diet, and ensuring adequate zinc intake may help improve volume.');
    }
    
    return {
      overallScore,
      category,
      analysis,
      recommendations,
      individualScores: {
        count: {
          value: count,
          score: Math.round(countScore),
          minReference: countRange.min,
          optimalReference: countRange.optimal,
        },
        motility: {
          value: motility,
          score: Math.round(motilityScore),
          minReference: motilityRange.min,
          optimalReference: motilityRange.optimal,
        },
        morphology: {
          value: morphology,
          score: Math.round(morphologyScore),
          minReference: morphologyRange.min,
          optimalReference: morphologyRange.optimal,
        },
        volume: {
          value: volume,
          score: Math.round(volumeScore),
          minReference: volumeRange.min,
          optimalReference: volumeRange.optimal,
        },
      },
    };
  }
  
  /**
   * Get sperm health trends for a user
   * @param {string} userId - User ID
   * @param {number} months - Number of months to analyze
   * @returns {Promise<Object>} - Trend analysis
   */
  static async getSpermHealthTrends(userId, months = 6) {
    // Calculate the start date (X months ago)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    // Get sperm health records for the period
    const records = await this.getSpermHealthRecords(userId, {
      startDate: startDate.toISOString().split('T')[0],
      limit: 100, // High limit to get all records in the period
    });
    
    if (records.length < 2) {
      return {
        message: 'Not enough data for trend analysis',
        trends: null,
      };
    }
    
    // Prepare data for trend analysis
    const countData = records.map(r => ({ date: r.date, value: r.count })).filter(d => d.value !== null);
    const motilityData = records.map(r => ({ date: r.date, value: r.motility })).filter(d => d.value !== null);
    const morphologyData = records.map(r => ({ date: r.date, value: r.morphology })).filter(d => d.value !== null);
    const volumeData = records.map(r => ({ date: r.date, value: r.volume })).filter(d => d.value !== null);
    
    // Calculate trends (simple linear regression)
    const countTrend = this.calculateTrend(countData);
    const motilityTrend = this.calculateTrend(motilityData);
    const morphologyTrend = this.calculateTrend(morphologyData);
    const volumeTrend = this.calculateTrend(volumeData);
    
    // Calculate overall scores for each record
    const scores = records.map(record => {
      const score = this.calculateSpermHealthScore(record);
      return {
        date: record.date,
        score: score.overallScore,
      };
    });
    
    const scoreTrend = this.calculateTrend(scores);
    
    return {
      message: `Trend analysis based on ${records.length} records over the past ${months} months`,
      trends: {
        count: countTrend,
        motility: motilityTrend,
        morphology: morphologyTrend,
        volume: volumeTrend,
        overallScore: scoreTrend,
      },
      records: records.map(record => ({
        date: record.date,
        score: this.calculateSpermHealthScore(record).overallScore,
      })),
    };
  }
  
  /**
   * Calculate trend from data points
   * @param {Array} data - Array of {date, value} objects
   * @returns {Object} - Trend analysis
   */
  static calculateTrend(data) {
    if (data.length < 2) {
      return {
        direction: 'unknown',
        percentage: 0,
        message: 'Not enough data',
      };
    }
    
    // Sort data by date (oldest first)
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Simple trend calculation (first vs last)
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    
    if (firstValue === 0) {
      return {
        direction: lastValue > 0 ? 'improving' : 'stable',
        percentage: 0,
        message: lastValue > 0 ? 'Improving from zero baseline' : 'No change from zero baseline',
      };
    }
    
    const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
    
    let direction = 'stable';
    let message = 'No significant change';
    
    if (percentageChange > 5) {
      direction = 'improving';
      message = `Improving by ${Math.abs(Math.round(percentageChange))}%`;
    } else if (percentageChange < -5) {
      direction = 'declining';
      message = `Declining by ${Math.abs(Math.round(percentageChange))}%`;
    }
    
    return {
      direction,
      percentage: Math.round(percentageChange),
      message,
    };
  }
}

module.exports = MaleHealthModel;
