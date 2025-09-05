import dotenv from 'dotenv';
dotenv.config();


import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';


const pool = new Pool({ connectionString: process.env.DATABASE_URL });


const run = async () => {
try {
const client = await pool.connect();
const userId = uuidv4();
const accountId = uuidv4();
const password = 'Password123!';
const saltRounds = Number(process.env.SALT_ROUNDS || 10);
const passwordHash = await bcrypt.hash(password, saltRounds);


// Insert user
await client.query(
`INSERT INTO users (id, full_name, email, mobile, upi_id, password_hash) VALUES ($1,$2,$3,$4,$5,$6)`,
[userId, 'Test User', 'test@example.com', '9999999999', 'test@upi', passwordHash]
);


// Insert bank account
await client.query(
`INSERT INTO bank_accounts (id, user_id, bank_name, account_number, ifsc, balance) VALUES ($1,$2,$3,$4,$5,$6)`,
[accountId, userId, 'Example Bank', '123456789012', 'EXAMP0001', 10000.00]
);


console.log('Seed complete. User credentials: email=test@example.com password=Password123!');
client.release();
} catch (err) {
console.error('Seed error', err);
process.exit(1);
} finally {
await pool.end();
}
};


run();