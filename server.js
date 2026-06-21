const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. DATABASE SCHEMA DESIGN (Models)
// ==========================================
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 10000 }, // Starts with $10,000 dummy cash
    portfolio: [{
        stockSymbol: String,
        shares: Number,
        avgPrice: Number
    }]
});

const TransactionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    stockSymbol: String,
    type: { type: String, enum: ['BUY', 'SELL'] },
    shares: Number,
    price: Number,
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// Middleware to verify Logged In Users via JWT Tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. Log in first!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Session expired. Please log in again.' });
        req.user = user;
        next();
    });
};

// ==========================================
// 2. AUTHENTICATION ROUTES (Register/Login)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Username or Email already exists!' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found!' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: 'Invalid password!' });

        const token = jwt.sign({ id: user._index, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, username: user.username, walletBalance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 3. TRADING LOGIC ROUTES (Buy/Sell/Portfolio)
// ==========================================

// Get user profile & wallet stats
app.get('/api/trading/portfolio', authenticateToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    res.json({ walletBalance: user.walletBalance, portfolio: user.portfolio });
});

// BUY STOCK ACTION
app.post('/api/trading/buy', authenticateToken, async (req, res) => {
    const { stockSymbol, shares, price } = req.body;
    const totalCost = shares * price;

    const user = await User.findOne({ email: req.user.email });
    if (user.walletBalance < totalCost) {
        return res.status(400).json({ error: 'Insufficient funds in your trading wallet!' });
    }

    // Deduct money
    user.walletBalance -= totalCost;

    // Add to stock portfolio list
    const stockIndex = user.portfolio.findIndex(item => item.stockSymbol === stockSymbol.toUpperCase());
    if (stockIndex > -1) {
        let currentStock = user.portfolio[stockIndex];
        let totalShares = currentStock.shares + shares;
        currentStock.avgPrice = ((currentStock.shares * currentStock.avgPrice) + totalCost) / totalShares;
        currentStock.shares = totalShares;
    } else {
        user.portfolio.push({ stockSymbol: stockSymbol.toUpperCase(), shares, avgPrice: price });
    }

    await user.save();

    // Log tracking invoice receipt
    const tx = new Transaction({ userId: user._id, stockSymbol, type: 'BUY', shares, price });
    await tx.save();

    res.json({ message: 'Stock purchased successfully!', walletBalance: user.walletBalance, portfolio: user.portfolio });
});

// SELL STOCK ACTION
app.post('/api/trading/sell', authenticateToken, async (req, res) => {
    const { stockSymbol, shares, price } = req.body;
    const user = await User.findOne({ email: req.user.email });

    const stockIndex = user.portfolio.findIndex(item => item.stockSymbol === stockSymbol.toUpperCase());
    if (stockIndex === -1 || user.portfolio[stockIndex].shares < shares) {
        return res.status(400).json({ error: 'You do not own enough shares to complete this sale!' });
    }

    // Add cash to wallet
    const totalEarnings = shares * price;
    user.walletBalance += totalEarnings;

    // Deduct stock item count
    user.portfolio[stockIndex].shares -= shares;
    if (user.portfolio[stockIndex].shares === 0) {
        user.portfolio.splice(stockIndex, 1); // Delete if 0 shares left
    }

    await user.save();

    const tx = new Transaction({ userId: user._id, stockSymbol, type: 'SELL', shares, price });
    await tx.save();

    res.json({ message: 'Stock sold successfully!', walletBalance: user.walletBalance, portfolio: user.portfolio });
});

// Get user purchase records history
app.get('/api/trading/history', authenticateToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const history = await Transaction.find({ userId: user._id }).sort({ date: -1 });
    res.json(history);
});

// ==========================================
// 4. MAIN SERVER STARTUP LINK
// ==========================================
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        app.listen(PORT, () => console.log(`SHOPEZ Backend monolithic server is actively running on port ${PORT}`));
    })
    .catch(err => console.error('Database server connection lost:', err.message));
