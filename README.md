# 💰 Personal Finance Tracker (MERN Stack)

A modern, full-stack **Personal Finance Tracker** developed with the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js), Tailwind CSS, Recharts, Axios, and Lucide React.

Designed specifically as a **College Academic Project** demonstration with full persistence, JWT authentication, responsive navy-blue & white design, and live database health monitoring.

---

## 📑 Table of Contents
1. [Tech Stack & Architecture](#-tech-stack--architecture)
2. [Project Folder Structure](#-project-folder-structure)
3. [Step 1: MongoDB Atlas Setup (Free Cloud Database)](#-step-1-mongodb-atlas-setup-free-cloud-database)
4. [Step 2: Backend Configuration & Startup](#-step-2-backend-configuration--startup)
5. [Step 3: Frontend Configuration & Startup](#-step-3-frontend-configuration--startup)
6. [Step 4: Step-by-Step Testing & Academic Demo Script](#-step-4-step-by-step-testing--academic-demo-script)
7. [Step 5: Cloud Deployment Guide (Render + Vercel)](#-step-5-cloud-deployment-guide-render--vercel)
8. [Beginner's MERN Architecture Explanation](#-beginners-mern-architecture-explanation)

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 19 with Vite, Tailwind CSS (Navy & White professional theme), Recharts (Bar/Area & Donut charts), Lucide React (Icons), Axios (API client with interceptors).
- **Backend**: Node.js & Express.js REST API with modular controllers, routes, models, and error handling.
- **Database**: MongoDB Atlas with Mongoose schemas (`User`, `Transaction`, `Budget`) and compound indexing.
- **Security**: JSON Web Token (JWT) Bearer authentication, password hashing with bcryptjs (salt rounds 10), CORS protection.
- **Health Monitoring**: Real-time `/api/health` endpoint returning true MongoDB connection states (`readyState` 0/1/2/3).

---

## 📂 Project Folder Structure

```text
personal-finance-tracker/
├── backend/
│   ├── .env                    # Secret environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── .env.example            # Sample configuration template
│   ├── package.json            # Backend dependencies & run scripts
│   └── src/
│       ├── config/
│       │   └── db.js           # Mongoose Atlas connection with reconnect handlers
│       ├── controllers/
│       │   ├── authController.js        # Register, login, current profile
│       │   ├── transactionController.js # CRUD & aggregated financial analytics
│       │   └── budgetController.js     # Monthly category limits & spending calculations
│       ├── middleware/
│       │   ├── auth.js         # JWT Bearer token verification
│       │   └── errorHandler.js # Mongoose validation & duplicate key error handler
│       ├── models/
│       │   ├── User.js         # User model with bcrypt pre-save hash
│       │   ├── Transaction.js  # Transaction schema with compound index
│       │   └── Budget.js       # Budget limit schema per month/category
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── transactionRoutes.js
│       │   ├── budgetRoutes.js
│       │   └── healthRoutes.js # Real-time server and DB health
│       └── server.js           # Express app initialization & CORS
├── frontend/
│   ├── .env                    # Frontend environment (VITE_API_URL)
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js      # Navy blue palette & custom extensions
│   ├── index.html
│   └── src/
│       ├── api/
│       │   └── axiosInstance.js# Axios client with JWT auto-injection
│       ├── context/
│       │   └── AuthContext.jsx # Global user auth & session management
│       ├── components/
│       │   ├── Navbar.jsx      # Sticky navy header with health pill & user menu
│       │   ├── Sidebar.jsx     # Responsive desktop sidebar & mobile drawer
│       │   ├── StatCard.jsx    # Metric cards for Balance, Income, Expense, Savings
│       │   ├── IncomeExpenseChart.jsx # Recharts Bar & Trend Area toggle
│       │   ├── CategoryPieChart.jsx   # Donut chart with category colors
│       │   ├── TransactionTable.jsx   # Clean table with edit & delete actions
│       │   ├── TransactionModal.jsx   # Add/Edit transaction modal dialog
│       │   ├── BudgetModal.jsx        # Set category spending threshold modal
│       │   ├── BudgetProgress.jsx     # Visual progress bar with over-limit alerts
│       │   └── HealthBadge.jsx        # Real-time backend & MongoDB indicator
│       ├── pages/
│       │   ├── Dashboard.jsx   # High-level financial summary
│       │   ├── Transactions.jsx# Full history with search, filters & CSV export
│       │   ├── Budgets.jsx     # Monthly budget management & 50/30/20 rule
│       │   ├── Analytics.jsx   # Financial health score & category breakdown
│       │   ├── Login.jsx       # User login with demo autofill helper
│       │   └── Register.jsx    # User sign-up with currency selector
│       ├── utils/
│       │   └── formatters.js   # Currency, date, and category formatting
│       ├── App.jsx             # Main router and tab coordinator
│       └── main.jsx
└── README.md
```

---

## ☁️ Step 1: MongoDB Atlas Setup (Free Cloud Database)

Since you are on a new laptop, you don't need to install a heavy local MongoDB server. We use **MongoDB Atlas** (Free M0 Sandbox):

1. **Create an Account**: Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and sign up for free.
2. **Create a Free Cluster**:
   - Choose the **M0 Free** tier.
   - Choose your nearest cloud region (e.g. AWS / Mumbai, Virginia, Frankfurt, Singapore).
   - Click **Create Deployment**.
3. **Configure Database Access (Username & Password)**:
   - In the Quickstart modal, enter a username (e.g., `finance_admin`) and a secure password.
   - Click **Create User**. *(Note down this password!)*
4. **Configure Network Access (Whitelist IP)**:
   - Under **Network Access** (or in the Quickstart prompt), choose **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Click **Add IP Address**.
5. **Get Your Connection String**:
   - Go to **Database** -> Click the **Connect** button on your cluster.
   - Select **Drivers** (Node.js).
   - Copy the SRV connection URI. It looks like:
     ```text
     mongodb+srv://finance_admin:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<db_password>` with your actual user password and add `/personal_finance_tracker` before the query parameter:
     ```text
     mongodb+srv://finance_admin:YourPassword123@cluster0.abcde.mongodb.net/personal_finance_tracker?retryWrites=true&w=majority
     ```

---

## 💻 Step 2: Backend Configuration & Startup

Open a PowerShell or Command Prompt terminal on your laptop:

### 1. Navigate to the backend folder:
```powershell
cd C:\Users\SHYAM\.gemini\antigravity\scratch\personal-finance-tracker\backend
```

### 2. Configure `backend/.env`:
Open the `.env` file in your editor and paste your MongoDB Atlas URI:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://finance_admin:YourPassword123@cluster0.abcde.mongodb.net/personal_finance_tracker?retryWrites=true&w=majority
JWT_SECRET=personal_finance_tracker_secret_jwt_key_2026_academic_demo
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Start the backend:
```powershell
npm run dev
```
*(Or use `npm start`)*

You will see:
```text
🚀 Finance Tracker API Server running on port 5000
📡 Health Check URL: http://localhost:5000/api/health
✅ MongoDB Atlas Connected: cluster0-shard-00-00.abcde.mongodb.net
```

### 4. Verify Health Check:
Open your browser and visit: [http://localhost:5000/api/health](http://localhost:5000/api/health)
You should see:
```json
{
  "status": "healthy",
  "message": "Backend and MongoDB Atlas are operational",
  "database": {
    "connected": true,
    "state": "connected",
    "readyState": 1
  }
}
```

---

## 🌐 Step 3: Frontend Configuration & Startup

Open a **second** terminal window:

### 1. Navigate to the frontend folder:
```powershell
cd C:\Users\SHYAM\.gemini\antigravity\scratch\personal-finance-tracker\frontend
```

### 2. Verify `frontend/.env`:
Check that `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the Vite React development server:
```powershell
npm run dev
```

You will see:
```text
  VITE v8.3.5  ready in 180 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🧪 Step 4: Step-by-Step Testing & Academic Demo Script

Follow this structured workflow during your college demo:

### 1. Database & Server Health Demonstration
- Point to the live **Health Indicator** badge in the top-right corner of the application:
  - If Atlas is connected, it displays a pulsing green pill: **"MongoDB Atlas: Connected"**.
  - Clicking the badge opens an inspector showing the API port, Atlas cluster host, uptime, and database connection state.
  - This proves to your evaluator that your application is using genuine cloud database persistence, not mock data.

### 2. User Registration & JWT Authentication
1. Click **"Create free account"**.
2. Enter:
   - Name: `Alex Morgan`
   - Email: `alex@demo.edu`
   - Password: `password123`
   - Preferred Currency: Select `₹` (Indian Rupees)
3. Click **Create Account**.
4. You are automatically signed in with a signed JSON Web Token stored in `localStorage`.
5. Refresh the page: notice your session persists automatically via `/api/auth/me`.

### 3. Record Sample Transactions
Click **"+ Add Transaction"** or **"New Transaction"** to add sample academic records:
- **Income 1**: Title: `Software Internship Stipend`, Amount: `25000`, Type: `Income`, Category: `Salary`
- **Income 2**: Title: `Freelance Web Design`, Amount: `8500`, Type: `Income`, Category: `Freelance`
- **Expense 1**: Title: `Apartment Rent`, Amount: `12000`, Type: `Expense`, Category: `Housing & Rent`
- **Expense 2**: Title: `Campus Grocery Store`, Amount: `3500`, Type: `Expense`, Category: `Groceries & Food`
- **Expense 3**: Title: `Broadband Fiber Internet`, Amount: `999`, Type: `Expense`, Category: `Utilities`
- **Expense 4**: Title: `Textbooks & Course Material`, Amount: `1500`, Type: `Expense`, Category: `Education`

### 4. Dashboard Inspection
- **Stat Cards**:
  - Net Balance: `₹15,501.00` (Calculated automatically from total income - total expenses).
  - Total Income: `₹33,500.00`.
  - Total Expenses: `₹17,999.00`.
  - Total Income: `$3,150.00`.
  - Total Expenses: `$1,310.00`.
  - Savings Rate: `58.4%`.
- **Monthly Trend Chart**:
  - Toggle between **"Bars"** and **"Trend Area"** to showcase Recharts responsiveness.
- **Spending by Category (Donut Chart)**:
  - Hover over segments to show category tooltips, amounts, and percentages.

### 5. Transactions Tab Features
1. Click **"Transactions"** in the sidebar.
2. Test **Live Search**: type `Grocery` — table filters instantly.
3. Test **Category Filter**: select `Housing & Rent`.
4. Test **Edit Transaction**: click the pencil icon, modify amount or description, and save.
5. Test **Export CSV**: click **"Export CSV"** to demonstrate downloading an actual `.csv` spreadsheet file for your records.

### 6. Monthly Budget Management & Alert Testing
1. Click **"Monthly Budgets"** in the sidebar.
2. Click **"Set Budget"**:
   - Category: `Groceries & Food`
   - Target Month: Current Month (e.g., `2026-11`)
   - Limit: `200`
3. Click **Save**:
   - Notice the category card instantly highlights **"Over by $20.00"** in red/rose with an alert badge because actual spending was `$220.00`!
4. Add another budget:
   - Category: `Housing & Rent`
   - Limit: `1200`
   - Shows **"75% used — $300.00 remaining"** with a green progress bar.

### 7. Visual Analytics & Financial Health
1. Click **"Analytics & Reports"** in the sidebar.
2. Review the computed **Financial Health Score** (e.g., 95/100 based on healthy savings rate).
3. Review the complete category distribution audit table.

---

## 🚀 Step 5: Cloud Deployment Guide (Render + Vercel)

### Part A: Deploy Backend to Render (Free Web Service)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. In the **Environment Variables** section, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *Your production secret key*
   - `CORS_ORIGIN`: `*` *(or your Vercel frontend domain)*
6. Click **Deploy Web Service**.
7. Render will provide a public URL like: `https://personal-finance-backend.onrender.com`.
8. Test by opening `https://personal-finance-backend.onrender.com/api/health` in your browser.

---

### Part B: Deploy Frontend to Vercel (Free Frontend Hosting)
1. Sign in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Select your GitHub repository.
3. In **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**:
   - Name: `VITE_API_URL`
   - Value: `https://personal-finance-backend.onrender.com/api` *(your Render backend URL)*
5. Click **Deploy**.
6. Vercel will build and assign you a live HTTPS URL (e.g., `https://personal-finance-tracker.vercel.app`).

---

## 🎓 Beginner's MERN Architecture Explanation

If your college professor or examiner asks how the application works under the hood, here are the key concepts:

### 1. What does MERN stand for?
- **M (MongoDB Atlas)**: A NoSQL Document database that stores data as JSON-like BSON documents. It allows flexible schemas and easy cloud scalability.
- **E (Express.js)**: A lightweight web application framework for Node.js that organizes RESTful endpoints (`/api/auth`, `/api/transactions`, `/api/budgets`).
- **R (React.js)**: A declarative component-based user interface library that handles user interaction and updates the Virtual DOM smoothly without page reloads.
- **N (Node.js)**: An open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser on the server.

### 2. How does JWT Authentication work?
1. The user enters their password on the React frontend.
2. Express hashes the password using `bcryptjs` and compares it to the hashed string stored in MongoDB.
3. If valid, the backend creates a digitally signed **JSON Web Token (JWT)** with user ID payload and an expiration timestamp (30 days).
4. The React client saves the token in `localStorage`.
5. For every subsequent API call, our Axios request interceptor (`frontend/src/api/axiosInstance.js`) automatically adds the HTTP header:
   ```http
   Authorization: Bearer <token>
   ```
6. The backend `protect` middleware verifies the digital signature before letting the request reach the database.

### 3. How do Budgets & Aggregation work in MongoDB?
Instead of fetching all transactions into memory, the backend uses **MongoDB Aggregation Pipelines** (`$match`, `$group`, `$sum`):
```javascript
const actualSpending = await Transaction.aggregate([
  { $match: { user: userId, type: 'expense', date: { $gte: startOfMonth, $lte: endOfMonth } } },
  { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
]);
```
This offloads mathematical calculation to MongoDB's database engine, ensuring fast performance even with thousands of records.

---

## 📜 Academic Declaration & Project Authorship
- **Project Name**: Personal Finance Tracker
- **Domain**: Web Application Development / Full Stack Engineering
- **Architecture**: Decoupled Client-Server MERN Architecture
- **License**: MIT
