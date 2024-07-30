const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   flightId: { type: String, required: true },
   bookingDate: { type: Date, required: true },
   notificationOptIn: {
      email: { type: Boolean, default: true }
   }
});

module.exports = mongoose.model('Booking', bookingSchema);
