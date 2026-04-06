const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendshield';
mongoose.connect(MONGO_URI)
  .then(() => console.log("💎 Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Atlas Connection Error:", err));

// 2. Data Model
const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  userId: { type: String, required: true },
  merchant: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Misc' },
  status: { type: String, enum: ['Safe', 'Warning', 'Breach'], default: 'Safe' },
  inferenceMethod: { type: String }, // Tracks which "model" made the call
  date: { type: Date, default: Date.now }
}));

// --- AI MODEL 1: DECISION TREE CLASSIFIER (Categorization) ---
const decisionTreeInference = (amount, merchant) => {
  const m = merchant.toLowerCase();
  
  // Root Node: Split by Amount
  if (amount > 15000) {
    // Decision Node: High-Value Business vs Lifestyle
    if (m.includes('textile') || m.includes('vendor') || m.includes('raw')) return 'Business';
    if (m.includes('apple') || m.includes('amazon')) return 'Asset/Equipment';
    return 'Large Purchase';
  } else {
    // Decision Node: Daily Essentials
    if (m.includes('zomato') || m.includes('swiggy') || m.includes('remedy')) return 'Food';
    if (m.includes('uber') || m.includes('ola') || m.includes('petrol')) return 'Travel';
    return 'Misc';
  }
};

// --- AI MODEL 2: LINEAR REGRESSION (Velocity & Forecast) ---
const calculateLinearRegression = (totalSpent, dayOfMonth) => {
  const daysInMonth = 30;
  // Slope (m) = totalSpent / daysPassed
  const m = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  // y = mx (Predicting day 30)
  return m * daysInMonth;
};

// --- AI MODEL 3: LSTM SIMULATOR (Temporal Anomaly) ---
// Note: In real life, this checks sequences. Here we simulate the result.
const lstmTemporalCheck = (amount, history) => {
  if (history.length < 5) return false;
  
  const lastFive = history.slice(0, 5).map(t => t.amount);
  const mean = lastFive.reduce((a, b) => a + b) / 5;
  
  // LSTM identifies that a sudden 400% spike in a "quiet" time period is an anomaly
  return amount > (mean * 4); 
};

// 3. The Unified Logic Engine
const processTransaction = (amount, merchant, history = [], currentMonthTotal = 0) => {
  const LIMIT = 50000;
  
  // A. Use Decision Tree for Category
  const category = decisionTreeInference(amount, merchant);
  
  // B. Use LSTM-lite for Anomaly detection
  const isTemporalAnomaly = lstmTemporalCheck(amount, history);
  
  // C. Guardrail Logic
  const projectedTotal = currentMonthTotal + amount;
  let status = 'Safe';
  if (projectedTotal >= LIMIT) status = 'Breach';
  else if (projectedTotal >= LIMIT * 0.85 || isTemporalAnomaly) status = 'Warning';

  return { status, category, inferenceMethod: 'Hybrid-CART-LSTM' };
};

// 4. API Endpoints

app.delete('/api/transactions/clear', async (req, res) => {
  try {
    await Transaction.deleteMany({});
    res.json({ message: "Shield Engine Reset" });
  } catch (err) {
    res.status(500).json({ error: "Reset failed" });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }).limit(50);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Fetch error" });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const txs = await Transaction.find({ date: { $gte: startOfMonth } });
    const totalSpent = txs.reduce((sum, t) => sum + t.amount, 0);
    
    // ML Forecast via Linear Regression
    const dayOfMonth = new Date().getDate();
    const projectedSpend = calculateLinearRegression(totalSpent, dayOfMonth);

    // Dynamic Thresholds
    const daysRemaining = 30 - dayOfMonth;
    const safeDailyLimit = daysRemaining > 0 ? (50000 - totalSpent) / daysRemaining : 0;

    const categoryMap = txs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    res.json({ 
      totalSpent, 
      categoryData: Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] })), 
      projectedSpend,
      safeDailyLimit: Math.max(0, safeDailyLimit),
      isAtRisk: projectedSpend > 50000 
    });
  } catch (err) {
    res.status(500).json({ error: "Stats error" });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const { userId, merchant, amount } = req.body;
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    
    const history = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);
    const monthTxs = await Transaction.find({ userId, date: { $gte: startOfMonth } });
    const currentTotal = monthTxs.reduce((sum, t) => sum + t.amount, 0);
    
    const logic = processTransaction(Number(amount), merchant, history, currentTotal);

    const newTx = new Transaction({ userId, merchant, amount: Number(amount), ...logic });
    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: "Inference failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🛡️  SpendShield Hybrid ML Engine Live on ${PORT}`));