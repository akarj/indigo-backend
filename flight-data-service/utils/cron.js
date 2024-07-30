const cron = require('node-cron');
const { processFlightData } = require('./flightDataService');
const logger = require('./logger');

// Schedule a cron job to process flight data every 5 minutes
const startCronJobs = () => {
   cron.schedule('*/5 * * * *', async () => {
      try {
         await processFlightData();
      } catch (error) {
         logger.error('Error processing flight data:', error);
      }
   });
};

module.exports = {
   startCronJobs
};
