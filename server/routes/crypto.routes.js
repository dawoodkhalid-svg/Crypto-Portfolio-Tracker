// Routes for Crypto Portfolio Tracker
const express = require('express');
const router = express.Router();
const Crypto = require('../model/crypto');

//Home page: Display all cryptos
router.get('/', async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    res.render('index', {
      title: 'Crypto Portfolio Tracker',
      cryptos: cryptos
    });
  } catch (error) {
    console.error('Error fetching cryptos:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Unable to load cryptocurrencies'
    });
  }
});


// API Routes for CRUD operations

// Create: Add new crypto
router.post('/api/crypto', async (req, res) => {
  try {
    const crypto = new Crypto({
      name: req.body.name,
      symbol: req.body.symbol,
      buyPrice: req.body.buyPrice,
      targetPrice: req.body.targetPrice,
      status: req.body.status,
      notes: req.body.notes
    });
    
    await crypto.save();
    res.status(201).json(crypto);
  } catch (error) {
    console.error('Error creating crypto:', error);
    res.status(400).json({ error: error.message });
  }
});

// Read: Get all cryptos (API)
router.get('/api/crypto', async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ createdAt: -1 });
    res.json(cryptos);
  } catch (error) {
    console.error('Error fetching cryptos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Read : Get single crypto by ID
router.get('/api/crypto/:id', async (req, res) => {
  try {
    const crypto = await Crypto.findById(req.params.id);
    if (!crypto) {
      return res.status(404).json({ error: 'Cryptocurrency not found' });
    }
    res.json(crypto);
  } catch (error) {
    console.error('Error fetching crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update: Edit crypto
router.put('/api/crypto/:id', async (req, res) => {
  try {
    const crypto = await Crypto.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        symbol: req.body.symbol,
        buyPrice: req.body.buyPrice,
        targetPrice: req.body.targetPrice,
        status: req.body.status,
        notes: req.body.notes
      },
      { new: true, runValidators: true }
    );
    
    if (!crypto) {
      return res.status(404).json({ error: 'Cryptocurrency not found' });
    }
    
    res.json(crypto);
  } catch (error) {
    console.error('Error updating crypto:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete: Remove crypto
router.delete('/api/crypto/:id', async (req, res) => {
  try {
    const crypto = await Crypto.findByIdAndDelete(req.params.id);
    
    if (!crypto) {
      return res.status(404).json({ error: 'Cryptocurrency not found' });
    }
    
    res.json({ message: 'Cryptocurrency deleted successfully', crypto });
  } catch (error) {
    console.error('Error deleting crypto:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;