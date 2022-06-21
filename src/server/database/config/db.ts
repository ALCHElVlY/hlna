//External imports
import mongoose from 'mongoose';
import { serverConfig } from '../../../interfaces/env_config';


const MONGO_OPTIONS: object = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

/**
 * The connectDatabase function initialises the mongoose db connection.
 */
async function connectDatabase(): Promise<void> {
  try {
    mongoose.connect(serverConfig.MONGO_URI, MONGO_OPTIONS);
    console.log('MongoDB connection sucessful!');
  } catch (error) {
    console.error('MongoDB connection failed.');
    process.exit(1);
  }
}

export default connectDatabase;
