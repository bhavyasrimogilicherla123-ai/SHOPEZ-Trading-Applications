const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { positiveInteger, positivePrice, requiredString } = require('../utils/validation');

exports.placeOrder = asyncHandler(async (req, res) => {
  const side = String(req.body.side || '').toUpperCase();
  if (!['BUY', 'SELL'].includes(side)) throw new ApiError(400, 'side must be BUY or SELL.');
  const symbol = requiredString(req.body.symbol, 'symbol').toUpperCase();
  if (!/^[A-Z.]{1,10}$/.test(symbol)) throw new ApiError(400, 'symbol is invalid.');
  const shares = positiveInteger(req.body.shares, 'shares');
  const price = positivePrice(req.body.price);
  const total = Number((shares * price).toFixed(2));
  const user = await User.findById(req.auth.sub);
  if (!user) throw new ApiError(401, 'Account no longer exists.');
  let portfolio = await Portfolio.findOne({ user: user._id });
  if (!portfolio) portfolio = new Portfolio({ user: user._id, positions: [] });
  const position = portfolio.positions.find((item) => item.symbol === symbol);

  if (side === 'BUY') {
    if (user.walletBalance < total) throw new ApiError(400, 'Insufficient trading cash.');
    user.walletBalance = Number((user.walletBalance - total).toFixed(2));
    if (position) {
      const combinedShares = position.shares + shares;
      position.averageCost = Number((((position.shares * position.averageCost) + total) / combinedShares).toFixed(2));
      position.shares = combinedShares;
    } else portfolio.positions.push({ symbol, shares, averageCost: price });
  } else {
    if (!position || position.shares < shares) throw new ApiError(400, 'You do not hold enough shares to sell.');
    user.walletBalance = Number((user.walletBalance + total).toFixed(2));
    position.shares -= shares;
    if (position.shares === 0) portfolio.positions.splice(portfolio.positions.indexOf(position), 1);
  }

  await user.save();
  await portfolio.save();
  const transaction = await Transaction.create({ user: user._id, symbol, side, shares, price, total });
  res.status(201).json({ data: { transaction, walletBalance: user.walletBalance, positions: portfolio.positions } });
});
