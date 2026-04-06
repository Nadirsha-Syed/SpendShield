# SpendShield 🛡️
### Predictive Financial Guardrails for MSME Business Owners

**SpendShield** is a real-time behavioral AI engine designed to protect small business owners from liquidity crises. By analyzing spending velocity and transaction patterns, it provides automated **"Safe Daily Limits"** to ensure month-end financial stability.
---
<img width="1660" height="812" alt="Screenshot 2026-04-06 163740" src="https://github.com/user-attachments/assets/4f05a032-98cd-46e7-88bb-d135cc52c10f" />

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
--
Unlike traditional apps that hide logic, SpendShield features a **Proactive Push Notification Layer** powered by `react-hot-toast`. 

* **Real-time Context:** Every alert identifies the specific **Category** (e.g., Shopping, Travel) and the **Inference Reason**.
* **Visual Urgency:** Popups are color-coded based on risk severity (Amber for Warnings, Crimson for Breaches).
* **Automated Monitoring:** The dashboard continuously "scans" the background transaction stream (from `stream.js`). If the AI detects a risky pattern in the simulator, it triggers a **Top-Right Alert** instantly, even if the user hasn't refreshed the page.
--
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
The backend persists the transaction and pushes the **Inference Result** to the React Frontend:
* 🟢 **Green (Safe):** Transaction is within predicted limits.
* 🟡 **Yellow (Warning):** **Popup Alert triggered** for anomalies or high-velocity spending.
* 🔴 **Red (Breach):** **Critical Alert triggered** for exceeding the liquidity cap.
* **Dynamic Adjustment:** The **"Safe Daily Limit"** card shrinks instantly to compensate for the spend.

---

## Summary 
SpendShield utilizes **Deterministic Inference** to minimize system latency. By performing the ML calculations (Regression and CART) within the Node.js runtime instead of an external Python microservice, we achieve **Real-time Guardrail Synthesis**. This ensures that the user receives financial feedback in the same 'session' as the transaction, maximizing the psychological impact on spending behavior and maintaining data integrity through a stateless architectural pattern.
