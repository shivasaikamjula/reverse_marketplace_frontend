import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const authData = response.data.data;
        const userData = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          role: authData.role,
          phone: authData.phone,
        };
        setUser(userData);
        setToken(authData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authData.token);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role, phone) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role, phone });
      if (response.data.success) {
        const authData = response.data.data;
        const userData = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          role: authData.role,
          phone: authData.phone,
        };
        setUser(userData);
        setToken(authData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authData.token);
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isCustomer: user?.role === 'CUSTOMER',
        isProvider: user?.role === 'PROVIDER',
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
