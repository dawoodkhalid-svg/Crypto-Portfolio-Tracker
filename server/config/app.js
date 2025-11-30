require('dotenv').config();
const connectDB = require('./db');
connectDB();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./passport');

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// ADD SESSION
app.use(session({
    secret: process.env.SESSION_SECRET || 'crypto_tracker_secret_key_12345',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI 
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week so it doesnt give me an error
    }
}));

// ADD PASSPORT
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../../public')));

// MAKE USER AVAILABLE IN VIEWS
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

const cryptoRoutes = require('../routes/crypto.routes');
const authRoutes = require('../routes/auth.routes');

app.use('/', authRoutes);
app.use('/', cryptoRoutes);

// 404 Error handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: '404 - Page Not Found',
        message: 'The page you are looking for does not exist.',
        user: req.user || null  // ADD THIS LINE
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something went wrong!',
        user: req.user || null  // ADD THIS LINE
    });
});

module.exports = app;