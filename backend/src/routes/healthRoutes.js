const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  const readyStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateCode = mongoose.connection.readyState;
  const isDbConnected = stateCode === 1;

  res.status(200).json({
    status: isDbConnected ? 'healthy' : 'degraded',
    message: isDbConnected
      ? 'Backend and MongoDB Atlas are operational'
      : 'Backend is running, but MongoDB is not connected',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: isDbConnected,
      state: readyStates[stateCode] || 'unknown',
      readyState: stateCode,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
