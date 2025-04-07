/**
 * Server configuration
 * Loads environment variables and provides configuration for the server
 */

// Load environment variables
require('dotenv').config();

// Configuration object
const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'ovulink',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Firebase
  firebase: {
    type: process.env.FIREBASE_TYPE || 'service_account',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    clientId: process.env.FIREBASE_CLIENT_ID || '',
    authUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // 100 requests per windowMs
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:19006',
  
  // Validation
  validation: {
    password: {
      minLength: 6,
      maxLength: 100,
    },
    email: {
      maxLength: 255,
    },
    displayName: {
      minLength: 2,
      maxLength: 50,
    },
  },
  
  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};

// Validate required configuration
const validateConfig = () => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    } else {
      console.warn(`Warning: Missing recommended environment variables: ${missingEnvVars.join(', ')}`);
    }
  }
};

// Validate in non-test environments
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

module.exports = config;
