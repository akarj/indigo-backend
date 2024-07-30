const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Routes for bookings
router.post('/', bookingController.createBooking);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
