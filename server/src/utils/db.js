/**
 * Database utility functions
 * Provides connection and query functions for PostgreSQL database
 */

const { Pool } = require('pg');
const config = require('../config');
const logger = require('./logger');

// Create a connection pool
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Log pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Connect to the database
 * @returns {Promise<void>}
 */
const connectToDatabase = async () => {
  try {
    const client = await pool.connect();
    logger.info(`Connected to PostgreSQL database: ${config.db.database} at ${config.db.host}:${config.db.port}`);
    client.release();
    return pool;
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    throw error;
  }
};

/**
 * Execute a query with parameters
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log query for debugging in development
    if (config.nodeEnv === 'development') {
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    logger.error('Error executing query:', { text, error });
    throw error;
  }
};

/**
 * Execute a transaction with multiple queries
 * @param {Function} callback - Callback function that receives a client and executes queries
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Close the database connection pool
 * @returns {Promise<void>}
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database connection pool closed');
  } catch (error) {
    logger.error('Error closing database connection pool:', error);
    throw error;
  }
};

module.exports = {
  pool,
  connectToDatabase,
  query,
  transaction,
  closePool,
};
