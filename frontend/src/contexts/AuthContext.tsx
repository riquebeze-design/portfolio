import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));

  useEffect(() => {
    if (token) {
      // Optionally validate token with backend here if needed,
      // but for simplicity, we assume if token exists, user is authenticated.
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const newToken = response.data.token;
      localStorage.setItem('jwt_token', newToken);
      setToken(newToken);
      setIsAuthenticated(true);
      showSuccess('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      showError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('jwt_token');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('jwt_token');
    showSuccess('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};