import 'dotenv/config'; // loads .env automatically
import pkg from 'pg';
const { Pool } = pkg;

// Create the pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test connection once at startup
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL");
    client.release(); // release connection back to pool
  })
  .catch(err => {
    console.error("❌ Database connection error:", err.message);
  });

export default pool; // export the actual Pool instance
