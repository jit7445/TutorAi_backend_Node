const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    if (!config.mongooseUri) {
      console.warn('⚠️ MONGODB_URI is not defined in environment variables');
      return;
    }

    const conn = await mongoose.connect(config.mongooseUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
