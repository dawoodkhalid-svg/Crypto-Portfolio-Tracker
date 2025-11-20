// Database configuration and connection
const mongoose = require('mongoose');

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/crypto-tracker';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Get the connection
const db = mongoose.connection;

// Handle connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

// Export mongoose instance
module.exports = mongoose;