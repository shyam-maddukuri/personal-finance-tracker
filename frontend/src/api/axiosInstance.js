import axios from 'axios';

// Get base URL from environment variable, with fallback for local dev
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pft_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global response errors (e.g. expired session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear localStorage
      if (localStorage.getItem('pft_token')) {
        localStorage.removeItem('pft_token');
        localStorage.removeItem('pft_user');
        // Do not force reload if already on auth page
        if (!window.location.pathname.includes('/login')) {
          window.dispatchEvent(new Event('auth-expired'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
