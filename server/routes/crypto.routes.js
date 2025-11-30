const express = require('express');
const router = express.Router();
const Crypto = require('../model/crypto');

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Please login first' });
    }
    next();
};

// Home page - FIXED with user passed
router.get('/', async (req, res) => {
    try {
        let cryptos = [];
        if (req.isAuthenticated()) {
            cryptos = await Crypto.find({ userId: req.user._id }).sort({ createdAt: -1 });
        }
        res.render('index', {
            title: 'Crypto Portfolio Tracker',
            cryptos: cryptos,
            user: req.user || null  // ADDED THIS LINE
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Unable to load cryptocurrencies',
            user: req.user || null  // ADDED THIS LINE
        });
    }
});

// CREATE (Protected)
router.post('/api/crypto', requireAuth, async (req, res) => {
    try {
        const crypto = new Crypto({
            userId: req.user._id,
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
        res.status(400).json({ error: error.message });
    }
});

// READ (Shows only user's cryptos)
router.get('/api/crypto', async (req, res) => {
    try {
        let cryptos = [];
        if (req.isAuthenticated()) {
            cryptos = await Crypto.find({ userId: req.user._id }).sort({ createdAt: -1 });
        }
        res.json(cryptos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ ONE (Protected)
router.get('/api/crypto/:id', requireAuth, async (req, res) => {
    try {
        const crypto = await Crypto.findOne({ _id: req.params.id, userId: req.user._id });
        if (!crypto) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(crypto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE (Protected)
router.put('/api/crypto/:id', requireAuth, async (req, res) => {
    try {
        const crypto = await Crypto.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
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
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(crypto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE (Protected)
router.delete('/api/crypto/:id', requireAuth, async (req, res) => {
    try {
        const crypto = await Crypto.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!crypto) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json({ message: 'Deleted successfully', crypto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;