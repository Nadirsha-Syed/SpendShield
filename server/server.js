const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendshield';
mongoose.connect(MONGO_URI)
  .then(() => console.log("💎 Engine Connected: Time-Series Cluster Active"))
  .catch(err => console.error("❌ Connection Error:", err));

// Schema with TTL or Indexes for performance
const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  merchant: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Misc' },
  status: { type: String, enum: ['Safe', 'Warning', 'Breach'], default: 'Safe' },
  reason: { type: String, default: 'Inference Complete' },
  date: { type: Date, default: Date.now, index: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// AI Logic Models
const decisionTreeInference = (amount, merchant) => {
  const m = merchant.toLowerCase();
  const branches = {
    'Food & Dining': ['zomato', 'swiggy', 'starbucks', 'kfc', 'mcdonald', 'restaurant'],
    'Travel': ['uber', 'ola', 'petrol', 'fuel', 'irctc'],
    'Business Supply': ['textile', 'vendor', 'inventory', 'wholesale', 'fabrics'],
    'Shopping': ['amazon', 'flipkart', 'blinkit', 'zepto', 'myntra'],
    'Utilities': ['reliance', 'power', 'electricity', 'bill']
  };
  for (const [branch, keywords] of Object.entries(branches)) {
    if (keywords.some(k => m.includes(k))) return branch;
  }
  return amount > 15000 ? 'Capital Investment' : 'Misc';
};

const calculateLinearRegression = (totalSpent) => {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const velocity = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  return velocity * daysInMonth;
};

const lstmTemporalCheck = (amount, history) => {
  if (history.length < 3) return false;
  const rollingMean = history.slice(0, 3).reduce((sum, t) => sum + t.amount, 0) / 3;
  return amount > (rollingMean * 4);
};

const processTransaction = (amount, merchant, history, currentMonthTotal) => {
  const LIMIT = 50000;
  const category = decisionTreeInference(amount, merchant);
  const isAnomaly = lstmTemporalCheck(amount, history);
  const projectedTotal = currentMonthTotal + amount;
  
  let status = 'Safe';
  let reason = `Verified: ${category} within limits.`;

  if (projectedTotal >= LIMIT) {
    status = 'Breach';
    reason = `BREACH: Monthly limit of ₹${LIMIT} exceeded.`;
  } else if (isAnomaly) {
    status = 'Warning';
    reason = `ANOMALY: High-deviation spike detected in ${category}.`;
  } else if (projectedTotal >= LIMIT * 0.85) {
    status = 'Warning';
    reason = `WARNING: 85% Budget threshold reached.`;
  }
  return { status, category, reason };
};

// Endpoints
app.delete('/api/transactions/clear', async (req, res) => {
  await Transaction.deleteMany({});
  res.json({ message: "Engine Reset" });
});

app.get('/api/transactions', async (req, res) => {
  const txs = await Transaction.find().sort({ date: -1 }).limit(50).lean();
  res.json(txs);
});

app.get('/api/stats', async (req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);

  const txs = await Transaction.find({ date: { $gte: startOfMonth } }).lean();
  const totalSpent = txs.reduce((sum, t) => sum + t.amount, 0);
  const projectedSpend = calculateLinearRegression(totalSpent);
  
  const categoryMap = txs.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  res.json({ 
    totalSpent, 
    categoryData: Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] })), 
    projectedSpend,
    isAtRisk: projectedSpend > 50000,
    safeDailyLimit: Math.max(0, (50000 - totalSpent) / (30 - new Date().getDate()))
  });
});

app.post('/api/transactions', async (req, res) => {
  const { userId, merchant, amount } = req.body;
  const [history, monthTxs] = await Promise.all([
      Transaction.find({ userId }).sort({ date: -1 }).limit(5).lean(),
      Transaction.find({ userId, date: { $gte: new Date(new Date().setDate(1)) } }).lean()
  ]);
  const inference = processTransaction(Number(amount), merchant, history, monthTxs.reduce((s,t)=>s+t.amount,0));
  const newTx = new Transaction({ userId, merchant, amount: Number(amount), ...inference });
  await newTx.save();
  res.status(201).json(newTx);
});

app.listen(5000, () => console.log(`🛡️  SpendShield Active`));