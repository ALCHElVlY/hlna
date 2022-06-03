require('dotenv').config();
const mongoose = require('mongoose');

/**
 * The connectDB function initialises the mongoose db connection.
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection sucessful!');
  } catch (error) {
    console.error('MongoDB connection failed.');
    process.exit(1);
  }
}

module.exports = connectDB;
