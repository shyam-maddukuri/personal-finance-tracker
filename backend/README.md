# 🖥️ Personal Finance Tracker — Backend API

Node.js + Express.js + MongoDB Atlas REST API with JSON Web Token (JWT) Bearer authentication.

## 📦 Installed Dependencies
- `express` — Web framework and routing
- `mongoose` — MongoDB ODM schemas and aggregation pipelines
- `jsonwebtoken` — Sign and verify JWT bearer tokens
- `bcryptjs` — Secure password hashing with salt rounds
- `cors` — Cross-Origin Resource Sharing handling
- `dotenv` — Environment variable loader
- `morgan` — HTTP request logger

## ⚙️ Environment Configuration (`.env`)
Create or edit `.env` in this directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/personal_finance_tracker?retryWrites=true&w=majority
JWT_SECRET=personal_finance_tracker_secret_jwt_key_2026_academic_demo
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

## 🚀 Running the Backend
```bash
npm install        # (Already installed)
npm run dev        # Runs with nodemon auto-reload on file change
# or
npm start          # Runs standard production node process
```

## 📡 API Endpoints Summary

### 1. Health & Status
- `GET /api/health` — Returns genuine MongoDB Atlas connection state and server uptime.

### 2. Authentication (`/api/auth`)
- `POST /api/auth/register` — `{ name, email, password, currency }` -> creates user, returns token.
- `POST /api/auth/login` — `{ email, password }` -> returns token.
- `GET /api/auth/me` — Protected -> returns logged-in user profile.
- `PUT /api/auth/profile` — Protected -> updates user name/currency preference.

### 3. Transactions (`/api/transactions`)
- `GET /api/transactions` — Protected -> Query filters: `search`, `type`, `category`, `startDate`, `endDate`, `page`, `limit`.
- `POST /api/transactions` — Protected -> `{ title, amount, type, category, date, notes }`.
- `GET /api/transactions/summary/stats` — Protected -> Returns totals, savings rate, 6-month timeline array, category breakdown for charts.
- `GET /api/transactions/:id` — Protected -> Single transaction.
- `PUT /api/transactions/:id` — Protected -> Update transaction.
- `DELETE /api/transactions/:id` — Protected -> Delete transaction.

### 4. Budgets (`/api/budgets`)
- `GET /api/budgets?month=YYYY-MM` — Protected -> Returns monthly category limits and calculates actual spending from transactions.
- `POST /api/budgets` — Protected -> `{ category, month, amount }` (Upsert).
- `DELETE /api/budgets/:id` — Protected -> Removes budget limit.
