require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 * 
 * 1. cors: Enables Cross-Origin Resource Sharing so our React frontend (port 5173)
 *    can make API requests to this Express backend (port 5000).
 * 2. express.json: Automatically parses incoming JSON request bodies.
 */
app.use(cors());
app.use(express.json());

// Request logger for easy debugging during student demonstrations
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint to verify backend status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Personal Finance Tracker API',
    timestamp: new Date()
  });
});

// Register API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start Server after establishing Database Connection
 */
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Personal Finance Tracker Backend is running!`);
    console.log(` Server URL : http://localhost:${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(` Summary API : http://localhost:${PORT}/api/transactions/summary`);
    console.log(`=======================================================`);
  });
}

startServer();
