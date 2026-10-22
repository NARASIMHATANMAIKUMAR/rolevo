const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// CORS lets the React app (different origin/port) call this API.
// If CLIENT_URL is set we only allow that origin, otherwise allow all.
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Parses JSON request bodies into req.body
app.use(express.json());

// Ensure MongoDB is connected before handling requests (required for serverless/Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Health check routes
app.get('/', (req, res) => {
  res.json({ message: 'Rolevo API is running' });
});
app.get('/api', (req, res) => {
  res.json({ message: 'Rolevo API is running' });
});

// Mount route groups (support both /api/path and /path in serverless rewrites)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/applications', applicationRoutes);

// Any route not matched above
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Central error handler: catches errors passed with next(err)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and listen on port when not running serverless on Vercel
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;
