const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  postName: {
    type: String,
    required: [true, 'Post name is required'],
    trim: true,
    minlength: [3, 'Post name must be at least 3 characters long'],
    maxlength: [100, 'Post name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  uploadTime: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional
        return /^https?:\/\/\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL`
    }
  }
}, {
  timestamps: true
});

// Create index for text search on postName and description
postSchema.index({ 
  postName: 'text', 
  description: 'text',
  tags: 'text'
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 