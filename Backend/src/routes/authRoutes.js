const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * POST /api/auth/signup
 * Register a new user
 * Public route
 */
router.post('/signup', authController.signup);

/**
 * POST /api/auth/login
 * Login user
 * Public route
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/verify
 * Verify token (protected)
 */
router.post('/verify', authMiddleware, authController.verify);

/**
 * POST /api/auth/logout
 * Logout user (protected)
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
