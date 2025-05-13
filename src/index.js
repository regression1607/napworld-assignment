require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorHandler');
const { setupLogger } = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const logger = setupLogger();
// Connect to Mongo
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/content_api')
  .then(() => {
    logger.info('Connected to MongoDB successfully');
  })
  .catch((err) => {
    logger.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Middleware
app.use(helmet());
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined')); 

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', postRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app; 