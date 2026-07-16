# SHOPEZ Trading Hub

SHOPEZ is a MERN-style stock trading simulator. It provides JWT authentication, a simulated cash wallet, buy and sell orders, persistent positions, and a paginated trade ledger. The client is dependency-free static HTML/CSS/JavaScript served by Express.

## Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and a long `JWT_SECRET`.
2. Use MongoDB Atlas or a MongoDB replica set. Trade execution uses database transactions and will not run against a standalone MongoDB server.
3. Install dependencies with `npm install`.
4. Start the app with `npm start` or `npm run dev`.
5. Visit `http://localhost:5000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the production server. |
| `npm run dev` | Start Node watch-mode development server. |
| `npm run check` | Parse-check application entry points. |

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | HTTP port; defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB replica-set or Atlas connection string. |
| `JWT_SECRET` | Yes | Long, random secret used to sign access tokens. |
| `JWT_EXPIRES_IN` | No | JWT lifetime; default `2h`. |
| `CLIENT_ORIGIN` | No | Browser origin permitted by CORS. |

## Project structure

```text
frontend/                 Static browser client served by Express
  index.html              Dashboard and authentication markup
  assets/css/app.css      Responsive dashboard styling
  assets/js/api.js        Authenticated fetch wrapper
  assets/js/app.js        Authentication, order and rendering behavior
src/                      Express API source
  config/                 Environment validation and MongoDB connection
  controllers/            HTTP request orchestration
  middleware/             JWT, 404, and centralized error handling
  models/                 Mongoose schemas
  routes/                 API endpoint definitions
  utils/                  Error, async, and validation helpers
server.js                 Process startup and database connection
.env.example              Safe environment variable template
docs/                     API and architecture documentation
```

See [API documentation](docs/API.md) and [architecture notes](docs/ARCHITECTURE.md) for contracts, data design, and a file-by-file guide.

## Notes

- This application is a simulation. The client submits an execution price and no market-data provider is used.
- Passwords are bcrypt-hashed; password data is excluded from normal database queries.
- Never commit `.env`. Rotate `JWT_SECRET` if it is exposed.
