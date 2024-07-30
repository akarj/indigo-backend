const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      logger.info('Connected to MongoDB');
   } catch (error) {
      logger.error('Failed to connect to MongoDB', error);
      process.exit(1);
   }
};

module.exports = connectDB;
