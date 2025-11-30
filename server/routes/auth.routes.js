const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.redirect('/#dashboard')
);

router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => res.redirect('/#dashboard')
);

router.get('/auth/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

router.get('/auth/status', (req, res) => {
    res.json({
        authenticated: req.isAuthenticated(),
        user: req.user || null
    });
});

module.exports = router;