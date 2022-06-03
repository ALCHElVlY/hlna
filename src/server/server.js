// Server & Database Variables
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const connectDatabase = require('../server/database/config/db');
const app = express();
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute(s)
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, // set standard rate limit headers
  message: 'Too many requests have been made, please try again later.',
});

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(limiter);

// Routes & auth middleware
const protect = require('../server/middleware/protect.js');
const {
  configRoutes,
  // userRoutes,
  dossierRoutes,
  itemRoutes,
} = require('./routes/');

// Route the API requests
app.use('/api/settings', protect, configRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/dossiers', protect, dossierRoutes);
app.use('/api/items', protect, itemRoutes);


/**
 * The StartServer function initialises the
 * database and express server connections.
 */
async function StartServer() {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};
StartServer();
