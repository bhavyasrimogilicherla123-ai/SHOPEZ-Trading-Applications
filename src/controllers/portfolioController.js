const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.getPortfolio = asyncHandler(async (req, res) => {
  const [user, portfolio] = await Promise.all([User.findById(req.auth.sub), Portfolio.findOne({ user: req.auth.sub })]);
  if (!user) throw new ApiError(401, 'Account no longer exists.');
  res.json({ data: { walletBalance: user.walletBalance, positions: portfolio ? portfolio.positions : [] } });
});
