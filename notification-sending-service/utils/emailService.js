const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const logger = require('./logger'); // Import the logger

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const sendEmail = async (to, subject, text) => {
   try {
      const transporter = nodemailer.createTransport({
         host: EMAIL_HOST,
         port: EMAIL_PORT,
         secure: false, // true for 465, false for other ports
         service: 'gmail',
         auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
         }
      });

      const info = await transporter.sendMail({
         from: `"Flight Notifications" <${EMAIL_USER}>`,
         to,
         subject,
         text
      });

      logger.info('Email sent:', info.response);
   } catch (error) {
      logger.error('Error sending email:', error);
   }
};

module.exports = { sendEmail };
