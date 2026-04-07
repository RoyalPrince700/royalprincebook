const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const configurePassport = require('./config/passport');

// Load environment variables
dotenv.config();

const app = express();
configurePassport();

const buildAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:5173',
    'https://royalprincehub.com',
    'https://www.royalprincehub.com'
  ];

  const originVariants = new Set([...defaultOrigins, ...configuredOrigins]);

  for (const origin of [...originVariants]) {
    try {
      const url = new URL(origin);
      const host = url.hostname;

      if (host.startsWith('www.')) {
        url.hostname = host.replace(/^www\./, '');
      } else if (host.includes('.')) {
        url.hostname = `www.${host}`;
      }

      originVariants.add(url.origin);
    } catch (_error) {
      // Ignore invalid origin strings from env so one bad value does not break boot.
    }
  }

  return [...originVariants];
};

const allowedOrigins = buildAllowedOrigins();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookwriter')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/books', require('./routes/books'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/export', require('./routes/export'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Book Writer API is running' });
});

// Get Flutterwave Public Key
app.get('/api/config/flutterwave-public-key', (req, res) => {
  res.json({ publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;