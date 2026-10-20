const mongoose = require('mongoose');

let isConnected = false;

// Connects to MongoDB using the connection string from .env
// Supports both standalone Node server and serverless Vercel environments
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1); // stop local server if DB fails
    }
    throw err;
  }
}

module.exports = connectDB;
