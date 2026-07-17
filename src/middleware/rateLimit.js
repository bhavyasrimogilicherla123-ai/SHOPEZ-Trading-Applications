const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');

const visitors = new Map();

function prune(now) {
  for (const [key, entry] of visitors) {
    if (entry.resetAt <= now) visitors.delete(key);
  }
}

module.exports = (req, _res, next) => {
  const now = Date.now();
  if (visitors.size > 5000) prune(now);
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const entry = visitors.get(key);
  if (!entry || entry.resetAt <= now) {
    visitors.set(key, { count: 1, resetAt: now + env.rateLimitWindowMs });
    return next();
  }
  entry.count += 1;
  if (entry.count > env.rateLimitMax) return next(new ApiError(429, 'Too many requests. Please try again later.'));
  return next();
};
