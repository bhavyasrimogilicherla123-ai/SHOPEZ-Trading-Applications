# Architecture and File Guide

## Request flow

Browser requests enter `src/app.js`, match in `src/routes`, are authenticated by `src/middleware/authenticate.js` where required, processed by a controller, and persisted through Mongoose models. `asyncHandler.js` forwards rejected controller promises to the common `errorHandler.js` response format.

## File responsibilities

| File | Responsibility |
| --- | --- |
| `server.js` | Starts the process only after MongoDB connects. |
| `src/app.js` | Configures CORS, JSON limits, static files, API routes, and error middleware. |
| `src/config/env.js` | Loads and validates environment variables. |
| `src/config/database.js` | Connects Mongoose and enables strict query filtering. |
| `src/models/User.js` | Stores identity, bcrypt hash, and simulated cash balance. |
| `src/models/Portfolio.js` | Stores one user's positions and average cost basis. |
| `src/models/Transaction.js` | Stores immutable buy and sell ledger records. |
| `src/controllers/authController.js` | Registers users, verifies passwords, issues JWTs, and exposes profile data. |
| `src/controllers/tradeController.js` | Validates and atomically executes orders. |
| `src/controllers/portfolioController.js` | Reads wallet and positions. |
| `src/controllers/transactionController.js` | Pages the transaction ledger. |
| `src/routes/*.js` | Keeps endpoint declarations separate from business logic. |
| `src/middleware/authenticate.js` | Verifies Bearer JWTs and exposes claims as `req.auth`. |
| `src/middleware/notFound.js` | Returns a consistent error for unknown routes. |
| `src/middleware/errorHandler.js` | Converts known and unexpected errors into JSON responses. |
| `src/utils/ApiError.js` | Defines intentional HTTP errors. |
| `src/utils/asyncHandler.js` | Eliminates repetitive async wrappers. |
| `src/utils/validation.js` | Centralizes request-value validation. |
| `frontend/index.html` | Defines authentication and trading workspace. |
| `frontend/assets/css/app.css` | Defines responsive presentation. |
| `frontend/assets/js/api.js` | Sends JSON requests and attaches stored access tokens. |
| `frontend/assets/js/app.js` | Manages client state, forms, rendering, and sign out. |

## Consistency guarantee

`tradeController.js` runs user balance, portfolio, and ledger writes in one MongoDB transaction. Either all three changes commit or none do. MongoDB transactions require a replica set, including MongoDB Atlas clusters.
