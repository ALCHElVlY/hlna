// External imports
import express, { Application } from 'express';
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

// Internal imports
import connectDatabase from './database/config/db';
import { serverConfig } from '../interfaces/env_config';
import protect from '../server/middleware/protect.js';
import {
  configRoute,
  // userRoutes,
  dossierRoute,
  itemsRoute,
} from './routes/';

const app: Application = express();
const PORT: number = serverConfig.PORT | 5000;
const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute(s)
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, // set standard rate limit headers
  message: 'Too many requests have been made, please try again later.',
});

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(limiter);

// Route the API requests
app.use('/api/settings', protect, configRoute);
// app.use('/api/users', userRoutes);
app.use('/api/dossiers', protect, dossierRoute);
app.use('/api/items', protect, itemsRoute);

// Asynchronously connect the database
// and then start the server
(async (): Promise<void> => {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
