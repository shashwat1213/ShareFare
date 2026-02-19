const { Pool } = require('pg');
require('dotenv').config();

// Create a new connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.on('connect', () => {
  console.log('✓ PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('✗ Unexpected error on idle client', err);
});

// Function to test database connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    return false;
  }
};

// Function to execute queries
const query = (text, params) => {
  return pool.query(text, params);
};

// Function to get a client from the pool
const getClient = () => {
  return pool.connect();
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('✓ Database pool closed');
  } catch (err) {
    console.error('✗ Error closing pool:', err);
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  closePool,
};
