# 🎨 Personal Finance Tracker — Frontend Client

React.js (Vite) + Tailwind CSS + Recharts + Axios + Lucide React client application.

## 📦 Installed Dependencies
- `react` & `react-dom` — React 19 UI component framework
- `recharts` — Responsive charts (Income vs Expense Bar/Area, Category Donut)
- `lucide-react` — Professional dashboard icons
- `axios` — HTTP client with automated JWT bearer token injection
- `tailwindcss`, `postcss`, `autoprefixer` — Navy blue and white styling

## ⚙️ Environment Configuration (`.env`)
```env
# URL pointing to the Express backend API
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Frontend
```bash
npm install        # (Already installed)
npm run dev        # Starts Vite dev server at http://localhost:5173
npm run build      # Produces optimized production build in dist/
```

## 🖥️ Application Features
1. **Financial Dashboard**: Real-time cards for Net Balance, Total Income, Total Expenses, and Savings Rate.
2. **Interactive Visualizations**:
   - Monthly Income vs. Expense comparison chart with toggle between Bar and Area view.
   - Category-wise Spending Donut chart with percentage breakdown.
3. **Transaction History & Filter**:
   - Live search by title or notes.
   - Type filter (Income / Expense).
   - Category filter.
   - Date range selector.
   - Export history to CSV file.
4. **Monthly Budgeting**:
   - Set category-specific or overall limits for any month.
   - Real-time comparison with actual transactions.
   - Visual progress bars and overspending alerts.
5. **Real-time Health Badge**:
   - Automatically polls `/api/health` and verifies that backend and MongoDB Atlas are operational.
