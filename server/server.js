const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendshield';
mongoose.connect(MONGO_URI)
  .then(() => console.log("💎 Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Atlas Connection Error:", err));

// 2. The Data Model
const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  merchant: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Misc' },
  status: { type: String, enum: ['Safe', 'Warning', 'Breach'], default: 'Safe' },
  isAnomalous: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// 3. The Logic Engine (Refined for Hackathon Impact)
const processTransaction = (amount, merchant, limit = 50000, currentTotal = 0) => {
  let status = 'Safe';
  let isAnomalous = false;
  let category = 'Misc';

  // A. Intelligent Categorization
  const m = merchant.toLowerCase();
  const mapping = {
    food: ['zomato', 'swiggy', 'restaurant', 'mcdonalds', 'kfc', 'starbucks'],
    travel: ['uber', 'ola', 'metro', 'petrol', 'fuel', 'irctc'],
    shopping: ['amazon', 'flipkart', 'myntra', 'blinkit', 'zepto'],
    utility: ['recharge', 'electricity', 'water', 'bill'],
    business: ['textile', 'raw material', 'inventory', 'shipping']
  };

  for (const [cat, keywords] of Object.entries(mapping)) {
    if (keywords.some(k => m.includes(k))) {
      category = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }

  // B. Real-time Guardrail Logic
  const newTotal = currentTotal + amount;
  if (newTotal >= limit) status = 'Breach';
  else if (newTotal >= limit * 0.85) status = 'Warning';

  // C. Behavior-Aware Anomaly Detection
  // Flagging unusually high transactions for a typical user like Arjun
  if (amount > 15000 || (category === 'Food' && amount > 3000)) {
    isAnomalous = true;
  }

  return { status, isAnomalous, category };
};

// 4. API Endpoints

// GET: All Transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// GET: Dashboard Stats (New - Performance Optimized)
app.get('/api/stats', async (req, res) => {
  try {
    const txs = await Transaction.find();
    const totalSpent = txs.reduce((sum, t) => sum + t.amount, 0);
    const breachCount = txs.filter(t => t.status === 'Breach').length;
    
    // Group by category for charts
    const categoryData = txs.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    res.json({ totalSpent, breachCount, categoryData });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// POST: Process New Transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { userId, merchant, amount } = req.body;
    
    // Fetch user history to calculate guardrails
    const history = await Transaction.find({ userId });
    const currentTotal = history.reduce((sum, t) => sum + t.amount, 0);

    // Process through Engine
    const logic = processTransaction(amount, merchant, 50000, currentTotal);

    const newTx = new Transaction({ 
      userId, 
      merchant, 
      amount, 
      ...logic 
    });

    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: "Invalid transaction data" });
  }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🛡️  SpendShield Backend Live
  📍  Port: ${PORT}
  🔗  CORS: Enabled
  `);
});