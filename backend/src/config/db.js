const mongoose = require('mongoose');

let retryTimer = null;

const connectDB = async () => {
  // Support both MONGO_URI and MONGODB_URI
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri || uri.includes('user:password@cluster0.mongodb.net') || uri.includes('<username>')) {
    const errorMsg = 'MONGO_URI is missing or contains unconfigured placeholder values in backend/.env';
    console.error('\n============================================================');
    console.error('⚠️  MONGODB CONNECTION CONFIGURATION REQUIRED');
    console.error('============================================================');
    console.error('Please open: backend/.env');
    console.error('Paste your MongoDB Atlas connection string into: MONGO_URI');
    console.error('Example: MONGO_URI=mongodb+srv://user:pass@cluster0.xxx.mongodb.net/personal_finance_tracker?retryWrites=true&w=majority\n');
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ Mongoose connected successfully to MongoDB Atlas: ${conn.connection.host}`);
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Atlas Connection Error:');
    console.error(`   ${error.message}`);
    console.error('   • Check if your database user password in MONGO_URI is correct');
    console.error('   • If your network changed, ensure 0.0.0.0/0 is added in MongoDB Atlas (Network Access)');

    // Start background reconnection retry so server auto-connects as soon as Atlas whitelist is updated
    if (!retryTimer) {
      retryTimer = setInterval(async () => {
        if (mongoose.connection.readyState !== 1) {
          try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log('✅ Successfully connected to MongoDB Atlas on background retry!');
            clearInterval(retryTimer);
            retryTimer = null;
          } catch (err) {
            // Continue retrying periodically
          }
        }
      }, 10000);
    }

    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection lost / disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB connection restored');
});

module.exports = connectDB;
