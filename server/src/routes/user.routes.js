const express = require('express');
const UserController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  validate(schemas.userRegister),
  UserController.register
);

/**
 * @route GET /api/users/profile
 * @desc Get current user profile
 * @access Private
 */
router.get(
  '/profile',
  authenticate,
  UserController.getProfile
);

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put(
  '/profile',
  authenticate,
  validate(schemas.userUpdate),
  UserController.updateProfile
);

/**
 * @route POST /api/users/partner
 * @desc Link partner
 * @access Private
 */
router.post(
  '/partner',
  authenticate,
  validate(schemas.partnerLink),
  UserController.linkPartner
);

/**
 * @route PUT /api/users/partner/:linkId
 * @desc Update partner link status
 * @access Private
 */
router.put(
  '/partner/:linkId',
  authenticate,
  validate(schemas.idParam, 'params'),
  UserController.updatePartnerLinkStatus
);

/**
 * @route GET /api/users/partner
 * @desc Get partner links
 * @access Private
 */
router.get(
  '/partner',
  authenticate,
  UserController.getPartnerLinks
);

/**
 * @route PUT /api/users/notifications
 * @desc Update notification preferences
 * @access Private
 */
router.put(
  '/notifications',
  authenticate,
  UserController.updateNotificationPreferences
);

/**
 * @route GET /api/users/notifications
 * @desc Get notification preferences
 * @access Private
 */
router.get(
  '/notifications',
  authenticate,
  UserController.getNotificationPreferences
);

module.exports = router;
