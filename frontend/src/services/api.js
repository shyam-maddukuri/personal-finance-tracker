/**
 * API Service Module
 * 
 * Why this is needed:
 * Centralizing all HTTP requests in this single file keeps our UI components clean.
 * Instead of embedding `fetch()` calls inside multiple components, components simply
 * import and call these reusable helper functions.
 * 
 * How it communicates with the backend:
 * Vite forwards requests starting with `/api` to `http://localhost:5000/api`
 * via the development proxy configured in `vite.config.js`.
 */

const BASE_URL = '/api';

/**
 * Helper to handle fetch responses and parse error messages
 */
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

/**
 * Fetch dashboard summary statistics (totals, budget, recent transactions, monthly chart)
 */
export async function getDashboardSummary() {
  const response = await fetch(`${BASE_URL}/transactions/summary`);
  return handleResponse(response);
}

/**
 * Fetch transactions with optional filters
 * @param {Object} filters - { search, category, type, limit }
 */
export async function getTransactions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.limit) params.append('limit', filters.limit);

  const url = `${BASE_URL}/transactions?${params.toString()}`;
  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * Create a new transaction in MongoDB
 * @param {Object} transactionData - { title, amount, category, type, date }
 */
export async function createTransaction(transactionData) {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  return handleResponse(response);
}

/**
 * Update an existing transaction in MongoDB
 * @param {string} id
 * @param {Object} transactionData - { title, amount, category, type, date }
 */
export async function updateTransaction(id, transactionData) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  return handleResponse(response);
}

/**
 * Delete a transaction from MongoDB by its ID
 * @param {string} id
 */
export async function deleteTransaction(id) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

/**
 * Fetch monthly budget data
 * @param {number} month
 * @param {number} year
 */
export async function getBudget(month, year) {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);

  const response = await fetch(`${BASE_URL}/budget?${params.toString()}`);
  return handleResponse(response);
}

/**
 * Set or update monthly budget
 * @param {Object} budgetData - { month, year, amount }
 */
export async function setBudget(budgetData) {
  const response = await fetch(`${BASE_URL}/budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budgetData),
  });
  return handleResponse(response);
}

/**
 * Seed initial student demonstration data
 * @param {boolean} force - whether to overwrite existing data
 */
export async function seedDemoData(force = false) {
  const response = await fetch(`${BASE_URL}/transactions/seed${force ? '?force=true' : ''}`, {
    method: 'POST',
  });
  return handleResponse(response);
}
