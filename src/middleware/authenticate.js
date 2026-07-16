const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new ApiError(401, 'Authentication is required.'));
  try {
    req.auth = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (_error) {
    return next(new ApiError(401, 'Your session is invalid or has expired.'));
  }
};
