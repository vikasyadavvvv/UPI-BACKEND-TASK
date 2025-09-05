import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

// Add a new bank account (default balance = 0)
export const addBankAccount = async (req, res) => {
  const { bank_name, account_number, ifsc } = req.body;
  const userId = req.user.id; // from JWT middleware

  if (!bank_name || !account_number || !ifsc) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO bank_accounts (id, user_id, bank_name, account_number, ifsc, balance)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [uuidv4(), userId, bank_name, account_number, ifsc, 0] // start with 0 balance
    );

    return res.status(201).json({ account: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all bank accounts for logged-in user
export const getBankAccounts = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      'SELECT id, bank_name, account_number, balance, created_at FROM bank_accounts WHERE user_id=$1',
      [userId]
    );

    return res.json({ accounts: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Delete a bank account
export const deleteBankAccount = async (req, res) => {
  const userId = req.user.id;
  const accountId = req.params.id;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM bank_accounts WHERE id=$1 AND user_id=$2',
      [accountId, userId]
    );

    if (!rowCount) return res.status(404).json({ error: 'Account not found' });

    return res.json({ message: 'Bank account deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Add money (top-up) to bank account
export const addMoneyToBankAccount = async (req, res) => {
  const userId = req.user.id;
  const { accountId, amount } = req.body;

  if (!accountId || !amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Valid accountId and positive amount are required' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE bank_accounts 
       SET balance = balance + $1 
       WHERE id=$2 AND user_id=$3 
       RETURNING id, bank_name, account_number, balance`,
      [amount, accountId, userId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Account not found' });

    return res.json({ message: 'Money added successfully', account: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
