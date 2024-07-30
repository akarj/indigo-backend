const User = require('../models/User');
const logger = require('../utils/logger');

// Create a new user
exports.createUser = async (req, res) => {
   try {
      const { name, email, phoneNumber } = req.body;
      const user = new User({ name, email, phone: phoneNumber });
      await user.save();
      res.status(201).json({ message: 'User created', data: user });
   } catch (error) {
      logger.error('Error creating user', error);
      res.status(500).json({ error: 'Failed to create user' });
   }
};
