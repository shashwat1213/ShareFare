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

// 🔥 Automatic Schema Initialization
const initializeDatabase = async () => {
  try {
    console.log('Initializing database schema...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ Database schema ready');
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

