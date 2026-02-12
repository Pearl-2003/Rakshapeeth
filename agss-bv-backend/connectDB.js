const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/AGSS_BV', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected via Mongoose');
  } catch (error) {
    console.error('❌ DB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
