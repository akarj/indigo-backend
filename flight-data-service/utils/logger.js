const winston = require('winston');

// Define log levels
const logLevels = {
   error: 0,
   warn: 1,
   info: 2,
   verbose: 3,
   debug: 4,
   silly: 5
};

// Create a logger instance
const logger = winston.createLogger({
   levels: logLevels,
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json() // Format logs as JSON
   ),
   transports: [
      new winston.transports.Console({
         format: winston.format.combine(
            winston.format.colorize(), // Add color to the log output
            winston.format.simple() // Simple log output format
         )
      }),
      new winston.transports.File({
         filename: 'combined.log', // Log file for all levels
         level: 'info' // Log level for this file
      }),
      new winston.transports.File({
         filename: 'errors.log', // Log file specifically for errors
         level: 'error' // Log level for this file
      })
   ],
});

// Add a custom transport for error handling (optional)
logger.on('error', (error) => {
   console.error('Logging error:', error);
});

module.exports = logger;
