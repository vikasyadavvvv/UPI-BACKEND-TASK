import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';


// Send money by UPI id
export const sendMoney = async (req, res) => {
const { to_upi, amount, note } = req.body;
const fromUserId = req.user.id;


try {
// Find recipient's bank account
const { rows: recipient } = await pool.query(
'SELECT u.id as user_id, b.id as bank_account_id FROM users u JOIN bank_accounts b ON b.user_id = u.id WHERE u.upi_id=$1 LIMIT 1',
[to_upi]
);
if (!recipient.length) return res.status(404).json({ error: 'Recipient not found' });


const recipientAccountId = recipient[0].bank_account_id;


// Find sender's bank account
const { rows: senderAccounts } = await pool.query('SELECT id, balance FROM bank_accounts WHERE user_id=$1 LIMIT 1', [fromUserId]);
if (!senderAccounts.length) return res.status(400).json({ error: 'Sender has no linked account' });
const senderAccount = senderAccounts[0];


if (Number(senderAccount.balance) < Number(amount)) return res.status(400).json({ error: 'Insufficient funds' });


// Start transaction
const client = await pool.connect();
try {
await client.query('BEGIN');


const txId = uuidv4();


// Create transaction record
await client.query(
`INSERT INTO transactions (id, from_account_id, to_account_id, amount, status, type, note)
VALUES ($1,$2,$3,$4,$5,$6,$7)`,
[txId, senderAccount.id, recipientAccountId, amount, 'PENDING', 'SEND', note || null]
);


// Deduct from sender
await client.query('UPDATE bank_accounts SET balance = balance - $1 WHERE id=$2', [amount, senderAccount.id]);


// Add to recipient
await client.query('UPDATE bank_accounts SET balance = balance + $1 WHERE id=$2', [amount, recipientAccountId]);

// Mark success
await client.query('UPDATE transactions SET status=$1 WHERE id=$2', ['SUCCESS', txId]);



await client.query('COMMIT');


return res.json({ message: 'Transaction successful', txId });
} catch (err) {
    console.log(err)
await client.query('ROLLBACK');
console.error('TX error', err);
return res.status(500).json({ error: 'Transaction failed' });
} finally {
client.release();
}
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
};

// Request money
export const requestMoney = async (req, res) => {
  const { from_upi, amount, note } = req.body;  // from_upi = person you want money from
  const toUserId = req.user.id; // requester (logged in user)

  try {
    // Find payer (the person who will pay)
    const { rows: payer } = await pool.query(
      'SELECT u.id as user_id, b.id as bank_account_id FROM users u JOIN bank_accounts b ON b.user_id = u.id WHERE u.upi_id=$1 LIMIT 1',
      [from_upi]
    );
    if (!payer.length) return res.status(404).json({ error: 'Payer not found' });

    const payerAccountId = payer[0].bank_account_id;

    // Find requester (receiver’s bank account)
    const { rows: receiverAccounts } = await pool.query('SELECT id FROM bank_accounts WHERE user_id=$1 LIMIT 1', [toUserId]);
    if (!receiverAccounts.length) return res.status(400).json({ error: 'Requester has no linked account' });
    const receiverAccountId = receiverAccounts[0].id;

    const txId = uuidv4();

    await pool.query(
      `INSERT INTO transactions (id, from_account_id, to_account_id, amount, status, type, note)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [txId, payerAccountId, receiverAccountId, amount, 'PENDING', 'REQUEST', note || null]
    );

    return res.json({ message: 'Request created', txId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};


// Respond to request
export const respondRequest = async (req, res) => {
  const { action } = req.body; // "ACCEPT" or "REJECT"
  const txId = req.params.id;
  const userId = req.user.id; // person who needs to accept/reject

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get the transaction
    const { rows: tx } = await client.query(
      `SELECT * FROM transactions WHERE id=$1 AND type='REQUEST' FOR UPDATE`,
      [txId]
    );
    if (!tx.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Request not found' });
    }
    const request = tx[0];

    // Ensure only payer can respond
    const { rows: payer } = await client.query('SELECT user_id FROM bank_accounts WHERE id=$1', [request.from_account_id]);
    if (!payer.length || payer[0].user_id !== userId) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Not authorized to respond' });
    }

    if (action === 'REJECT') {
      await client.query('UPDATE transactions SET status=$1 WHERE id=$2', ['REJECTED', txId]);
      await client.query('COMMIT');
      return res.json({ message: 'Request rejected' });
    }

    if (action === 'ACCEPT') {
      // Check payer balance
      const { rows: sender } = await client.query('SELECT id, balance FROM bank_accounts WHERE id=$1 FOR UPDATE', [request.from_account_id]);
      if (Number(sender[0].balance) < Number(request.amount)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Deduct payer
      await client.query('UPDATE bank_accounts SET balance = balance - $1 WHERE id=$2', [request.amount, request.from_account_id]);

      // Credit receiver
      await client.query('UPDATE bank_accounts SET balance = balance + $1 WHERE id=$2', [request.amount, request.to_account_id]);

      // Mark success
      await client.query('UPDATE transactions SET status=$1 WHERE id=$2', ['SUCCESS', txId]);

      await client.query('COMMIT');
      return res.json({ message: 'Request accepted, money transferred', txId });
    }

    await client.query('ROLLBACK');
    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
};




// Transaction history
export const getHistory = async (req, res) => {
const userId = req.user.id;
const { from, to, status } = req.query;

try {
const { rows: accounts } = await pool.query('SELECT id FROM bank_accounts WHERE user_id=$1', [userId]);
const accountIds = accounts.map(a => a.id);
if (!accountIds.length) return res.json({ transactions: [] });


let base = `SELECT * FROM transactions WHERE (from_account_id = ANY($1) OR to_account_id = ANY($1))`;
const params = [accountIds];
let idx = 2;


if (status) {
base += ` AND status = $${idx}`;
params.push(status);
idx++;
}
if (from) {
base += ` AND created_at >= $${idx}`;
params.push(from);
idx++;
}
if (to) {
base += ` AND created_at <= $${idx}`;
params.push(to);
idx++;
}

base += ' ORDER BY created_at DESC LIMIT 100';


const { rows } = await pool.query(base, params);
return res.json({ transactions: rows });
} catch (err) {
        console.log(err)
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
};


// Check balances
export const checkBalance = async (req, res) => {
const userId = req.user.id;
try {
const { rows } = await pool.query('SELECT id, bank_name, account_number, balance FROM bank_accounts WHERE user_id=$1', [userId]);
return res.json({ accounts: rows });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Server error' });
}
};

// Transaction status
export const txStatus = async (req, res) => {
  const txId = req.params.id;
  try {
    const { rows } = await pool.query(
      `SELECT t.id, t.amount, t.status, t.type, t.note, 
              b1.account_number AS from_account,
              b2.account_number AS to_account,
              t.created_at
       FROM transactions t
       JOIN bank_accounts b1 ON t.from_account_id = b1.id
       JOIN bank_accounts b2 ON t.to_account_id = b2.id
       WHERE t.id=$1`,
      [txId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Transaction not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
