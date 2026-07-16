module.exports = (error, req, res, _next) => {
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  const isOrderRequest = req.method === 'POST' && req.originalUrl === '/api/trades/orders';
  if (isOrderRequest) {
    console.error(error.stack || error);
  }
  if (statusCode >= 500 && !isOrderRequest) console.error(error);
  res.status(statusCode).json({ error: { message: error.message || 'An unexpected error occurred.', ...(error.details ? { details: error.details } : {}) } });
};
