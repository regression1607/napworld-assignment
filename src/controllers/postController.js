const Post = require('../models/post');
const { setupLogger } = require('../utils/logger');

const logger = setupLogger();

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    logger.info('Post creation attempt', { 
      userId: req.user._id, 
      postName: req.body.postName 
    });
    
    const { postName, description, tags, imageUrl } = req.body;
    
    // Create post with logged-in user's ID
    const post = await Post.create({
      userId: req.user._id,
      postName,
      description,
      tags: tags || [],
      imageUrl,
      uploadTime: new Date()
    });
    
    logger.info('Post created successfully', { 
      postId: post._id,
      userId: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    logger.error(`Post creation error: ${error.message}`, { 
      stack: error.stack,
      userId: req.user ? req.user._id : 'unknown'
    });
    next(error);
  }
};

// @desc    Get posts with filters
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { 
      searchText, 
      startDate, 
      endDate, 
      tags, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    logger.info('Fetching posts with filters', { 
      searchText, 
      startDate, 
      endDate, 
      tags, 
      page, 
      limit 
    });
    
    // Build query
    const query = {};
    
    // Search by text in postName and description (using text index)
    if (searchText) {
      query.$text = { $search: searchText };
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.uploadTime = {};
      
      if (startDate) {
        query.uploadTime.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.uploadTime.$lte = new Date(endDate);
      }
    }
    
    // Filter by tags
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const posts = await Post.find(query)
      .populate('userId', 'name email')
      .sort({ uploadTime: -1 }) // Sort by upload time (newest first)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalPosts = await Post.countDocuments(query);
    
    logger.info('Posts fetched successfully', { 
      count: posts.length,
      totalPosts,
      page,
      limit
    });
    
    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully',
      data: {
        posts,
        pagination: {
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: parseInt(page),
          hasNextPage: skip + posts.length < totalPosts,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching posts: ${error.message}`, { stack: error.stack });
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts
}; 