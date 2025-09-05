-- 001_init.sql


BEGIN;


-- Users table
CREATE TABLE IF NOT EXISTS users (
id UUID PRIMARY KEY,
full_name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
mobile TEXT UNIQUE NOT NULL,
upi_id TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Bank accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
id UUID PRIMARY KEY,
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
bank_name TEXT NOT NULL,
account_number TEXT NOT NULL,
ifsc TEXT NOT NULL,
balance NUMERIC(14,2) DEFAULT 0,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
id UUID PRIMARY KEY,
from_account_id UUID REFERENCES bank_accounts(id),
to_account_id UUID REFERENCES bank_accounts(id),
amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
status TEXT NOT NULL CHECK (status IN ('PENDING','SUCCESS','FAILED')),
type TEXT NOT NULL CHECK (type IN ('SEND','REQUEST','RECEIVE')),
note TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


-- Indexes to speed frequent queries
CREATE INDEX IF NOT EXISTS idx_users_upi_id ON users(upi_id);
CREATE INDEX IF NOT EXISTS idx_bank_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);


COMMIT;