require('dotenv').config();
const express = require('express');
const { getNext10Records } = require('./utils/flightDataService');
const cron = require('./utils/cron');
const logger = require('./utils/logger');

const app = express();
app.use(express.json());

// Endpoint to get next 10 flight records
app.get('/flights', async (req, res) => {
   try {
      const records = await getNext10Records();
      res.json(records);
   } catch (error) {
      logger.error('Error fetching flight records:', error);
      res.status(500).send('Internal Server Error');
   }
});

// Start the cron job
cron.startCronJobs();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   logger.info(`Flight Data Service listening on port ${PORT}`);
});
