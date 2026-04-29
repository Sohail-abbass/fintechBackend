# 💰 Fintech Behavior & Risk Intelligence Platform

A full-stack fintech system that analyzes user financial behavior, evaluates risk, predicts cash flow, and makes intelligent loan decisions using real-world financial logic and AI-powered insights.

---

## 🚀 Features

* 📊 **Behavior Analysis Engine**

  * Tracks income vs spending patterns
  * Calculates behavior score (0–100)
  * Detects top spending category

* ⚠️ **Risk Scoring Engine**

  * Classifies users into Low / Medium / High risk
  * Based on behavior, assets, and financial stability

* 📈 **Cash Flow Prediction**

  * Calculates burn rate
  * Predicts how long savings will last
  * Provides financial stability status

* 🧠 **AI Smart Insights**

  * Generates personalized financial advice
  * Uses LLM (OpenRouter / GPT)
  * Returns structured insights (warning, advice, insight)

* 🏦 **Loan Decision Engine**

  * Approve / Reject / Conditional approval
  * Based on income, assets, behavior, and risk
  * Provides reasoning + approved amount

---

## 🧱 Tech Stack

### Frontend

* Next.js (App Router)
* React
* Styled-components
* Axios

### Backend

* NestJS
* TypeScript
* JWT Authentication

### Database

* PostgreSQL (Docker)

### AI Integration

* OpenRouter (GPT-based models)

---

## 📂 Project Structure

```
backend/
  modules/
    auth/
    users/
    transactions/
    assets/
    scoring/      ← core logic (behavior, risk, prediction, loan)
    analytics/    ← API aggregator

frontend/
  app/
    dashboard/
      behavior/
      risk/
      cashflow/
      insights/
      loan/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd fintech-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin
DB_DATABASE=fintech

JWT_SECRET=your_secret

OPENROUTER_API_KEY=your_api_key
```

---

### 3️⃣ Run PostgreSQL (Docker)

```bash
docker run --name fintech-db -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres
```

---

### 4️⃣ Start Backend

```bash
npm run start:dev
```

---

### 5️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### 📥 Input APIs

| Endpoint        | Method |
| --------------- | ------ |
| `/profile`      | POST   |
| `/transactions` | POST   |
| `/assets`       | POST   |

---

### 📊 Analytics APIs

| Endpoint              | Method |
| --------------------- | ------ |
| `/analytics/overview` | GET    |
| `/analytics/behavior` | GET    |
| `/analytics/risk`     | GET    |
| `/analytics/cashflow` | GET    |
| `/analytics/insights` | GET    |

---

### 🧠 Decision API

| Endpoint                 | Method |
| ------------------------ | ------ |
| `/scoring/loan-decision` | POST   |

---

## 🧠 System Flow

```
User Input → DB
        ↓
Behavior Engine
        ↓
Risk + Prediction
        ↓
AI Insights
        ↓
Loan Decision
```

---

## ⚠️ Common Issues & Fixes

### ❌ ENOSPC: no space left on device

**Cause:** Disk full (Docker / logs)

**Fix:**

```bash
docker system prune -a
docker volume prune
```

---

### ❌ Styled-components "active" prop warning

**Cause:** Passing custom prop to DOM

**Fix:**

```tsx
$active instead of active
```

---

### ❌ Hydration mismatch (Next.js)

**Fix:**

```js
compiler: {
  styledComponents: true
}
```

---

### ❌ 404 API errors

**Check:**

* Module imported in `AppModule`
* Controller registered
* Server restarted

---

## 📌 Future Improvements

* Machine Learning credit scoring
* Fraud detection
* EMI calculator
* Credit history integration
* Real bank API integration

---

## 👨‍💻 Author

Muhammad Sohail
Frontend Developer → Full Stack Fintech Engineer 🚀

---

## ⭐ Why This Project Matters

This is not a basic CRUD app —
it simulates **real-world financial decision-making systems** used by banks and fintech platforms.

---
