const winston = require('winston');
const path = require('path');

const setupLogger = () => {
  const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: 'content-api' },
    transports: [
      new winston.transports.File({ 
        filename: path.join(__dirname, '../../src/logs/error.log'), 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: path.join(__dirname, '../../src/logs/combined.log') 
      })
    ]
  });

  // If not in production, also log to the console
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return logger;
};

module.exports = { setupLogger }; 