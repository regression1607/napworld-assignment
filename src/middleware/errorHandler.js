const { setupLogger } = require('../utils/logger');
const logger = setupLogger();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip 
  });

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errMessages = Object.values(err.errors).map(val => val.message);
    message = errMessages.join(', ');
  }

  // Handle duplicate key errors (MongoDB)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
    
    // Get the field name for the duplicate key
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler }; 