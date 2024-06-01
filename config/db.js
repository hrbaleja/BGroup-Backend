const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(process.env.MONGODB_URI,);
    console.log('MongoDB connected');
  } catch (err) {
    // Handle errors that occur during the initial connection
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;