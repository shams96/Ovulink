const express = require('express');
const MaleHealthController = require('../controllers/maleHealth.controller');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/male-health/sperm
 * @desc Create a new sperm health record
 * @access Private
 */
router.post(
  '/sperm',
  authenticate,
  validate(schemas.spermHealth),
  MaleHealthController.createSpermHealth
);

/**
 * @route PUT /api/male-health/sperm/:spermId
 * @desc Update a sperm health record
 * @access Private
 */
router.put(
  '/sperm/:spermId',
  authenticate,
  validate(schemas.idParam, 'params'),
  MaleHealthController.updateSpermHealth
);

/**
 * @route GET /api/male-health/sperm/:spermId
 * @desc Get a sperm health record by ID
 * @access Private
 */
router.get(
  '/sperm/:spermId',
  authenticate,
  validate(schemas.idParam, 'params'),
  MaleHealthController.getSpermHealth
);

/**
 * @route GET /api/male-health/sperm
 * @desc Get all sperm health records for a user
 * @access Private
 */
router.get(
  '/sperm',
  authenticate,
  MaleHealthController.getSpermHealthRecords
);

/**
 * @route DELETE /api/male-health/sperm/:spermId
 * @desc Delete a sperm health record
 * @access Private
 */
router.delete(
  '/sperm/:spermId',
  authenticate,
  validate(schemas.idParam, 'params'),
  MaleHealthController.deleteSpermHealth
);

/**
 * @route POST /api/male-health/calculate-score
 * @desc Calculate sperm health score
 * @access Public
 */
router.post(
  '/calculate-score',
  MaleHealthController.calculateSpermHealthScore
);

/**
 * @route GET /api/male-health/trends
 * @desc Get sperm health trends for a user
 * @access Private
 */
router.get(
  '/trends',
  authenticate,
  MaleHealthController.getSpermHealthTrends
);

/**
 * @route GET /api/male-health/latest
 * @desc Get latest sperm health record and score
 * @access Private
 */
router.get(
  '/latest',
  authenticate,
  MaleHealthController.getLatestSpermHealth
);

module.exports = router;
