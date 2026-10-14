# Personal Finance Tracker (MERN Academic Project)

A clean, responsive, and student-developed personal finance web application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). 

Designed specifically for academic evaluation, faculty review, and student learning:
- **Design**: Clean white background with calm light blue accents (`#0284c7`, `#e0f2fe`).
- **Currency**: Indian Rupees (`₹` / INR) with realistic student expense categories.
- **Architecture**: Decoupled REST API backend and single-page React frontend.
- **Database**: Real MongoDB storage using Mongoose schemas, with an automatic in-memory fallback for zero-configuration testing.

---

## 📁 Project Structure

```text
personal-finance-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection logic (Mongoose + Auto fallback)
│   ├── models/
│   │   ├── Transaction.js        # Mongoose Schema for Transactions
│   │   └── Budget.js             # Mongoose Schema for Monthly Budgets
│   ├── routes/
│   │   ├── transactionRoutes.js  # Endpoints for summary stats, CRUD & sample data
│   │   └── budgetRoutes.js       # Endpoints for monthly budget calculation
│   ├── .env                      # Environment variables
│   ├── .env.example              # Example environment template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header with tabs
│   │   │   ├── SummaryCard.jsx   # Metric cards (Income, Expenses, Balance, Budget)
│   │   │   ├── TransactionTable.jsx # Clean data table with formatted INR currency
│   │   │   └── IncomeExpenseChart.jsx # Recharts bar chart for monthly comparison
│   │   ├── pages/
│   │   │   └── Dashboard.jsx     # Main financial dashboard view
│   │   ├── services/
│   │   │   └── api.js            # Centralized API fetch helper
│   │   ├── App.jsx               # Application shell and tab router
│   │   ├── App.css               # Clean academic CSS styling
│   │   ├── index.css             # Theme variables and base styles
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── vite.config.js            # Vite configuration with backend API proxy
│   └── package.json              # Frontend dependencies
│
└── README.md                     # Project documentation & viva guide
```

---

## 🚀 How to Run the Project

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 1. Running the Backend (Port 5000)
Open a terminal in the `backend` folder:
```bash
cd backend
npm install
npm start
```
- Server URL: `http://localhost:5000`
- Health Check: `http://localhost:5000/api/health`
- Summary API: `http://localhost:5000/api/transactions/summary`

> **Note on MongoDB**: If you have a local MongoDB daemon or MongoDB Atlas URL, set `MONGODB_URI` in `backend/.env`. If MongoDB is not installed locally, the backend automatically boots an in-memory MongoDB instance so you can demo the application instantly.

### 2. Running the Frontend (Port 5173)
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173` in your web browser.

---

## 🎓 Faculty Review & Viva Q&A Guide

When presenting this project to your college faculty or viva examiner, use the following explanations:

### Q1: How does the Frontend talk to the Backend?
> *"The React frontend uses the browser's native `fetch` API inside [src/services/api.js](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/frontend/src/services/api.js). Requests to `/api/transactions/summary` are routed through Vite's development proxy (`vite.config.js`) to `http://localhost:5000`. The Express backend handles the request, queries MongoDB via Mongoose, and responds with a JSON payload."*

### Q2: How are the totals (Income, Expense, Balance) calculated?
> *"They are not hardcoded or calculated on the frontend. The backend runs a MongoDB aggregation pipeline in [backend/routes/transactionRoutes.js](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/backend/routes/transactionRoutes.js) using `$group` and `$sum` on the `amount` field separated by transaction `type` ('income' vs 'expense'). Net balance is calculated directly as `totalIncome - totalExpenses`."*

### Q3: What is the purpose of Mongoose?
> *"Mongoose is an Object Data Modeling (ODM) library for MongoDB. It enforces strict schemas and data validation in [backend/models/Transaction.js](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/backend/models/Transaction.js), ensuring amounts are positive numbers, categories match predefined college student categories, and types are constrained to 'income' or 'expense'."*

### Q4: Which files should I study first?
1. [backend/server.js](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/backend/server.js) — The Express server initialization and middleware configuration.
2. [backend/models/Transaction.js](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/backend/models/Transaction.js) — The Mongoose schema defining financial records.
3. [backend/routes/transactionRoutes.js](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/backend/routes/transactionRoutes.js) — Aggregation logic and summary statistics calculation.
4. [frontend/src/pages/Dashboard.jsx](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/frontend/src/pages/Dashboard.jsx) — React state management and component assembly.
5. [frontend/src/components/IncomeExpenseChart.jsx](file:///C:/Users/shyam/.gemini/antigravity/scratch/personal-finance-tracker/frontend/src/components/IncomeExpenseChart.jsx) — Recharts visualization component.
