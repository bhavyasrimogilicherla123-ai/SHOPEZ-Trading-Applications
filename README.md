# SHOPEZ Trading Hub

SHOPEZ Trading Hub is a full-stack MERN-based stock trading simulation web application where users can register, log in, buy and sell stocks, manage their investment portfolio, and track their trading history. The application provides a secure authentication system, portfolio management, and transaction tracking through an intuitive user interface.

---

# Project Description

SHOPEZ Trading Hub provides an end-to-end stock trading simulation experience. Users can securely register and log in, execute buy and sell operations on available stocks, monitor their available trading cash, maintain a portfolio of owned assets, and view a complete trade ledger. The backend is developed using Node.js and Express.js with MongoDB for persistent data storage, while the frontend is built using HTML, CSS, JavaScript, and Tailwind CSS.

---

# Features

- User Registration and Login
- Secure Authentication
- Buy Stocks
- Sell Stocks
- Portfolio Management
- Trading Cash Balance
- Trade Ledger / Transaction History
- MongoDB Database Integration
- Responsive User Interface
- Real-Time Portfolio Updates

---

# Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose)

---

# Project Architecture

```
Frontend (HTML + Tailwind CSS)
            │
            ▼
Node.js + Express.js Server
            │
            ▼
MongoDB Database
```

---

# Folder Structure

```
SHOPEZ-Trading-Hub/

│── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
│── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Installation

Clone the repository


```

Go into the project directory

```bash
cd SHOPEZ-Trading-Hub
```

Install backend dependencies

```bash
npm install
```

Configure MongoDB connection inside the `.env` file.

Example

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Start the backend

```bash
npm start
```

Open the frontend

```
index.html
```

or use Live Server.

---

# API Endpoints

## Authentication

- POST /api/auth/register
- POST /api/auth/login

## Trading

- GET /api/stocks
- POST /api/trade/buy
- POST /api/trade/sell

## Portfolio

- GET /api/portfolio

## Ledger

- GET /api/ledger

---

# Screenshots

### Login Page

- User Login Interface

### Dashboard

- Trading Cash
- Market Order
- Portfolio Holdings
- Trade Ledger

---

# Future Enhancements

- Live Stock Market API
- Real-Time Stock Prices
- Portfolio Analytics
- Watchlist
- Interactive Charts
- Notifications
- Admin Dashboard
- Mobile Responsive Improvements

---




