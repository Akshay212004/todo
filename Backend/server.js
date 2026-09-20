require('dotenv').config(); // must run before anything reads process.env

const connectDB = require('./config/db');
const app = require('./app');

// Fail fast if required configuration is missing.
['MONGO_URI', 'JWT_SECRET'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // 0.0.0.0 lets the Android emulator / a phone on your Wi-Fi reach the server.
  app.listen(PORT, '0.0.0.0', () => console.log(`API running on port ${PORT}`));
});
