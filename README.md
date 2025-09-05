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
- Rate limiting for sensitive endpoints.
- Secure handling of sensitive data (UPI IDs, passwords).

---

## Installation & Setup

1. Clone the repository:

```bash
git clone "https://github.com/vikasyadavvvv/UPI-BACKEND-TASK.git"
cd UPI-BACKEND-TASK
npm install
cd src
nodemon index.js
```
## Create a .env file inside src folder
```bash
PORT=4000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
SALT_ROUNDS=10
```

## Postman Testing endpoints
- 1. The first step is to Register

method post : http://localhost:4000/api/auth/register
```bash
{
  "full_name": "Vikas Yadav",
  "email": "vikas@example.com",
  "mobile": "9876543210",
  "upi_id": "vikas@upi",
  "password": "123456"
}

```


Response shoud be :
```
{
  "message": "User registered"
}
```

- 2. The second step is to login
 method post :  http://localhost:4000/api/auth/login

```bash
{
  "email": "vikas@example.com",
  "password": "123456"
}
```
Response shoud be :
```bash
{
  "token": "<JWT_TOKEN>"
}

```
- Copy this token. You’ll use it for Authorization in Postman:
- Go to the Headers tab
- Add Authorization → Bearer <JWT_TOKEN>

-- 3. The third step is to Add bank Account
 method post  http://localhost:4000/api/backacc/add
```bash
{
  "bank_name": "BOB Bank",
  "account_number": "908290825390",
  "ifsc": "BOB0001234"
}
```
Response shoud be :
```
{
  "account": {
    "id": "23577dbc-6681-4176-ab44-b343a246384c",
    "bank_name": "BOB Bank",
    "account_number": "908290825390",
    "balance": "0.00",
    "created_at": "2025-09-05T15:25:26.950Z"
  }
}
```
-- 4. The fourth step is to send money
method post : http://localhost:4000/aapi/transactions/send
```bash
{
  "to_upi": "friend@upi",
  "amount": 1000,
  "note": "Payment"
}

```
Response should be:
```bash
{
  "message": "Transaction successful",
  "txId": "<transaction_id>"
}

```
-- 5. The Fivth step is request a payment
method post : http://localhost:4000/api/transactions/request
```bash
{
  "from_upi": "friend@upi",
  "amount": 500,
  "note": "Dinner share"
}

```
Response should be:
``
{
  "message": "Request sent",
  "txId": "<request_id>"
}

``
-- 6. The fivth step is to request a payment
method post : http://localhost:4000/api/transactions/respond/<request_id>
```bash
{
  "action": "ACCEPT"
}

```
Response Should be :
```bash
{
  "message": "Request accepted"  // or "Request rejected"
}

```
The other get method are to check history,balance and status
http://localhost:4000/api/transactions/history
http://localhost:4000/api/transactions/balance
http://localhost:4000/api/transactions/status/<txId>








