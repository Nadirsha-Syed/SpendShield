# SpendShield 🛡️
### Predictive Financial Guardrails for MSME Business Owners

**SpendShield** is a real-time behavioral AI engine designed to protect small business owners from liquidity crises. By analyzing spending velocity and transaction patterns, it provides automated **"Safe Daily Limits"** to ensure month-end financial stability.

---

## 🚀 The AI/ML Pipeline
Our system moves beyond simple budgeting by using a multi-staged hybrid inference engine:

1. **Linear Regression (Velocity Engine):**
   - **Purpose:** Month-end liquidity forecasting.
   - **Logic:** Implements the $y = mx$ theorem where $m$ represents the daily spending velocity. It projects the total monthly liability based on real-time "burn rates."
   

2. **Decision Tree Classifier (Categorization):**
   - **Purpose:** Context-aware expense classification.
   - **Logic:** A CART-based (Classification and Regression Tree) structure. It utilizes a hierarchical decision path (Root -> Decision Nodes -> Leaves) to distinguish between 'Business Assets', 'Utilities', and 'Lifestyle Expenses' based on amount thresholds and merchant metadata.
   

3. **Temporal Sequence Analysis (LSTM-Inspired):**
   - **Purpose:** Behavioral Anomaly Detection.
   - **Logic:** Monitors the last $N$ transactions to detect "Temporal Spikes." It flags deviations that exceed 350% of the rolling historical mean, mimicking the pattern recognition of Long Short-Term Memory (LSTM) networks to identify non-linear spending shocks.

---

## 📂 File Architecture
''' text 
spendshield/
├── client/                # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/    # UI Components (StatCard, Chart, HistoryTable)
│   │   ├── App.jsx        # Dashboard Logic & Live Sync Engine
│   │   └── main.jsx
│   └── tailwind.config.js # Design System Tokens
├── server/                # Node.js Backend & ML Engine
│   ├── server.js          # Hybrid ML Inference API & MongoDB Logic
│   ├── stream.js          # Real-time Transaction Ingestion Simulator
│   └── .env               # Configuration (Mongo URI & Ports)
├── README.md              # Project Documentation
└── package.json           # Global dependencies
'''
---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Recharts (Inference Visualization)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Time-Series Data Storage)
- **ML Logic:** Custom Hybrid Inference Engine

---

📊 Key Features
Adaptive Guardrails: The "Safe Daily Limit" updates every 5 seconds based on incoming data velocity.
Engine Reset: One-click database truncation to demonstrate "Cold Start" ML learning during live demos.
Predictive Forecast: Visualizes the delta between current spend and the projected monthly liability.
Automated Ledger: Real-time ingestion feed with AI-assigned status labels (Safe, Warning, Breach).
