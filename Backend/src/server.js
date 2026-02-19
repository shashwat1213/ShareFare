const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SHAREFAR.AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dbTest: '/api/db-test',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'ERROR',
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    status: 'ERROR',
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await db.testConnection();
    
    app.listen(PORT, () => {
      console.log('\n╔════════════════════════════════════════════════╗');
      console.log(`║  SHAREFAR.AI Backend Server                    ║`);
      console.log(`║  Running on http://localhost:${PORT}                  ║`);
      console.log(`║  Environment: ${process.env.NODE_ENV || 'development'}                     ║`);
      console.log('╚════════════════════════════════════════════════╝\n');
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await db.closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n✓ Shutting down gracefully...');
  await db.closePool();
  process.exit(0);
});

// Start the server
startServer();
