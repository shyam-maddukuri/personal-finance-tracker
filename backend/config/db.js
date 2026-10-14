const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose ODM.
 * 
 * Why this is needed:
 * Mongoose acts as a bridge between Node.js and MongoDB.
 * It provides schema validation, type casting, and query helpers.
 * 
 * How this works:
 * 1. First tries to connect to the MONGODB_URI provided in .env (local daemon or Atlas).
 * 2. If no local MongoDB service is running, it gracefully falls back to an
 *    in-memory MongoDB instance (mongodb-memory-server). This allows the student
 *    project to run out-of-the-box without requiring installation of MongoDB binaries.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance_tracker';

  try {
    // Attempt connecting to the configured MongoDB URI with a short timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Wait max 2.5 seconds before falling back
    });
    console.log(`[Database] Successfully connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to MongoDB at ${uri}.`);
    console.log('[Database] Starting in-memory MongoDB instance for academic demo...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB connected successfully at: ${memoryUri}`);
      console.log('[Database] Ready to store and query transactions & budgets in MongoDB!');
    } catch (memErr) {
      console.error('[Database] Failed to initialize in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
}

module.exports = connectDB;
