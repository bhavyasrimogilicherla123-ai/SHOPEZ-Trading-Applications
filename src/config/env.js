const dotenv = require('dotenv');

dotenv.config();

const required = ['MONGO_URI', 'JWT_SECRET'];
for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`${name} is required. Add it to .env before starting the server.`);
  }
}

module.exports.env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  // Keep both loopback forms available even when CLIENT_ORIGIN sets an
  // additional origin. Browsers treat localhost and 127.0.0.1 as different.
  clientOrigins: [...new Set([
    '**',
    '**',
    ...(process.env.CLIENT_ORIGIN || '').split(','),
  ].map((origin) => origin.trim()).filter(Boolean))],
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 200,
};
