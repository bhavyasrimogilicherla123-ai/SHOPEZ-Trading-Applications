const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  side: { type: String, required: true, enum: ['BUY', 'SELL'] },
  shares: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
}, { timestamps: true, versionKey: false });

transactionSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.model('Transaction', transactionSchema);
