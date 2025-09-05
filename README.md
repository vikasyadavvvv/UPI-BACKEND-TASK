# UPI App Backend

A backend service for a UPI-based transaction system, built for a Backend Developer Technical Assignment. This backend provides secure, RESTful APIs for user authentication, bank account management, UPI transactions, and transaction history.

**Tech Stack:**  
- Node.js (Express.js)  
- PostgreSQL  
- JWT (Authentication)  
- bcrypt (Password Hashing)  

---

## 🚀 Features

### 1. Database Schema
- **Normalized relational schema:**  
  - Users  
  - Bank Accounts  
  - Transactions  
- **Migrations & Seed Data:** Easily set up and seed your database.
- **Performance:** Indexed tables for optimized queries.

### 2. Authentication & Authorization
- **JWT-based authentication:** Secure, stateless sessions.
- **Password security:** Hashing with bcrypt.
- **Role-based authorization:** Protected endpoints with middleware.

### 3. UPI Transaction APIs
- **Send Money:** Instantly transfer funds via UPI ID.
- **Receive Money:** Request or accept payment.
- **Transaction History:** Filter by date or status.
- **Check Balance:** See all linked bank accounts and balances.
- **Transaction Status:** Real-time status (Pending, Success, Failed).

### 4. Security & Validations
- **Input validation & sanitization:** All endpoints are validated.
- **Rate limiting:** Throttle sensitive operations.
- **Sensitive data handling:** Secure storage of UPI IDs and passwords.

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
    ```bash
    git clone "https://github.com/vikasyadavvvv/UPI-BACKEND-TASK.git"
    cd UPI-BACKEND-TASK
    npm install
    cd src
    nodemon index.js
    ```

2. **Configure Environment Variables:**  
   Create a `.env` file in the `src` folder:
    ```bash
    PORT=4000
    DATABASE_URL=your_postgres_connection_string
    JWT_SECRET=your_secret
    JWT_EXPIRES_IN=1h
    SALT_ROUNDS=10
    ```

3. **Database Setup:**  
   - Ensure PostgreSQL is running.
   - Run migrations and seeders (if provided).

---
### The Flow of backend 

## 🧪 API Usage & Postman Testing

### 1️⃣ Register a User

- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
    ```json
    {
      "full_name": "Vikas Yadav",
      "email": "vikas@example.com",
      "mobile": "9876543210",
      "upi_id": "vikas@upi",
      "password": "123456"
    }
    ```
- **Response:**
    ```json
    { "message": "User registered" }
    ```

---

### 2️⃣ Login

- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
    ```json
    {
      "email": "vikas@example.com",
      "password": "123456"
    }
    ```
- **Response:**
    ```json
    { "token": "<JWT_TOKEN>" }
    ```
- Copy the token. For subsequent requests, add the following header:
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```

---

### 3️⃣ Add Bank Account

- **Endpoint:** `POST /api/backacc/add`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
    ```json
    {
      "bank_name": "BOB Bank",
      "account_number": "908290825390",
      "ifsc": "BOB0001234"
    }
    ```
- **Response:**
    ```json
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

---

### 4️⃣ Send Money

- **Endpoint:** `POST /api/transactions/send`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
    ```json
    {
      "to_upi": "friend@upi",
      "amount": 1000,
      "note": "Payment"
    }
    ```
- **Response:**
    ```json
    {
      "message": "Transaction successful",
      "txId": "<transaction_id>"
    }
    ```

---

### 5️⃣ Request Payment

- **Endpoint:** `POST /api/transactions/request`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
    ```json
    {
      "from_upi": "friend@upi",
      "amount": 500,
      "note": "Dinner share"
    }
    ```
- **Response:**
    ```json
    {
      "message": "Request sent",
      "txId": "<request_id>"
    }
    ```

---

### 6️⃣ Respond to Payment Request

- **Endpoint:** `POST /api/transactions/respond/<request_id>`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body:**
    ```json
    {
      "action": "ACCEPT" // or "REJECT"
    }
    ```
- **Response (Accepted):**
    ```json
    { "message": "Request accepted" }
    ```
- **Response (Rejected):**
    ```json
    { "message": "Request rejected" }
    ```

---

### 7️⃣ Transaction History, Balance, and Status

- **Get Transaction History:**  
  `GET /api/transactions/history`
- **Check Account Balance:**  
  `GET /api/transactions/balance`
- **Check Transaction Status:**  
  `GET /api/transactions/status/<txId>`

---

## 📑 Example Postman Collection

- Import the endpoints above into Postman for easy testing.
- Set `Authorization` header after login to access protected APIs.

---

## 🏗️ Project Structure
<img width="411" height="452" alt="image" src="https://github.com/user-attachments/assets/5ef44d04-1caf-4dfe-b0fc-14172b1ca699" />


## 🛡️ Best Practices Followed

- Clean and modular codebase with separation of concerns.
- Production-ready error handling and input validation.
- Secure credential and sensitive data storage.
- Follows RESTful API conventions.

---


[Vikas Yadav](https://github.com/vikasyadavvvv)
