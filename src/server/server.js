// Server & Database Variables
const express = require('express');
const app = express();
const connectDB = require('../server/database/config/db');
const PORT = process.env.PORT || 5000;

// Express body parser
app.use(express.json());

// Import the routes
/* const {
	configRoutes,
	userRoutes,
} = require('./routes/index');*/

// Route the API requests
/* app.use('/api/settings', configRoutes);
app.use('/api/users', userRoutes);*/

/**
 * The connectServer function initialises the
 * database and express server connections.
 */
(async function connectServer() {
	await connectDB();
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();