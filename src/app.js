const express = require('express');
const cors = require('cors');
const path = require('path');
const { env } = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: env.clientOrigin, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
