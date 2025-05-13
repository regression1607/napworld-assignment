const jwt = require('jsonwebtoken');
const { setupLogger } = require('../utils/logger');
const User = require('../models/user');

const logger = setupLogger();

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Please provide a valid token.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      logger.warn(`Authentication failed: User not found for token payload: ${decoded.id}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed. User not found.' 
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`, { 
      path: req.path,
      method: req.method,
      ip: req.ip 
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed. Invalid token.' 
    });
  }
};

module.exports = { authenticate }; 