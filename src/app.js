const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { env } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const marketRoutes = require('./routes/marketRoutes');
const requestContext = require('./middleware/requestContext');
const rateLimit = require('./middleware/rateLimit');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');
app.use(requestContext);
app.use(cors({
  // Requests without an Origin header include health checks and command-line clients.
  origin(origin, callback) {
    if (env.nodeEnv !== 'production') {
      return callback(null, true);
    }
    if (!origin) {
      return callback(null, true);
    }
    const localDevelopmentOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (localDevelopmentOrigin || env.clientOrigins.includes(origin) || origin === 'null') {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '20kb' }));
app.use('/api', rateLimit);
app.get('/api/health', (_req, res) => res.json({
  data: {
    status: mongoose.connection.readyState === 1 ? 'ok' : 'degraded',
    environment: env.nodeEnv,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  },
}));
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/market', marketRoutes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
