/**
 * User model
 * Provides database operations for users
 */

const { query, transaction } = require('../utils/db');
const logger = require('../utils/logger');
const { ApiError, ERROR_CODES } = require('../middleware/errorHandler');

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findById = async (id) => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error(`Error finding user by ID (${id}):`, error);
    throw error;
  }
};

/**
 * Find user by Firebase UID
 * @param {string} firebaseUid - Firebase UID
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findByFirebaseUid = async (firebaseUid) => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [firebaseUid]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error(`Error finding user by Firebase UID (${firebaseUid}):`, error);
    throw error;
  }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findByEmail = async (email) => {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    logger.error(`Error finding user by email (${email}):`, error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const create = async (userData) => {
  try {
    // Check if user with email already exists
    const existingUser = await findByEmail(userData.email);
    
    if (existingUser) {
      throw new ApiError(
        ERROR_CODES.CONFLICT,
        'CONFLICT',
        'User with this email already exists'
      );
    }
    
    // Check if user with Firebase UID already exists
    const existingFirebaseUser = await findByFirebaseUid(userData.firebaseUid);
    
    if (existingFirebaseUser) {
      throw new ApiError(
        ERROR_CODES.CONFLICT,
        'CONFLICT',
        'User with this Firebase UID already exists'
      );
    }
    
    // Create user
    const result = await query(
      `INSERT INTO users (
        firebase_uid,
        email,
        display_name,
        gender,
        birth_date,
        phone_number,
        height,
        weight
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        userData.firebaseUid,
        userData.email,
        userData.displayName,
        userData.gender,
        userData.birthDate,
        userData.phoneNumber,
        userData.height,
        userData.weight,
      ]
    );
    
    // Create notification preferences
    await query(
      'INSERT INTO notification_preferences (user_id) VALUES ($1)',
      [result.rows[0].id]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated user
 */
const update = async (id, userData) => {
  try {
    // Check if user exists
    const existingUser = await findById(id);
    
    if (!existingUser) {
      throw new ApiError(
        ERROR_CODES.NOT_FOUND,
        'NOT_FOUND',
        'User not found'
      );
    }
    
    // Update user
    const result = await query(
      `UPDATE users
       SET
         display_name = COALESCE($1, display_name),
         phone_number = COALESCE($2, phone_number),
         height = COALESCE($3, height),
         weight = COALESCE($4, weight),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        userData.displayName,
        userData.phoneNumber,
        userData.height,
        userData.weight,
        id,
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating user (${id}):`, error);
    throw error;
  }
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<boolean>} True if user was deleted
 */
const remove = async (id) => {
  try {
    // Check if user exists
    const existingUser = await findById(id);
    
    if (!existingUser) {
      throw new ApiError(
        ERROR_CODES.NOT_FOUND,
        'NOT_FOUND',
        'User not found'
      );
    }
    
    // Delete user
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    return result.rowCount > 0;
  } catch (error) {
    logger.error(`Error deleting user (${id}):`, error);
    throw error;
  }
};

/**
 * Find all users
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of users to return
 * @param {number} options.offset - Number of users to skip
 * @returns {Promise<Object>} Users and count
 */
const findAll = async (options = {}) => {
  try {
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    // Get users
    const result = await query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM users');
    
    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  } catch (error) {
    logger.error('Error finding all users:', error);
    throw error;
  }
};

/**
 * Link partner
 * @param {string} userId - User ID
 * @param {string} partnerEmail - Partner email
 * @returns {Promise<Object>} Partner link
 */
const linkPartner = async (userId, partnerEmail) => {
  try {
    // Check if user exists
    const user = await findById(userId);
    
    if (!user) {
      throw new ApiError(
        ERROR_CODES.NOT_FOUND,
        'NOT_FOUND',
        'User not found'
      );
    }
    
    // Check if partner exists
    const partner = await findByEmail(partnerEmail);
    
    if (!partner) {
      throw new ApiError(
        ERROR_CODES.NOT_FOUND,
        'NOT_FOUND',
        'Partner not found'
      );
    }
    
    // Check if user is trying to link themselves
    if (user.id === partner.id) {
      throw new ApiError(
        ERROR_CODES.INVALID_REQUEST,
        'INVALID_REQUEST',
        'Cannot link yourself as a partner'
      );
    }
    
    // Check if link already exists
    const existingLink = await query(
      `SELECT * FROM partner_links
       WHERE (user_id = $1 AND partner_id = $2)
       OR (user_id = $2 AND partner_id = $1)`,
      [user.id, partner.id]
    );
    
    if (existingLink.rows.length > 0) {
      throw new ApiError(
        ERROR_CODES.CONFLICT,
        'CONFLICT',
        'Partner link already exists'
      );
    }
    
    // Create partner link
    const result = await query(
      `INSERT INTO partner_links (user_id, partner_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [user.id, partner.id]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Error linking partner for user (${userId}):`, error);
    throw error;
  }
};

/**
 * Update partner link status
 * @param {string} linkId - Partner link ID
 * @param {string} userId - User ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated partner link
 */
const updatePartnerLinkStatus = async (linkId, userId, status) => {
  try {
    // Check if link exists
    const existingLink = await query(
      'SELECT * FROM partner_links WHERE id = $1',
      [linkId]
    );
    
    if (existingLink.rows.length === 0) {
      throw new ApiError(
        ERROR_CODES.NOT_FOUND,
        'NOT_FOUND',
        'Partner link not found'
      );
    }
    
    const link = existingLink.rows[0];
    
    // Check if user is the partner
    if (link.partner_id !== userId) {
      throw new ApiError(
        ERROR_CODES.FORBIDDEN,
        'FORBIDDEN',
        'Only the partner can update the link status'
      );
    }
    
    // Check if link is already accepted or rejected
    if (link.status !== 'pending') {
      throw new ApiError(
        ERROR_CODES.CONFLICT,
        'CONFLICT',
        'Partner link has already been processed'
      );
    }
    
    // Update link status
    const result = await query(
      `UPDATE partner_links
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, linkId]
    );
    
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating partner link status (${linkId}):`, error);
    throw error;
  }
};

/**
 * Get partner links
 * @param {string} userId - User ID
 * @returns {Promise<Object[]>} Partner links
 */
const getPartnerLinks = async (userId) => {
  try {
    // Get links where user is either the user or the partner
    const result = await query(
      `SELECT pl.*, 
        u1.display_name as user_display_name, 
        u1.gender as user_gender,
        u2.display_name as partner_display_name, 
        u2.gender as partner_gender
       FROM partner_links pl
       JOIN users u1 ON pl.user_id = u1.id
       JOIN users u2 ON pl.partner_id = u2.id
       WHERE pl.user_id = $1 OR pl.partner_id = $1`,
      [userId]
    );
    
    return result.rows;
  } catch (error) {
    logger.error(`Error getting partner links for user (${userId}):`, error);
    throw error;
  }
};

/**
 * Get partner
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Partner or null if not found
 */
const getPartner = async (userId) => {
  try {
    // Get accepted link where user is either the user or the partner
    const result = await query(
      `SELECT pl.*, 
        u1.id as user_id, 
        u1.display_name as user_display_name, 
        u1.gender as user_gender,
        u2.id as partner_id, 
        u2.display_name as partner_display_name, 
        u2.gender as partner_gender
       FROM partner_links pl
       JOIN users u1 ON pl.user_id = u1.id
       JOIN users u2 ON pl.partner_id = u2.id
       WHERE (pl.user_id = $1 OR pl.partner_id = $1)
       AND pl.status = 'accepted'
       LIMIT 1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const link = result.rows[0];
    
    // Determine which user is the partner
    let partner;
    
    if (link.user_id === userId) {
      partner = {
        id: link.partner_id,
        displayName: link.partner_display_name,
        gender: link.partner_gender,
      };
    } else {
      partner = {
        id: link.user_id,
        displayName: link.user_display_name,
        gender: link.user_gender,
      };
    }
    
    return partner;
  } catch (error) {
    logger.error(`Error getting partner for user (${userId}):`, error);
    throw error;
  }
};

module.exports = {
  findById,
  findByFirebaseUid,
  findByEmail,
  create,
  update,
  remove,
  findAll,
  linkPartner,
  updatePartnerLinkStatus,
  getPartnerLinks,
  getPartner,
};
