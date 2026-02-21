const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const memberRoutes = require('./routes/memberRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/groups', authMiddleware, groupRoutes);
app.use('/api/members', authMiddleware, memberRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SHAREFAR.AI Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dbTest: '/api/health/db-test',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        verify: 'POST /api/auth/verify (requires auth)',
        logout: 'POST /api/auth/logout (requires auth)'
      },
      groups: {
        create: 'POST /api/groups (requires auth)',
        getUserGroups: 'GET /api/groups/user?userEmail=email (requires auth)',
        getGroupDetails: 'GET /api/groups/:groupId (requires auth)',
        getInviteLink: 'GET /api/groups/:groupId/invite (requires auth)'
      },
      members: {
        addMember: 'POST /api/members/add/:groupId (requires auth)',
        joinViaToken: 'POST /api/members/join/:token (requires auth)',
        removeMember: 'DELETE /api/members/:groupId/:userId (requires auth)',
        getMembers: 'GET /api/members/:groupId (requires auth)'
      }
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

// 🚀 Start Server with Auto DB Setup
const startServer = async () => {
  try {
    await db.testConnection();

    // 🔥 Automatically create tables
    await db.initializeDatabase();

    app.listen(PORT, '0.0.0.0', () => {
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

// Start
startServer();
