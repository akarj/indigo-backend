const Booking = require('../models/Booking');
const User = require('../models/User');
const logger = require('../utils/logger');

// Create a new booking
exports.createBooking = async (req, res) => {
   try {
      const { userId, flightId, bookingDate } = req.body;
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      const booking = new Booking({ userId, flightId, bookingDate, notificationOptIn: { email: true } });
      await booking.save();
      res.status(201).json({ message: 'Booking created', data: booking });
   } catch (error) {
      logger.error('Error creating booking', error);
      res.status(500).json({ error: 'Failed to create booking' });
   }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
   try {
      const { id } = req.params;
      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) {
         return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking cancelled' });
   } catch (error) {
      logger.error('Error cancelling booking', error);
      res.status(500).json({ error: 'Failed to cancel booking' });
   }
};
