const winston = require('winston');

const logLevels = {
   error: 0,
   warn: 1,
   info: 2,
   verbose: 3,
   debug: 4,
   silly: 5
};

const logger = winston.createLogger({
   levels: logLevels,
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
   transports: [
      new winston.transports.Console({
         format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
         )
      }),
      new winston.transports.File({
         filename: 'combined.log',
         level: 'info'
      }),
      new winston.transports.File({
         filename: 'errors.log',
         level: 'error'
      })
   ],
});

logger.on('error', (error) => {
   console.error('Logging error:', error);
});

module.exports = logger;
