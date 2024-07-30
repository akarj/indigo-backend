require('dotenv').config({ path: './.env' });
const amqp = require('amqplib');
const { logger } = require('./utils/logger');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const setupQueue = async (queueName) => {
   try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, { durable: true });
      logger.info(`Queue ${queueName} is set up`);
      return { connection, channel };
   } catch (error) {
      logger.error('Error setting up queue:', error);
      process.exit(1);
   }
};

const startService = async () => {
   try {
      const { channel } = await setupQueue('non-emergency-notifications');

      channel.consume('non-emergency-notifications', (msg) => {
         if (msg !== null) {
            try {
               const content = msg.content.toString();
               logger.info(`Received non-emergency notification: ${content}`);
               channel.ack(msg);
            } catch (processError) {
               logger.error('Error processing message:', processError);
               channel.nack(msg);
            }
         }
      });

      process.on('uncaughtException', (err) => {
         logger.error('Uncaught Exception:', err);
         process.exit(1);
      });

      process.on('unhandledRejection', (reason, promise) => {
         logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
         process.exit(1);
      });

   } catch (startError) {
      logger.error('Error starting service:', startError);
      process.exit(1);
   }
};

startService().catch(console.error);
