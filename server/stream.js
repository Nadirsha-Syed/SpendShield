const axios = require('axios');

const merchants = [
  'Zomato', 'Uber', 'Amazon', 'Textile Vendor', 'Reliance Power', 
  'Petrol Pump', 'Starbucks', 'Raw Material Depot', 'Blinkit'
];

const startLiveStream = () => {
  console.log("🚀 SPENDSHIELD LIVE STREAMER ACTIVE...");
  
  // Sends a new transaction every 7 seconds
  setInterval(async () => {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const amount = Math.floor(Math.random() * 4500) + 100; // Random spend 100-4600

    try {
      await axios.post('http://localhost:5000/api/transactions', {
        userId: 'arjun_surat',
        merchant: merchant,
        amount: amount
      });
      console.log(`📡 Ingested: ${merchant} | ₹${amount}`);
    } catch (e) {
      console.log("❌ Stream Connection Lost");
    }
  }, 7000); 
};

startLiveStream();