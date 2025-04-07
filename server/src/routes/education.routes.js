const express = require('express');
const EducationController = require('../controllers/education.controller');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route GET /api/education/content
 * @desc Get all educational content
 * @access Public
 */
router.get(
  '/content',
  EducationController.getAllContent
);

/**
 * @route GET /api/education/content/:contentId
 * @desc Get educational content by ID
 * @access Public
 */
router.get(
  '/content/:contentId',
  validate(schemas.idParam, 'params'),
  EducationController.getContentById
);

/**
 * @route GET /api/education/category/:category
 * @desc Get educational content by category
 * @access Public
 */
router.get(
  '/category/:category',
  EducationController.getContentByCategory
);

/**
 * @route POST /api/education/tags
 * @desc Get educational content by tags
 * @access Public
 */
router.post(
  '/tags',
  EducationController.getContentByTags
);

/**
 * @route GET /api/education/search
 * @desc Search educational content
 * @access Public
 */
router.get(
  '/search',
  EducationController.searchContent
);

/**
 * @route POST /api/education/interaction
 * @desc Create a content interaction
 * @access Private
 */
router.post(
  '/interaction',
  authenticate,
  EducationController.createContentInteraction
);

/**
 * @route DELETE /api/education/interaction/:contentId/:interactionType
 * @desc Delete a content interaction
 * @access Private
 */
router.delete(
  '/interaction/:contentId/:interactionType',
  authenticate,
  EducationController.deleteContentInteraction
);

/**
 * @route GET /api/education/interactions
 * @desc Get user interactions with content
 * @access Private
 */
router.get(
  '/interactions',
  authenticate,
  EducationController.getUserContentInteractions
);

/**
 * @route GET /api/education/recommended
 * @desc Get recommended content for a user
 * @access Private
 */
router.get(
  '/recommended',
  authenticate,
  EducationController.getRecommendedContent
);

/**
 * @route GET /api/education/popular
 * @desc Get popular content
 * @access Public
 */
router.get(
  '/popular',
  EducationController.getPopularContent
);

/**
 * @route GET /api/education/categories
 * @desc Get content categories
 * @access Public
 */
router.get(
  '/categories',
  EducationController.getContentCategories
);

/**
 * @route GET /api/education/tags
 * @desc Get content tags
 * @access Public
 */
router.get(
  '/tags',
  EducationController.getContentTags
);

module.exports = router;
