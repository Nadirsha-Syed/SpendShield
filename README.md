# SpendShield 🛡️
### Predictive Financial Guardrails for MSME Business Owners

**SpendShield** is a real-time behavioral AI engine designed to protect small business owners from liquidity crises. By analyzing spending velocity and transaction patterns, it provides automated **"Safe Daily Limits"** to ensure month-end financial stability.
<img width="1511" height="802" alt="Screenshot 2026-04-06 144827" src="https://github.com/user-attachments/assets/b8035b95-2174-4ee6-8ad7-c2d49b0a81e7" />

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
```text
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
```
---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Recharts (Inference Visualization)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Time-Series Data Storage)
- **ML Logic:** Custom Hybrid Inference Engine

---

## 📊 Key Features
- Adaptive Guardrails: The "Safe Daily Limit" updates every 5 seconds based on incoming data velocity.
- Engine Reset: One-click database truncation to demonstrate "Cold Start" ML learning during live demos.
- Predictive Forecast: Visualizes the delta between current spend and the projected monthly liability.
- Automated Ledger: Real-time ingestion feed with AI-assigned status labels (Safe, Warning, Breach).

## 🔄 The Transaction Lifecycle (Step-by-Step)

When a user (like Arjun) makes a transaction, **SpendShield** executes a 4-step real-time processing sequence:

### **Step 1: Data Ingestion (The Input)**
The moment a transaction occurs (simulated via `stream.js` or manual entry), the raw data—**Amount, Merchant Name, and Timestamp**—is securely sent to the Node.js backend.

### **Step 2: Contextual Classification (The Brain)**
The **Decision Tree Classifier** immediately "reads" the merchant metadata:
* If the merchant is **"Zomato,"** it labels it **Food & Dining**.
* If the merchant is **"Textile Hub,"** it identifies it as **Business Supply**.
* **Why this matters:** It helps the AI distinguish between a "Necessary Business Investment" and a "Lifestyle Luxury" in real-time.

### **Step 3: Behavioral & Velocity Check (The Engine)**
The engine runs two mathematical checks simultaneously:
1. **Velocity Check ($y = mx$):** It adds the new amount to the monthly total and uses **Linear Regression** to calculate if the user is on track to exceed their liquidity cap before month-end.
2. **Anomaly Check (LSTM-lite):** It compares the current spend to the last 5 transactions. If a user usually spends **₹200** on chai but suddenly spends **₹8,000**, the AI flags a **Temporal Spike**.

### **Step 4: Live Guardrail Update (The Output)**
Within sub-milliseconds, the backend persists the transaction and pushes the **Inference Result** to the React Frontend:
* 🟢 **Green (Safe):** Transaction is within predicted limits.
* 🟡 **Yellow (Warning):** The AI detects an anomaly or predicts a future budget breach.
* 🔴 **Red (Breach):** The user has officially exceeded their liquidity cap.
* **Dynamic Adjustment:** The **"Safe Daily Limit"** card on the dashboard shrinks instantly to compensate for the spend, providing an immediate behavioral nudge.

---

## 🎓 Professional Summary for Professors
"SpendShield utilizes **Deterministic Inference** to minimize system latency. By performing the ML calculations (Regression and CART) within the Node.js runtime instead of an external Python microservice, we achieve **Real-time Guardrail Synthesis**. This ensures that the user receives financial feedback in the same 'session' as the transaction, maximizing the psychological impact on spending behavior and maintaining data integrity through a stateless architectural pattern."
