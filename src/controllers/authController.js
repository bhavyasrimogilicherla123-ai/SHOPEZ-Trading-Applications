const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { requiredString } = require('../utils/validation');
const { env } = require('../config/env');

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

exports.register = asyncHandler(async (req, res) => {
  const username = requiredString(req.body.username, 'username', { minLength: 3 });
  const email = requiredString(req.body.email, 'email').toLowerCase();
  const password = requiredString(req.body.password, 'password', { minLength: 8 });
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new ApiError(400, 'email is invalid.');
  const exists = await User.exists({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, 'An account with that email or username already exists.');
  const user = await User.create({ username, email, password: await bcrypt.hash(password, 12) });
  await Portfolio.create({ user: user._id });
  res.status(201).json({ data: { token: createToken(user), user: { id: user.id, username, email, walletBalance: user.walletBalance } } });
});

exports.login = asyncHandler(async (req, res) => {
  const email = requiredString(req.body.email, 'email').toLowerCase();
  const password = requiredString(req.body.password, 'password');
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) throw new ApiError(401, 'Email or password is incorrect.');
  res.json({ data: { token: createToken(user), user: { id: user.id, username: user.username, email: user.email, walletBalance: user.walletBalance } } });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.sub);
  if (!user) throw new ApiError(401, 'Account no longer exists.');
  res.json({ data: { id: user.id, username: user.username, email: user.email, walletBalance: user.walletBalance } });
});
