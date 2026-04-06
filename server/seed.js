const mongoose = require('mongoose');
require('dotenv').config();

// Import the Transaction model 
// (If you haven't moved it to a separate file, just define the schema here)
const TransactionSchema = new mongoose.Schema({
  userId: String,
  merchant: String,
  amount: Number,
  category: String,
  status: String,
  isAnomalous: Boolean,
  date: Date
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

const seedData = [
  { 
    userId: 'arjun_surat', 
    merchant: 'Surat Textile Hub', 
    amount: 18000, 
    category: 'Business', 
    status: 'Safe', 
    isAnomalous: false,
    date: new Date(Date.now() - 86400000 * 5) 
  },
  { 
    userId: 'arjun_surat', 
    merchant: 'Zomato Lunch', 
    amount: 1200, 
    category: 'Food', 
    status: 'Safe', 
    isAnomalous: false,
    date: new Date(Date.now() - 86400000 * 3) 
  },
  { 
    userId: 'arjun_surat', 
    merchant: 'Reliance Petrol Pump', 
    amount: 4500, 
    category: 'Travel', 
    status: 'Safe', 
    isAnomalous: false,
    date: new Date(Date.now() - 86400000 * 2) 
  },
  { 
    userId: 'arjun_surat', 
    merchant: 'Blinkit Grocery', 
    amount: 2800, 
    category: 'Shopping', 
    status: 'Warning', 
    isAnomalous: false,
    date: new Date(Date.now() - 86400000) 
  },
  { 
    userId: 'arjun_surat', 
    merchant: 'Luxury Watch Store', 
    amount: 22000, 
    category: 'Shopping', 
    status: 'Breach', 
    isAnomalous: true,
    date: new Date() 
  }
];

const seedDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendshield';
    await mongoose.connect(MONGO_URI);
    
    // Clear existing data to avoid duplicates
    await Transaction.deleteMany({});
    
    await Transaction.insertMany(seedData);
    
    console.log(`
    🔥 DATA SEED SUCCESSFUL
    -----------------------
    Account: Arjun (Surat)
    Transactions: ${seedData.length}
    Database: MongoDB Atlas
    -----------------------
    Run 'npm run dev' to start the dashboard!
    `);
    
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDB();