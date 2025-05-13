const express = require('express');
const { signup, login } = require('../controllers/authController');
const { signupValidators, loginValidators, validate } = require('../middleware/validators');

const router = express.Router();

// @route   POST /api/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupValidators, validate, signup);

// @route   POST /api/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidators, validate, login);

module.exports = router; 