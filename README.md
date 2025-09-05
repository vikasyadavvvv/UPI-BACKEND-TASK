# UPI App Backend Development

## Project Overview
This project is a **UPI-based transaction system** backend built as a part of a Backend Developer Technical Assignment. The backend provides secure and scalable APIs for performing UPI transactions, managing users and bank accounts, and maintaining transaction history.

**Tech Stack:** Node.js (Express.js), PostgreSQL

---

## Objective
As a backend developer, the goal of this project is to:

- Develop RESTful APIs for authentication, authorization, and transactions.
- Design a normalized and optimized relational database schema.
- Apply security best practices and input validations.
- Deliver clean, maintainable, and production-ready code.

---

## Features

### 1. Database Schema
- Normalized schema with relationships for:
  - Users
  - Bank Accounts
  - Transactions
- Implemented migrations and seed data.
- Indexed tables to optimize frequent queries.

### 2. Authentication and Authorization
- JWT-based authentication for secure access.
- Passwords stored securely using bcrypt hashing.
- Authorization middleware to protect sensitive endpoints.

### 3. UPI Transaction Features
- **Send Money:** Transfer funds using UPI ID.
- **Receive Money:** Request or accept incoming transfers.
- **Transaction History:** Retrieve transactions with filters (date range, status).
- **Transaction Status:** Check transaction state (Pending, Success, Failed).
- **Check Balance:** Retrieve balances across linked bank accounts.

### 4. Security and Validations
- Input validation and sanitization for all endpoints.
- Protection against SQL injection and brute-force attacks.
- Rate limiting for sensitive endpoints.
- Secure handling of sensitive data (UPI IDs, passwords).

---

## Installation & Setup

1. Clone the repository:

```bash
git clone
cd
npm install
cd src
nodemon index.js
git clone <your-repo-url>
cd upi-backend
