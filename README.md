# 💳 Digital Wallet API

<p align="center">
  <img src="https://placehold.co/600x150/2E8B57/white?text=Digital+Wallet+API" alt="Digital Wallet API Banner" />
</p>

A robust and secure backend API for managing a comprehensive digital wallet ecosystem. This project facilitates various financial transactions, including peer-to-peer transfers, deposits, and agent-assisted cash-in and cash-out services. Built with a modern tech stack, it prioritizes **security**, **data integrity**, and **scalability**, making it a reliable foundation for a financial platform.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-8A2BE2?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

✨ Core Features
Secure Authentication 🔐: Leverages JSON Web Tokens (JWT) for secure, state-less authentication of users, agents, and administrators.

Atomic Transactions 💰: All financial operations are wrapped in Mongoose sessions, guaranteeing data integrity and consistency through atomic database transactions.

Transaction Fees 💸: A flexible commission system automatically calculates and applies fees for cash-in and cash-out services.

Agent Commissions 🤝: The commission fee is automatically credited to the agent's digital wallet, providing an incentive for providing services.

Role-Based Access Control (RBAC) 🔒: Protects sensitive endpoints by restricting access based on user roles (admin, agent, user).

Zod Validation ✅: Ensures all incoming API requests are validated with a robust, TypeScript-first schema validation library.

Comprehensive Transaction History 📜: Every financial event—including deposits, withdrawals, transfers, and commission payouts—is logged with detailed information.

Robust Error Handling 💥: A custom global error handler provides consistent and meaningful error responses for various application and validation failures.

💻 Technologies Used
This project is built using a modern JavaScript ecosystem and leverages the following technologies:

Backend Framework: Node.js & Express.js

Database: MongoDB

ODM: Mongoose

Language: TypeScript

Validation: Zod

Authentication: JSON Web Tokens (JWT)

Hosting: The project is designed to be deployed on platforms like Vercel, Heroku, or Render.
Follow these steps to set up the project locally.

Prerequisites
Node.js (v14 or higher)

MongoDB (local or cloud instance like MongoDB Atlas)

npm or yarn

Installation
Clone the repository:

git clone https://github.com/Ruhul-07/L2B5-assignment-05-backend.git
cd Digital-Wallet-API

# Install dependencies
npm install
# or
yarn install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
DATABASE_URL=mongodb://localhost:27017/digital-wallet-api
JWT_SECRET=your_secret_jwt_key
```

> Replace `your_secret_jwt_key` with a strong, secure string.

---

## 🏃 Running the Project

### Development (with hot reloading)

```bash
npm run dev
```

### Production

```bash
npm run start
```

---

## 📄 API Endpoints

All routes are prefixed with `/api/v1`.

### 🔹 User Endpoints

| Method | Endpoint Description |
|--------|----------------------|
| GET | Add Money/ Deposit |
| GET | My Wallet |
| GET | Withdraw Money |
| GET | Send Money |

### 🔹 Auth Endpoints

| Method | Endpoint Description |
|--------|----------------------|
| GET | Create-Account/Registration |
| GET | login |

### 🔹 Agent Endpoints

| Method | Endpoint Description |
|--------|----------------------|
| GET | Cash-In |
| GET | Cash-out |

### 🔹 Admin Endpoints

| Method | Endpoint Description |
|--------|----------------------|
| GET | Get All User |
| GET | Block Wallets |
| GET | Unblock Wallets |
| GET | Get All Agent |
| GET | Approved Agent |
| GET | Suspend Agent |


## 📦 Postman Example

Example body for `/auth/register`:

```json
{
  "name": "Jane Doe",
  "phone": "01712345678",
  "pin": "1234"
}
```

You can import this into Postman to test the authentication flow.

---

## 🧑‍💻 Contributing

Contributions are welcome!  
Feel free to fork the repo, open an issue, or submit a pull request if you find bugs or have suggestions.

---

## 👤 Author

**Ruhul Amin**  
[GitHub Profile »](https://github.com/Ruhul-07)

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

---
