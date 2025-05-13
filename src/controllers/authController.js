const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { setupLogger } = require('../utils/logger');

const logger = setupLogger();

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'your_jwt_secret_key_here', 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    logger.info('Signup attempt', { email: req.body.email });
    
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      logger.warn('Signup failed: Email already exists', { email });
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    // Create new user (password hashing happens in pre-save hook)
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    logger.info('User registered successfully', { 
      userId: user._id,
      email: user.email 
    });
    
    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
const login = async (req, res, next) => {
  try {
    logger.info('Login attempt', { email: req.body.email });
    
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Login failed: Invalid credentials', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    logger.info('User logged in successfully', { 
      userId: user._id,
      email: user.email 
    });
    
    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

module.exports = {
  signup,
  login
}; 