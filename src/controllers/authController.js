import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const register = async (req, res) => {
const { full_name, email, mobile, upi_id, password } = req.body;
try {
// Check if email/upi/mobile exist
const { rows: existing } = await pool.query('SELECT id FROM users WHERE email=$1 OR upi_id=$2 OR mobile=$3', [email, upi_id, mobile]);
if (existing.length) return res.status(400).json({ error: 'User already exists' });


const id = uuidv4();
const saltRounds = Number(process.env.SALT_ROUNDS || 10);
const password_hash = await bcrypt.hash(password, saltRounds);


await pool.query(
`INSERT INTO users (id, full_name, email, mobile, upi_id, password_hash) VALUES ($1,$2,$3,$4,$5,$6)`,
[id, full_name, email, mobile, upi_id, password_hash]
);


return res.status(201).json({ message: 'User registered' });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
};


export const login = async (req, res) => {
const { email, password } = req.body;
try {
const { rows } = await pool.query('SELECT id, password_hash, upi_id FROM users WHERE email=$1', [email]);
if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });


const user = rows[0];
const match = await bcrypt.compare(password, user.password_hash);
if (!match) return res.status(400).json({ error: 'Invalid credentials' });


const token = jwt.sign({ id: user.id, upi_id: user.upi_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
return res.json({ token });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
};