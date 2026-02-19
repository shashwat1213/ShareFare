const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✓ PostgreSQL pool connected');
});

pool.on('error', (err) => {
  console.error('✗ Unexpected error on idle client', err);
});

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    throw err; // Important
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
  closePool,
};

