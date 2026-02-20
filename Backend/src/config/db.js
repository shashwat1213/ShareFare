const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway
  },
});

// When pool connects
pool.on('connect', () => {
  console.log('✓ PostgreSQL pool connected');
});

// Handle unexpected errors
pool.on('error', (err) => {
  console.error('✗ Unexpected error on idle client', err);
});

// Test DB connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    throw err;
  }
};

// 🔥 Full Schema Initialization
const initializeDatabase = async () => {
  try {
    console.log('Initializing database schema...');

    await pool.query(`

      -- USERS TABLE
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- GROUPS TABLE
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        invite_token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- GROUP MEMBERS (Many-to-Many)
      CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_id, user_id)
      );

      -- EXPENSES TABLE
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        paid_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- EXPENSE SPLITS TABLE
      CREATE TABLE IF NOT EXISTS expense_splits (
        id SERIAL PRIMARY KEY,
        expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
        UNIQUE(expense_id, user_id)
      );

      -- SETTLEMENTS TABLE
      CREATE TABLE IF NOT EXISTS settlements (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        from_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
        to_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
        settled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    `);

    console.log('✓ All tables created or already exist');
  } catch (err) {
    console.error('✗ Error initializing database:', err);
    throw err;
  }
};

const query = (text, params) => pool.query(text, params);
const getClient = () => pool.connect();

const closePool = async () => {
  await pool.end();
  console.log('✓ Database pool closed');
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  initializeDatabase,
  closePool,
};

