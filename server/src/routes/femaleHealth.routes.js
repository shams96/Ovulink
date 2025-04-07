const express = require('express');
const FemaleHealthController = require('../controllers/femaleHealth.controller');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/female-health/cycles
 * @desc Create a new menstrual cycle record
 * @access Private
 */
router.post(
  '/cycles',
  authenticate,
  validate(schemas.cyclePeriod),
  FemaleHealthController.createCycle
);

/**
 * @route PUT /api/female-health/cycles/:cycleId
 * @desc Update a menstrual cycle record
 * @access Private
 */
router.put(
  '/cycles/:cycleId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.updateCycle
);

/**
 * @route GET /api/female-health/cycles/:cycleId
 * @desc Get a menstrual cycle record by ID
 * @access Private
 */
router.get(
  '/cycles/:cycleId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.getCycle
);

/**
 * @route GET /api/female-health/cycles
 * @desc Get all menstrual cycles for a user
 * @access Private
 */
router.get(
  '/cycles',
  authenticate,
  FemaleHealthController.getCycles
);

/**
 * @route DELETE /api/female-health/cycles/:cycleId
 * @desc Delete a menstrual cycle record
 * @access Private
 */
router.delete(
  '/cycles/:cycleId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.deleteCycle
);

/**
 * @route POST /api/female-health/temperatures
 * @desc Create a new temperature record
 * @access Private
 */
router.post(
  '/temperatures',
  authenticate,
  validate(schemas.temperature),
  FemaleHealthController.createTemperature
);

/**
 * @route PUT /api/female-health/temperatures/:tempId
 * @desc Update a temperature record
 * @access Private
 */
router.put(
  '/temperatures/:tempId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.updateTemperature
);

/**
 * @route GET /api/female-health/temperatures/:tempId
 * @desc Get a temperature record by ID
 * @access Private
 */
router.get(
  '/temperatures/:tempId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.getTemperature
);

/**
 * @route GET /api/female-health/temperatures
 * @desc Get all temperature records for a user
 * @access Private
 */
router.get(
  '/temperatures',
  authenticate,
  FemaleHealthController.getTemperatures
);

/**
 * @route DELETE /api/female-health/temperatures/:tempId
 * @desc Delete a temperature record
 * @access Private
 */
router.delete(
  '/temperatures/:tempId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.deleteTemperature
);

/**
 * @route POST /api/female-health/cervical-mucus
 * @desc Create a new cervical mucus record
 * @access Private
 */
router.post(
  '/cervical-mucus',
  authenticate,
  validate(schemas.cervicalMucus),
  FemaleHealthController.createCervicalMucus
);

/**
 * @route PUT /api/female-health/cervical-mucus/:mucusId
 * @desc Update a cervical mucus record
 * @access Private
 */
router.put(
  '/cervical-mucus/:mucusId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.updateCervicalMucus
);

/**
 * @route GET /api/female-health/cervical-mucus/:mucusId
 * @desc Get a cervical mucus record by ID
 * @access Private
 */
router.get(
  '/cervical-mucus/:mucusId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.getCervicalMucus
);

/**
 * @route GET /api/female-health/cervical-mucus
 * @desc Get all cervical mucus records for a user
 * @access Private
 */
router.get(
  '/cervical-mucus',
  authenticate,
  FemaleHealthController.getCervicalMucusRecords
);

/**
 * @route DELETE /api/female-health/cervical-mucus/:mucusId
 * @desc Delete a cervical mucus record
 * @access Private
 */
router.delete(
  '/cervical-mucus/:mucusId',
  authenticate,
  validate(schemas.idParam, 'params'),
  FemaleHealthController.deleteCervicalMucus
);

/**
 * @route GET /api/female-health/predict-ovulation
 * @desc Predict ovulation based on menstrual cycle data
 * @access Private
 */
router.get(
  '/predict-ovulation',
  authenticate,
  FemaleHealthController.predictOvulation
);

module.exports = router;
