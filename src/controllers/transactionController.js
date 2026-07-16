const Transaction = require('../models/Transaction');
const asyncHandler = require('../utils/asyncHandler');

exports.listTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const [transactions, total] = await Promise.all([
    Transaction.find({ user: req.auth.sub }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments({ user: req.auth.sub }),
  ]);
  res.json({ data: transactions, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
});
