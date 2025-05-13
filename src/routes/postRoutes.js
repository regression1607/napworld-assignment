const express = require('express');
const { createPost, getPosts } = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const { postValidators, postFilterValidators, validate } = require('../middleware/validators');

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', authenticate, postValidators, validate, createPost);

// @route   GET /api/posts
// @desc    Get posts with filters
// @access  Public
router.get('/posts', postFilterValidators, validate, getPosts);

module.exports = router; 