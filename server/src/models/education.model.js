const { query, getClient } = require('../utils/db');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Education model for database operations
 */
class EducationModel {
  /**
   * Get all educational content
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Educational content
   */
  static async getAllContent(options = {}) {
    const { limit = 20, offset = 0, category, tags, search } = options;
    
    let queryText = 'SELECT * FROM educational_content';
    const params = [];
    
    // Add WHERE clause if needed
    const conditions = [];
    
    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    
    if (tags && tags.length > 0) {
      conditions.push(`tags && $${params.length + 1}`);
      params.push(tags);
    }
    
    if (search) {
      conditions.push(`(title ILIKE $${params.length + 1} OR content ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add ORDER BY, LIMIT, and OFFSET
    queryText += ' ORDER BY published_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await query(queryText, params);
    
    return result.rows;
  }
  
  /**
   * Get educational content by ID
   * @param {string} contentId - Content ID
   * @returns {Promise<Object>} - Educational content
   */
  static async getContentById(contentId) {
    const result = await query(
      'SELECT * FROM educational_content WHERE id = $1',
      [contentId]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Educational content not found');
    }
    
    return result.rows[0];
  }
  
  /**
   * Get educational content by category
   * @param {string} category - Content category
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Educational content
   */
  static async getContentByCategory(category, options = {}) {
    const { limit = 20, offset = 0 } = options;
    
    const result = await query(
      'SELECT * FROM educational_content WHERE category = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
      [category, limit, offset]
    );
    
    return result.rows;
  }
  
  /**
   * Get educational content by tags
   * @param {Array} tags - Content tags
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Educational content
   */
  static async getContentByTags(tags, options = {}) {
    const { limit = 20, offset = 0 } = options;
    
    const result = await query(
      'SELECT * FROM educational_content WHERE tags && $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
      [tags, limit, offset]
    );
    
    return result.rows;
  }
  
  /**
   * Search educational content
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Educational content
   */
  static async searchContent(searchTerm, options = {}) {
    const { limit = 20, offset = 0 } = options;
    
    const result = await query(
      'SELECT * FROM educational_content WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
      [`%${searchTerm}%`, limit, offset]
    );
    
    return result.rows;
  }
  
  /**
   * Create a content interaction
   * @param {string} userId - User ID
   * @param {string} contentId - Content ID
   * @param {string} interactionType - Interaction type
   * @returns {Promise<Object>} - Content interaction
   */
  static async createContentInteraction(userId, contentId, interactionType) {
    try {
      // Check if content exists
      await this.getContentById(contentId);
      
      // Create or update interaction
      const result = await query(
        `INSERT INTO content_interactions (user_id, content_id, interaction_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, content_id, interaction_type)
         DO UPDATE SET created_at = NOW()
         RETURNING *`,
        [userId, contentId, interactionType]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw ApiError.conflict('Interaction already exists');
      }
      throw error;
    }
  }
  
  /**
   * Delete a content interaction
   * @param {string} userId - User ID
   * @param {string} contentId - Content ID
   * @param {string} interactionType - Interaction type
   * @returns {Promise<boolean>} - Success status
   */
  static async deleteContentInteraction(userId, contentId, interactionType) {
    const result = await query(
      'DELETE FROM content_interactions WHERE user_id = $1 AND content_id = $2 AND interaction_type = $3 RETURNING id',
      [userId, contentId, interactionType]
    );
    
    if (result.rows.length === 0) {
      throw ApiError.notFound('Interaction not found');
    }
    
    return true;
  }
  
  /**
   * Get user interactions with content
   * @param {string} userId - User ID
   * @param {string} contentId - Content ID
   * @returns {Promise<Array>} - User interactions
   */
  static async getUserContentInteractions(userId, contentId = null) {
    let queryText = 'SELECT * FROM content_interactions WHERE user_id = $1';
    const params = [userId];
    
    if (contentId) {
      queryText += ' AND content_id = $2';
      params.push(contentId);
    }
    
    const result = await query(queryText, params);
    
    return result.rows;
  }
  
  /**
   * Get recommended content for a user
   * @param {string} userId - User ID
   * @param {number} limit - Limit
   * @returns {Promise<Array>} - Recommended content
   */
  static async getRecommendedContent(userId, limit = 10) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get user's interactions
      const interactionsResult = await client.query(
        `SELECT content_id, interaction_type FROM content_interactions 
         WHERE user_id = $1`,
        [userId]
      );
      
      // Extract viewed, liked, and bookmarked content IDs
      const viewedContentIds = interactionsResult.rows
        .filter(row => row.interaction_type === 'view')
        .map(row => row.content_id);
      
      const likedContentIds = interactionsResult.rows
        .filter(row => row.interaction_type === 'like')
        .map(row => row.content_id);
      
      const bookmarkedContentIds = interactionsResult.rows
        .filter(row => row.interaction_type === 'bookmark')
        .map(row => row.content_id);
      
      // Get content categories and tags that the user has interacted with
      let userCategories = [];
      let userTags = [];
      
      if (viewedContentIds.length > 0 || likedContentIds.length > 0 || bookmarkedContentIds.length > 0) {
        const interactedContentIds = [...new Set([...viewedContentIds, ...likedContentIds, ...bookmarkedContentIds])];
        
        const contentResult = await client.query(
          'SELECT category, tags FROM educational_content WHERE id = ANY($1)',
          [interactedContentIds]
        );
        
        // Extract categories and tags
        userCategories = [...new Set(contentResult.rows.map(row => row.category))];
        userTags = [...new Set(contentResult.rows.flatMap(row => row.tags || []))];
      }
      
      // Build recommendation query
      let recommendationQuery = `
        SELECT ec.*, 
               CASE WHEN ec.id = ANY($1) THEN 3 ELSE 0 END +
               CASE WHEN ec.id = ANY($2) THEN 2 ELSE 0 END +
               CASE WHEN ec.id = ANY($3) THEN 1 ELSE 0 END +
               CASE WHEN ec.category = ANY($4) THEN 2 ELSE 0 END +
               CASE WHEN ec.tags && $5 THEN 1 ELSE 0 END AS score
        FROM educational_content ec
        WHERE ec.id <> ALL($6)
        ORDER BY score DESC, published_at DESC
        LIMIT $7
      `;
      
      const recommendationParams = [
        bookmarkedContentIds.length > 0 ? bookmarkedContentIds : [],
        likedContentIds.length > 0 ? likedContentIds : [],
        viewedContentIds.length > 0 ? viewedContentIds : [],
        userCategories.length > 0 ? userCategories : [],
        userTags.length > 0 ? userTags : [],
        viewedContentIds.length > 0 ? viewedContentIds : [],
        limit,
      ];
      
      const recommendationResult = await client.query(recommendationQuery, recommendationParams);
      
      // If we don't have enough recommendations, add some recent content
      if (recommendationResult.rows.length < limit) {
        const remainingLimit = limit - recommendationResult.rows.length;
        
        // Get IDs of already recommended content
        const recommendedIds = recommendationResult.rows.map(row => row.id);
        
        // Get recent content that hasn't been recommended yet
        const recentQuery = `
          SELECT * FROM educational_content
          WHERE id <> ALL($1) AND id <> ALL($2)
          ORDER BY published_at DESC
          LIMIT $3
        `;
        
        const recentParams = [
          recommendedIds.length > 0 ? recommendedIds : [],
          viewedContentIds.length > 0 ? viewedContentIds : [],
          remainingLimit,
        ];
        
        const recentResult = await client.query(recentQuery, recentParams);
        
        // Add recent content to recommendations
        recommendationResult.rows.push(...recentResult.rows);
      }
      
      await client.query('COMMIT');
      
      return recommendationResult.rows;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Get popular content
   * @param {number} limit - Limit
   * @returns {Promise<Array>} - Popular content
   */
  static async getPopularContent(limit = 10) {
    const result = await query(
      `SELECT ec.*, COUNT(ci.id) as interaction_count
       FROM educational_content ec
       LEFT JOIN content_interactions ci ON ec.id = ci.content_id
       GROUP BY ec.id
       ORDER BY interaction_count DESC, ec.published_at DESC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows;
  }
  
  /**
   * Get content categories
   * @returns {Promise<Array>} - Content categories
   */
  static async getContentCategories() {
    const result = await query(
      'SELECT DISTINCT category FROM educational_content ORDER BY category'
    );
    
    return result.rows.map(row => row.category);
  }
  
  /**
   * Get content tags
   * @returns {Promise<Array>} - Content tags
   */
  static async getContentTags() {
    const result = await query(
      'SELECT DISTINCT unnest(tags) as tag FROM educational_content ORDER BY tag'
    );
    
    return result.rows.map(row => row.tag);
  }
}

module.exports = EducationModel;
