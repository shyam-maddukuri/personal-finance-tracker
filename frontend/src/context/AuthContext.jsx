import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pft_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pft_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  // Verify token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('pft_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.data);
          localStorage.setItem('pft_user', JSON.stringify(res.data.data));
        }
      } catch (err) {
        // Expired or invalid token
        localStorage.removeItem('pft_token');
        localStorage.removeItem('pft_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { token: receivedToken, ...userData } = res.data.data;
      localStorage.setItem('pft_token', receivedToken);
      localStorage.setItem('pft_user', JSON.stringify(userData));
      setToken(receivedToken);
      setUser(userData);
      return res.data;
    }
  };

  const register = async (name, email, password, currency = '$') => {
    const res = await api.post('/auth/register', { name, email, password, currency });
    if (res.data?.success) {
      const { token: receivedToken, ...userData } = res.data.data;
      localStorage.setItem('pft_token', receivedToken);
      localStorage.setItem('pft_user', JSON.stringify(userData));
      setToken(receivedToken);
      setUser(userData);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('pft_token');
    localStorage.removeItem('pft_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
