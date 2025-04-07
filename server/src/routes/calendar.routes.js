const express = require('express');
const CalendarController = require('../controllers/calendar.controller');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route POST /api/calendar/appointments
 * @desc Create a new appointment
 * @access Private
 */
router.post(
  '/appointments',
  authenticate,
  validate(schemas.appointment),
  CalendarController.createAppointment
);

/**
 * @route PUT /api/calendar/appointments/:appointmentId
 * @desc Update an appointment
 * @access Private
 */
router.put(
  '/appointments/:appointmentId',
  authenticate,
  validate(schemas.idParam, 'params'),
  CalendarController.updateAppointment
);

/**
 * @route GET /api/calendar/appointments/:appointmentId
 * @desc Get an appointment by ID
 * @access Private
 */
router.get(
  '/appointments/:appointmentId',
  authenticate,
  validate(schemas.idParam, 'params'),
  CalendarController.getAppointment
);

/**
 * @route GET /api/calendar/appointments
 * @desc Get all appointments for a user
 * @access Private
 */
router.get(
  '/appointments',
  authenticate,
  CalendarController.getAppointments
);

/**
 * @route DELETE /api/calendar/appointments/:appointmentId
 * @desc Delete an appointment
 * @access Private
 */
router.delete(
  '/appointments/:appointmentId',
  authenticate,
  validate(schemas.idParam, 'params'),
  CalendarController.deleteAppointment
);

/**
 * @route POST /api/calendar/intimacy
 * @desc Create a new intimacy log
 * @access Private
 */
router.post(
  '/intimacy',
  authenticate,
  validate(schemas.intimacy),
  CalendarController.createIntimacyLog
);

/**
 * @route PUT /api/calendar/intimacy/:intimacyId
 * @desc Update an intimacy log
 * @access Private
 */
router.put(
  '/intimacy/:intimacyId',
  authenticate,
  validate(schemas.idParam, 'params'),
  CalendarController.updateIntimacyLog
);

/**
 * @route GET /api/calendar/intimacy/:intimacyId
 * @desc Get an intimacy log by ID
 * @access Private
 */
router.get(
  '/intimacy/:intimacyId',
  authenticate,
  validate(schemas.idParam, 'params'),
  CalendarController.getIntimacyLog
);

/**
 * @route GET /api/calendar/intimacy
 * @desc Get all intimacy logs for a user
 * @access Private
 */
router.get(
  '/intimacy',
  authenticate,
  CalendarController.getIntimacyLogs
);

/**
 * @route DELETE /api/calendar/intimacy/:intimacyId
 * @desc Delete an intimacy log
 * @access Private
 */
router.delete(
  '/intimacy/:intimacyId',
  authenticate,
  validate(schemas.idParam, 'params'),
  CalendarController.deleteIntimacyLog
);

/**
 * @route GET /api/calendar/fertility-events
 * @desc Get upcoming fertility events
 * @access Private
 */
router.get(
  '/fertility-events',
  authenticate,
  CalendarController.getUpcomingFertilityEvents
);

module.exports = router;
