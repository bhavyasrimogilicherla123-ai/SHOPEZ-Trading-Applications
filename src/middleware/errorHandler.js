module.exports = (error, req, res, _next) => {
  const duplicateKey = error && error.code === 11000;
  const statusCode = error.statusCode || (duplicateKey || error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
  const message = duplicateKey ? 'A record with those details already exists.' : error.message || 'An unexpected error occurred.';
  if (statusCode >= 500) console.error(`[${req.requestId || 'unknown'}]`, error.stack || error);
  res.status(statusCode).json({ error: { message, ...(error.details ? { details: error.details } : {}), requestId: req.requestId } });
};
