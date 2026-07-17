const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3, maxlength: 40, unique: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false },
  walletBalance: { type: Number, default: 10000, min: 0 },
}, { timestamps: true, versionKey: false });


module.exports = mongoose.model('User', userSchema);
