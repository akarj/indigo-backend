const amqp = require('amqplib');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const logger = require('./utils/logger');
const { sendEmail } = require('./utils/emailService');

const RABBITMQ_URL = process.env.RABBITMQ_URL;

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
      const { channel: emergencyChannel } = await setupQueue('emergency-notifications');
      const { channel: nonEmergencyChannel } = await setupQueue('non-emergency-notifications');

      const processQueue = async (channel, queueName) => {
         channel.consume(queueName, async (msg) => {
            if (msg !== null) {
               try {
                  const { content } = msg;
                  const notification = JSON.parse(content.toString());

                  await sendEmail(notification.to, notification.subject, notification.text);

                  channel.ack(msg);
               } catch (processError) {
                  logger.error('Error processing message:', processError);
                  channel.nack(msg);
               }
            }
         });
      };

      await processQueue(emergencyChannel, 'emergency-notifications');
      await processQueue(nonEmergencyChannel, 'non-emergency-notifications');

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

startService().catch(logger.error);
