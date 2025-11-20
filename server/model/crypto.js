// Cryptocurrency Model
const mongoose = require('mongoose');

// Define Crypto Schema
const cryptoSchema = new mongoose.Schema({
  // Cryptocurrency name (e.g. Bitcoin, Ethereum, etc.)
  name: {
    type: String,
    required: [true, 'Cryptocurrency name is required'],
    trim: true
  },
  
  // Symbol (e.g., BTC, ETH, etc.)
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    uppercase: true,
    trim: true
  },
  
  // Initial buy price
  buyPrice: {
    type: Number,
    required: [true, 'Buy price is required'],
    min: [0, 'Buy price cannot be negative']
  },
  
  // Target sell price
  targetPrice: {
    type: Number,
    required: [true, 'Target price is required'],
    min: [0, 'Target price cannot be negative']
  },
  
  // Status: owned (in portfolio) or watchlist (plan to buy)
  status: {
    type: String,
    enum: ['owned', 'watchlist'],
    default: 'owned'
  },
  
  // Personal notes and predictions
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Additional schema options
  collection: 'cryptos'
});

// Create and export model
module.exports = mongoose.model('Crypto', cryptoSchema);