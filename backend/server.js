const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');
const inquiryRoutes = require('./routes/inquiries');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://vktn-granites.vercel.app',
        'https://vktn-granites-78b95l1lo-mouniths-projects-3191ace4.vercel.app',
        /^https:\/\/vktn-granites-.*\.vercel\.app$/
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vktn-granites';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected Successfully'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VKTN Granites API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to VKTN Granites API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});
