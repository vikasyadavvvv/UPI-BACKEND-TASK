# 🚀 UPI App Backend

A production-ready backend for a UPI-based transaction system, built as a technical assignment for backend developers. This backend delivers robust, secure RESTful APIs for **user authentication**, **bank account management**, **UPI transactions**, and **transaction history**.

---

## 🛠️ Tech Stack

- **Node.js** (Express.js)
- **PostgreSQL**
- **JWT** (Authentication)
- **bcrypt** (Password Hashing)
- **Joi** (Validation)
- **uuid** (Unique IDs)

---

## ✨ Features

### 🗄️ 1. Database Schema
- **Normalized relational design**:  
  - `Users`
  - `Bank Accounts`
  - `Transactions`
- **Migrations & Seed Data**: Quick setup and test.
- **Performance**: Indexed tables for fast lookups.

### 🔒 2. Authentication & Authorization
- **JWT-based authentication**: Stateless, secure sessions.
- **Strong password security**: Hashed with bcrypt.
- **Role-based authorization**: API protection with middleware.

### 💸 3. UPI Transaction APIs
- **Send Money**: Instantly transfer funds via UPI ID.
- **Request/Receive Money**: Request or approve payments.
- **Transaction History**: Filter by date or status.
- **Check Balance**: See balances of all linked accounts.
- **Real-time Status**: Transactions marked as Pending, Success, or Failed.

### 🛡️ 4. Security & Validations
- **Input validation & sanitization**: All endpoints protected.
- **Rate limiting**: Prevents abuse on sensitive routes.
- **Sensitive data handling**: Secure storage of UPI IDs and passwords.

---

## ⚡ Quickstart

#### 1. **Clone & Install**

```bash
git clone "https://github.com/vikasyadavvvv/UPI-BACKEND-TASK.git"
cd UPI-BACKEND-TASK
npm install
cd src
nodemon index.js
```

#### 2. **Environment Setup**

Create a `.env` in the `src` folder:

```bash
PORT=4000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1h
SALT_ROUNDS=10
```

#### 3. **Database Setup**

- Ensure **PostgreSQL** is running.
- Run migrations and seeders (if provided).

---

## 🔁 Backend Flow Overview

```mermaid
flowchart TD
    A[User Registration] --> B[User Login]
    B --> C[Add Bank Account]
    C --> D[Make Transaction]
    D --> E[Transaction History]

    subgraph Transaction
        D1[Send/Request/Receive Money]
        D2[Transaction Checks & Status]
        D3[Balance Update]
    end

    D --> D1
    D1 --> D2
    D2 --> D3
    D3 --> E
```

---

## 🧪 API Usage & Examples

### 1️⃣ Register User

- **POST** `/api/auth/register`
- **Body:**
```json
{
  "full_name": "Vikas Yadav",
  "email": "vikas@example.com",
  "mobile": "9876543210",
  "upi_id": "vikas@upi",
  "password": "123456"
}
```

### 2️⃣ Login

- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "vikas@example.com",
  "password": "123456"
}
```
- **Response:** `{ "token": "<JWT_TOKEN>" }`
- Add header: `Authorization: Bearer <JWT_TOKEN>`

### 3️⃣ Add Bank Account

- **POST** `/api/backacc/add`
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
```json
{
  "bank_name": "BOB Bank",
  "account_number": "908290825390",
  "ifsc": "BOB0001234"
}
```

### 4️⃣ Send Money

- **POST** `/api/transactions/send`
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
```json
{
  "to_upi": "friend@upi",
  "amount": 1000,
  "note": "Payment"
}
```

### 5️⃣ Request Payment

- **POST** `/api/transactions/request`
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**
```json
{
  "from_upi": "friend@upi",
  "amount": 500,
  "note": "Dinner share"
}
```

### 6️⃣ Respond to Payment Request

- **POST** `/api/transactions/respond/<request_id>`
- **Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Body:**  
  `{ "action": "ACCEPT" }`  or  `{ "action": "REJECT" }`

### 7️⃣ Transaction History, Balance, Status

- **GET** `/api/transactions/history`
- **GET** `/api/transactions/balance`
- **GET** `/api/transactions/status/<txId>`

---

## 📑 Postman Collection

- Import these endpoints into Postman.
- Set `Authorization` header after login for all protected APIs.

---

## 📁 Project Structure

<img width="411" height="452" alt="image" src="https://github.com/user-attachments/assets/58edada1-695c-4a6b-b058-d2580acc0390" />


---

## 🏆 Best Practices

- **Clean, modular codebase**: Separation of controllers, services, middlewares.
- **Production-grade error handling** & **input validation**.
- **Secure storage** of credentials and sensitive data.
- **RESTful API conventions**.

---

## 🧑‍💻 Author

**[Vikas Yadav](https://github.com/vikasyadavvvv)**

---
