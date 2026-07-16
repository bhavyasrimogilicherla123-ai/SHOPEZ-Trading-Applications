# API Reference

All responses use either `{ "data": ... }` or `{ "error": { "message": "..." } }`. Protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health probe. |
| `POST` | `/api/auth/register` | Create a user and return an access token. |
| `POST` | `/api/auth/login` | Authenticate and return an access token. |
| `GET` | `/api/auth/me` | Return the current user. |
| `GET` | `/api/portfolio` | Return wallet balance and current positions. |
| `POST` | `/api/trades/orders` | Submit a simulated buy or sell order. |
| `GET` | `/api/transactions?page=1&limit=25` | Return descending transaction history. |

## Request examples

```json
POST /api/auth/register
{ "username": "trader", "email": "trader@example.com", "password": "at-least-8-characters" }
```

```json
POST /api/trades/orders
{ "side": "BUY", "symbol": "AAPL", "shares": 2, "price": 180.25 }
```

`symbol` must be one to ten uppercase letters or periods, `shares` must be a positive integer, and `price` must be a positive two-decimal amount. A sell is rejected when the requested quantity exceeds the held position; a buy is rejected when it exceeds available wallet balance.
