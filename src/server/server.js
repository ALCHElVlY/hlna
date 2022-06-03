// Server & Database Variables
const express = require('express');
const app = express();
const connectDB = require('../server/database/config/db');
const PORT = process.env.PORT || 5000;

// Express body parser
app.use(express.json());

// Import the routes & the auth middleware
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
 * The connectServer function initialises the
 * database and express server connections.
 */
(async function connectServer() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
