module.exports = (error, _req, res, _next) => {
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({ error: { message: error.message || 'An unexpected error occurred.', ...(error.details ? { details: error.details } : {}) } });
};
