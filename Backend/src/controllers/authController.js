const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = '7d';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation: at least 6 chars
const isValidPassword = (password) => password && password.length >= 6;

// Email validation
const isValidEmail = (email) => EMAIL_REGEX.test(email);

/**
 * POST /api/auth/signup
 * Register a new user
 * Body: { name, email, password }
 */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Name, email, and password are required'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Please provide a valid email address'
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'ERROR',
        message: 'Email already registered. Please login instead.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), email.toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Account created successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create account',
      error: err.message
    });
  }
};

/**
 * POST /api/auth/login
 * Login existing user
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Email and password are required'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 'ERROR',
      message: 'Please provide a valid email address'
    });
  }

  try {
    // Find user
    const result = await db.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      status: 'SUCCESS',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Login failed',
      error: err.message
    });
  }
};

/**
 * POST /api/auth/verify
 * Verify JWT token (testing endpoint)
 * Headers: Authorization: Bearer <token>
 */
exports.verify = async (req, res) => {
  res.json({
    status: 'SUCCESS',
    message: 'Token is valid',
    data: {
      user: req.user
    }
  });
};

/**
 * POST /api/auth/logout
 * Logout user (token invalidation on frontend)
 */
exports.logout = async (req, res) => {
  res.json({
    status: 'SUCCESS',
    message: 'Logged out successfully. Please remove token from client.'
  });
};
