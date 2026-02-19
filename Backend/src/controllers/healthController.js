const db = require('../config/db');

// Health check endpoint
exports.healthCheck = async (req, res) => {
  try {
    const response = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      message: 'Server is running',
    };
    res.status(200).json(response);
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: err.message,
    });
  }
};

// Database connection test endpoint
exports.testDatabase = async (req, res) => {
  try {
    const isConnected = await db.testConnection();
    
    if (isConnected) {
      res.status(200).json({
        status: 'OK',
        message: 'Database connection successful',
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
      });
    } else {
      res.status(500).json({
        status: 'ERROR',
        message: 'Database connection failed',
      });
    }
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database test failed',
      error: err.message,
    });
  }
};
