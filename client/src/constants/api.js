// API URL
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// API endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    TOKEN: '/auth/token',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Users
  USERS: {
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
    PARTNER: '/users/partner',
    NOTIFICATIONS: '/users/notifications',
  },
  
  // Female Health
  FEMALE_HEALTH: {
    CYCLES: '/female-health/cycles',
    TEMPERATURES: '/female-health/temperatures',
    CERVICAL_MUCUS: '/female-health/cervical-mucus',
    PREDICT_OVULATION: '/female-health/predict-ovulation',
  },
  
  // Male Health
  MALE_HEALTH: {
    SPERM: '/male-health/sperm',
    TRENDS: '/male-health/trends',
    LATEST: '/male-health/latest',
    CALCULATE_SCORE: '/male-health/calculate-score',
  },
  
  // Calendar
  CALENDAR: {
    APPOINTMENTS: '/calendar/appointments',
    INTIMACY: '/calendar/intimacy',
    FERTILITY_EVENTS: '/calendar/fertility-events',
  },
  
  // Education
  EDUCATION: {
    CONTENT: '/education/content',
    CATEGORY: '/education/category',
    TAGS: '/education/tags',
    SEARCH: '/education/search',
    INTERACTION: '/education/interaction',
    INTERACTIONS: '/education/interactions',
    RECOMMENDED: '/education/recommended',
    POPULAR: '/education/popular',
    CATEGORIES: '/education/categories',
  },
};

// API request methods
export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// API response status codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
