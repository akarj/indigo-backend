require('dotenv').config({ path: './.env' });
const fs = require('fs');
const path = require('path');
const amqp = require('amqplib');
const logger = require('./logger');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EMERGENCY_QUEUE = 'emergency-notifications';
const NON_EMERGENCY_QUEUE = 'non-emergency-notifications';
const FLIGHT_DATA_FILE = path.join(__dirname, '../flightData.json');

let lastProcessedIndex = 0;

const getNext10Records = () => {
   return new Promise((resolve, reject) => {
      fs.readFile(FLIGHT_DATA_FILE, 'utf8', (err, data) => {
         if (err) {
            return reject(err);
         }
         const flights = JSON.parse(data);
         const nextRecords = flights.slice(lastProcessedIndex, lastProcessedIndex + 10);
         lastProcessedIndex = (lastProcessedIndex + 10) % flights.length;
         resolve(nextRecords);
      });
   });
};

const sendToQueue = async (queue, message) => {
   try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      logger.info(`Sent message to ${queue}: ${JSON.stringify(message)}`);
      await channel.close();
      await connection.close();
   } catch (error) {
      logger.error('Error sending message to queue:', error);
   }
};

const processFlightData = async () => {
   try {
      const records = await getNext10Records();
      for (const record of records) {
         const { departureTime, tentativeDepartureTime, flightCancelled, tentativeTerminal } = record;
         if (flightCancelled || (tentativeDepartureTime && new Date(tentativeDepartureTime) - new Date(departureTime) <= 20 * 60 * 1000)) {
            await sendToQueue(EMERGENCY_QUEUE, record);
         } else if (tentativeTerminal || (tentativeDepartureTime && new Date(tentativeDepartureTime) - new Date(departureTime) > 20 * 60 * 1000)) {
            await sendToQueue(NON_EMERGENCY_QUEUE, record);
         }
      }
   } catch (error) {
      logger.error('Error processing flight data:', error);
   }
};

module.exports = {
   getNext10Records,
   processFlightData
};
