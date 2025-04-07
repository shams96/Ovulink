/**
 * Validation middleware
 * Validates request data against schemas
 */

const Joi = require('joi');
const { ApiError, ERROR_CODES } = require('./errorHandler');
const config = require('../config');

/**
 * Validate request data against schema
 * @param {Object} schema - Joi schema
 * @param {string} property - Request property to validate (body, params, query)
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const data = req[property];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return next(
        new ApiError(
          ERROR_CODES.VALIDATION_ERROR,
          'VALIDATION_ERROR',
          'Validation error',
          details
        )
      );
    }
    
    // Replace request data with validated data
    req[property] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // User schemas
  user: {
    register: Joi.object({
      email: Joi.string()
        .email()
        .max(config.validation.email.maxLength)
        .required()
        .messages({
          'string.email': 'Email must be a valid email address',
          'string.max': `Email cannot exceed ${config.validation.email.maxLength} characters`,
          'any.required': 'Email is required',
        }),
      password: Joi.string()
        .min(config.validation.password.minLength)
        .max(config.validation.password.maxLength)
        .required()
        .messages({
          'string.min': `Password must be at least ${config.validation.password.minLength} characters`,
          'string.max': `Password cannot exceed ${config.validation.password.maxLength} characters`,
          'any.required': 'Password is required',
        }),
      displayName: Joi.string()
        .min(config.validation.displayName.minLength)
        .max(config.validation.displayName.maxLength)
        .required()
        .messages({
          'string.min': `Display name must be at least ${config.validation.displayName.minLength} characters`,
          'string.max': `Display name cannot exceed ${config.validation.displayName.maxLength} characters`,
          'any.required': 'Display name is required',
        }),
      gender: Joi.string()
        .valid('male', 'female')
        .required()
        .messages({
          'any.only': 'Gender must be either male or female',
          'any.required': 'Gender is required',
        }),
      birthDate: Joi.date()
        .iso()
        .max('now')
        .messages({
          'date.base': 'Birth date must be a valid date',
          'date.format': 'Birth date must be in ISO format (YYYY-MM-DD)',
          'date.max': 'Birth date cannot be in the future',
        }),
      phoneNumber: Joi.string()
        .pattern(/^\+?[0-9]{10,15}$/)
        .messages({
          'string.pattern.base': 'Phone number must be a valid phone number',
        }),
      height: Joi.number()
        .positive()
        .messages({
          'number.base': 'Height must be a number',
          'number.positive': 'Height must be a positive number',
        }),
      weight: Joi.number()
        .positive()
        .messages({
          'number.base': 'Weight must be a number',
          'number.positive': 'Weight must be a positive number',
        }),
    }),
    
    login: Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Email must be a valid email address',
          'any.required': 'Email is required',
        }),
      password: Joi.string()
        .required()
        .messages({
          'any.required': 'Password is required',
        }),
    }),
    
    updateProfile: Joi.object({
      displayName: Joi.string()
        .min(config.validation.displayName.minLength)
        .max(config.validation.displayName.maxLength)
        .messages({
          'string.min': `Display name must be at least ${config.validation.displayName.minLength} characters`,
          'string.max': `Display name cannot exceed ${config.validation.displayName.maxLength} characters`,
        }),
      phoneNumber: Joi.string()
        .pattern(/^\+?[0-9]{10,15}$/)
        .allow(null, '')
        .messages({
          'string.pattern.base': 'Phone number must be a valid phone number',
        }),
      height: Joi.number()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'Height must be a number',
          'number.positive': 'Height must be a positive number',
        }),
      weight: Joi.number()
        .positive()
        .allow(null)
        .messages({
          'number.base': 'Weight must be a number',
          'number.positive': 'Weight must be a positive number',
        }),
    }),
    
    changePassword: Joi.object({
      currentPassword: Joi.string()
        .required()
        .messages({
          'any.required': 'Current password is required',
        }),
      newPassword: Joi.string()
        .min(config.validation.password.minLength)
        .max(config.validation.password.maxLength)
        .required()
        .messages({
          'string.min': `New password must be at least ${config.validation.password.minLength} characters`,
          'string.max': `New password cannot exceed ${config.validation.password.maxLength} characters`,
          'any.required': 'New password is required',
        }),
    }),
    
    refreshToken: Joi.object({
      refreshToken: Joi.string()
        .required()
        .messages({
          'any.required': 'Refresh token is required',
        }),
    }),
    
    linkPartner: Joi.object({
      partnerEmail: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Partner email must be a valid email address',
          'any.required': 'Partner email is required',
        }),
    }),
    
    updatePartnerLink: Joi.object({
      status: Joi.string()
        .valid('accepted', 'rejected')
        .required()
        .messages({
          'any.only': 'Status must be either accepted or rejected',
          'any.required': 'Status is required',
        }),
    }),
  },
  
  // Female health schemas
  femaleHealth: {
    createCycle: Joi.object({
      startDate: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Start date must be a valid date',
          'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
          'any.required': 'Start date is required',
        }),
      endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .allow(null)
        .messages({
          'date.base': 'End date must be a valid date',
          'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
          'date.min': 'End date must be after start date',
        }),
      flow: Joi.string()
        .valid('light', 'medium', 'heavy')
        .allow(null)
        .messages({
          'any.only': 'Flow must be either light, medium, or heavy',
        }),
      notes: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Notes must be a string',
        }),
    }),
    
    createTemperature: Joi.object({
      date: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Date must be a valid date',
          'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
          'any.required': 'Date is required',
        }),
      time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .required()
        .messages({
          'string.pattern.base': 'Time must be in format HH:MM:SS',
          'any.required': 'Time is required',
        }),
      value: Joi.number()
        .precision(1)
        .min(35)
        .max(42)
        .required()
        .messages({
          'number.base': 'Value must be a number',
          'number.min': 'Value must be at least 35',
          'number.max': 'Value must be at most 42',
          'number.precision': 'Value must have at most 1 decimal place',
          'any.required': 'Value is required',
        }),
      notes: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Notes must be a string',
        }),
    }),
    
    createCervicalMucus: Joi.object({
      date: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Date must be a valid date',
          'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
          'any.required': 'Date is required',
        }),
      type: Joi.string()
        .valid('dry', 'sticky', 'creamy', 'egg-white')
        .required()
        .messages({
          'any.only': 'Type must be either dry, sticky, creamy, or egg-white',
          'any.required': 'Type is required',
        }),
      amount: Joi.string()
        .valid('light', 'medium', 'abundant')
        .required()
        .messages({
          'any.only': 'Amount must be either light, medium, or abundant',
          'any.required': 'Amount is required',
        }),
      notes: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Notes must be a string',
        }),
    }),
  },
  
  // Male health schemas
  maleHealth: {
    createSpermHealth: Joi.object({
      date: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Date must be a valid date',
          'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
          'any.required': 'Date is required',
        }),
      count: Joi.number()
        .integer()
        .min(0)
        .max(300)
        .allow(null)
        .messages({
          'number.base': 'Count must be a number',
          'number.integer': 'Count must be an integer',
          'number.min': 'Count must be at least 0',
          'number.max': 'Count must be at most 300',
        }),
      motility: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .allow(null)
        .messages({
          'number.base': 'Motility must be a number',
          'number.integer': 'Motility must be an integer',
          'number.min': 'Motility must be at least 0',
          'number.max': 'Motility must be at most 100',
        }),
      morphology: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .allow(null)
        .messages({
          'number.base': 'Morphology must be a number',
          'number.integer': 'Morphology must be an integer',
          'number.min': 'Morphology must be at least 0',
          'number.max': 'Morphology must be at most 100',
        }),
      volume: Joi.number()
        .precision(1)
        .min(0)
        .max(10)
        .allow(null)
        .messages({
          'number.base': 'Volume must be a number',
          'number.min': 'Volume must be at least 0',
          'number.max': 'Volume must be at most 10',
          'number.precision': 'Volume must have at most 1 decimal place',
        }),
      notes: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Notes must be a string',
        }),
    }),
    
    calculateScore: Joi.object({
      count: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
          'number.base': 'Count must be a number',
          'number.integer': 'Count must be an integer',
          'number.min': 'Count must be at least 0',
          'any.required': 'Count is required',
        }),
      motility: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
          'number.base': 'Motility must be a number',
          'number.integer': 'Motility must be an integer',
          'number.min': 'Motility must be at least 0',
          'number.max': 'Motility must be at most 100',
          'any.required': 'Motility is required',
        }),
      morphology: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
          'number.base': 'Morphology must be a number',
          'number.integer': 'Morphology must be an integer',
          'number.min': 'Morphology must be at least 0',
          'number.max': 'Morphology must be at most 100',
          'any.required': 'Morphology is required',
        }),
      volume: Joi.number()
        .precision(1)
        .min(0)
        .required()
        .messages({
          'number.base': 'Volume must be a number',
          'number.min': 'Volume must be at least 0',
          'number.precision': 'Volume must have at most 1 decimal place',
          'any.required': 'Volume is required',
        }),
    }),
  },
  
  // Calendar schemas
  calendar: {
    createAppointment: Joi.object({
      title: Joi.string()
        .required()
        .messages({
          'string.base': 'Title must be a string',
          'any.required': 'Title is required',
        }),
      date: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Date must be a valid date',
          'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
          'any.required': 'Date is required',
        }),
      time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .allow(null)
        .messages({
          'string.pattern.base': 'Time must be in format HH:MM:SS',
        }),
      location: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Location must be a string',
        }),
      notes: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Notes must be a string',
        }),
      reminderTime: Joi.number()
        .integer()
        .min(0)
        .allow(null)
        .messages({
          'number.base': 'Reminder time must be a number',
          'number.integer': 'Reminder time must be an integer',
          'number.min': 'Reminder time must be at least 0',
        }),
      isShared: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'Is shared must be a boolean',
        }),
    }),
    
    createIntimacy: Joi.object({
      date: Joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Date must be a valid date',
          'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
          'any.required': 'Date is required',
        }),
      time: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
        .allow(null)
        .messages({
          'string.pattern.base': 'Time must be in format HH:MM:SS',
        }),
      isProtected: Joi.boolean()
        .default(false)
        .messages({
          'boolean.base': 'Is protected must be a boolean',
        }),
      notes: Joi.string()
        .allow(null, '')
        .messages({
          'string.base': 'Notes must be a string',
        }),
    }),
  },
  
  // Common schemas
  common: {
    id: Joi.object({
      id: Joi.string()
        .required()
        .messages({
          'string.base': 'ID must be a string',
          'any.required': 'ID is required',
        }),
    }),
    
    pagination: Joi.object({
      limit: Joi.number()
        .integer()
        .min(1)
        .max(config.pagination.maxLimit)
        .default(config.pagination.defaultLimit)
        .messages({
          'number.base': 'Limit must be a number',
          'number.integer': 'Limit must be an integer',
          'number.min': 'Limit must be at least 1',
          'number.max': `Limit must be at most ${config.pagination.maxLimit}`,
        }),
      offset: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
          'number.base': 'Offset must be a number',
          'number.integer': 'Offset must be an integer',
          'number.min': 'Offset must be at least 0',
        }),
    }),
    
    dateRange: Joi.object({
      startDate: Joi.date()
        .iso()
        .messages({
          'date.base': 'Start date must be a valid date',
          'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
        }),
      endDate: Joi.date()
        .iso()
        .min(Joi.ref('startDate'))
        .messages({
          'date.base': 'End date must be a valid date',
          'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
          'date.min': 'End date must be after start date',
        }),
    }),
  },
};

module.exports = {
  validate,
  schemas,
};
