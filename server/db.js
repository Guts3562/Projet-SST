import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sst_tunisie',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    console.error('Make sure PostgreSQL is running and credentials in server/.env are correct.');
  } else {
    console.log('✅ Database connected successfully');
  }
});

export default pool;
