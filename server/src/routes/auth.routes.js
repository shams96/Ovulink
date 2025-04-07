const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/auth/token
 * @desc Verify Firebase token and issue JWT
 * @access Public
 */
router.post('/token', AuthController.verifyToken);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 * @access Private
 */
router.post('/refresh', authenticate, AuthController.refreshToken);

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user
 * @access Private
 */
router.get('/me', authenticate, AuthController.getCurrentUser);

module.exports = router;
