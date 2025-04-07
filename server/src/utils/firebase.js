/**
 * Firebase utility functions
 * Provides Firebase authentication and admin functionality
 */

const admin = require('firebase-admin');
const config = require('../config');
const logger = require('./logger');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      // Create service account credential
      const serviceAccount = {
        type: config.firebase.type,
        project_id: config.firebase.projectId,
        private_key_id: config.firebase.privateKeyId,
        private_key: config.firebase.privateKey,
        client_email: config.firebase.clientEmail,
        client_id: config.firebase.clientId,
        auth_uri: config.firebase.authUri,
        token_uri: config.firebase.tokenUri,
        auth_provider_x509_cert_url: config.firebase.authProviderX509CertUrl,
        client_x509_cert_url: config.firebase.clientX509CertUrl,
      };

      // Initialize the app
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      logger.info('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    logger.error('Error initializing Firebase Admin SDK:', error);
    
    // In development, initialize with application default credentials if service account fails
    if (config.nodeEnv === 'development' && admin.apps.length === 0) {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        logger.info('Firebase Admin SDK initialized with application default credentials');
      } catch (defaultCredError) {
        logger.error('Failed to initialize Firebase with default credentials:', defaultCredError);
        throw error; // Throw the original error
      }
    } else {
      throw error;
    }
  }

  return admin;
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Decoded token
 */
const verifyIdToken = async (idToken) => {
  try {
    // Initialize Firebase if not already initialized
    initializeFirebase();
    
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Error verifying Firebase ID token:', error);
    throw error;
  }
};

/**
 * Get user by UID
 * @param {string} uid - Firebase user UID
 * @returns {Promise<Object>} Firebase user record
 */
const getUserByUid = async (uid) => {
  try {
    // Initialize Firebase if not already initialized
    initializeFirebase();
    
    // Get the user record
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    logger.error(`Error getting user by UID (${uid}):`, error);
    throw error;
  }
};

/**
 * Create a new Firebase user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Firebase user record
 */
const createUser = async (userData) => {
  try {
    // Initialize Firebase if not already initialized
    initializeFirebase();
    
    // Create the user
    const userRecord = await admin.auth().createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      disabled: false,
    });
    
    return userRecord;
  } catch (error) {
    logger.error('Error creating Firebase user:', error);
    throw error;
  }
};

/**
 * Update a Firebase user
 * @param {string} uid - Firebase user UID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} Updated Firebase user record
 */
const updateUser = async (uid, userData) => {
  try {
    // Initialize Firebase if not already initialized
    initializeFirebase();
    
    // Update the user
    const userRecord = await admin.auth().updateUser(uid, userData);
    return userRecord;
  } catch (error) {
    logger.error(`Error updating Firebase user (${uid}):`, error);
    throw error;
  }
};

/**
 * Delete a Firebase user
 * @param {string} uid - Firebase user UID
 * @returns {Promise<void>}
 */
const deleteUser = async (uid) => {
  try {
    // Initialize Firebase if not already initialized
    initializeFirebase();
    
    // Delete the user
    await admin.auth().deleteUser(uid);
    logger.info(`Firebase user deleted: ${uid}`);
  } catch (error) {
    logger.error(`Error deleting Firebase user (${uid}):`, error);
    throw error;
  }
};

module.exports = {
  admin,
  initializeFirebase,
  verifyIdToken,
  getUserByUid,
  createUser,
  updateUser,
  deleteUser,
};
