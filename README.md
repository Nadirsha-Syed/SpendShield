# SpendShield 🛡️
### Predictive Financial Guardrails for MSME Business Owners

**SpendShield** is a real-time behavioral AI engine designed to protect small business owners from liquidity crises. By analyzing spending velocity and transaction patterns, it provides automated "Safe Daily Limits" to ensure month-end financial stability.

---

## 🚀 The AI/ML Pipeline
Our system moves beyond simple budgeting by using a multi-staged inference engine:

1. **Linear Regression (Velocity Engine):** - **Purpose:** Month-end liquidity forecasting.
   - **Logic:** Calculates $y = mx$ where $m$ is the daily spending velocity to project total monthly liability.
   
2. **Decision Tree Classifier (Categorization):** - **Purpose:** Context-aware expense classification.
   - **Logic:** A CART-based (Classification and Regression Tree) structure that splits data by amount thresholds and merchant metadata to distinguish between 'Assets' and 'Expenses'.

3. **Temporal Sequence Analysis (LSTM-Inspired):** - **Purpose:** Behavioral Anomaly Detection.
   - **Logic:** Monitors the last $N$ transactions to detect sudden spikes in spending frequency that deviate from the historical mean.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Recharts (Inference Visualization)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Time-Series Data Storage)
- **ML Logic:** Custom Hybrid Inference Engine

---
