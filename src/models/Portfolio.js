const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true, trim: true },
  shares: { type: Number, required: true, min: 1 },
  averageCost: { type: Number, required: true, min: 0 },
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  positions: { type: [positionSchema], default: [] },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Portfolio', portfolioSchema);
