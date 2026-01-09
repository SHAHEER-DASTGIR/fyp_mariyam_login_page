console.log('=== SERVER STARTING ===');
console.log('Step 1: Loading modules...');

const express = require('express');
console.log('✅ Express loaded');

const mongoose = require('mongoose');
console.log('✅ Mongoose loaded');

const cors = require('cors');
console.log('✅ CORS loaded');

const dotenv = require('dotenv');
console.log('✅ Dotenv loaded');

console.log('Step 2: Configuring dotenv...');
dotenv.config();
console.log('✅ Dotenv configured');

console.log('Step 3: Creating Express app...');
const app = express();
console.log('✅ Express app created');

console.log('Step 4: Setting up middleware...');
app.use(cors());
app.use(express.json());
console.log('✅ Middleware configured');

console.log('Step 5: Checking environment variables...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT || 5000);

console.log('Step 6: Setting up routes...');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});
console.log('✅ Routes configured');

console.log('Step 7: Connecting to MongoDB...');
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connected successfully!');
    })
    .catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
    });
} else {
  console.error('❌ MONGODB_URI is missing in .env file!');
}

console.log('Step 8: Starting server...');
const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('✅ SERVER IS RUNNING!');
    console.log(`🚀 Open browser: http://localhost:${PORT}`);
    console.log('='.repeat(60) + '\n');
    console.log('Server is ready. Press Ctrl+C to stop.\n');
  });
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.error('Full error:', error);
}

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});

console.log('=== SERVER SCRIPT COMPLETED ===');