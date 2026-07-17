const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const market = require('../services/marketService');

exports.listStocks = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  res.json({ data: market.list(search) });
});

exports.getStock = asyncHandler(async (req, res) => {
  const symbol = String(req.params.symbol || '').trim().toUpperCase();
  const stock = market.get(symbol);
  if (!stock) throw new ApiError(404, 'Stock was not found in the SHOPEZ simulated market.');
  res.json({ data: { ...stock, history: market.historyFor(stock) } });
});
