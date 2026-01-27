import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import axios from 'axios';
import { supabase } from '@/lib/supabase'; // Importar o cliente Supabase
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  session: Session | null; // Alterado de token para session
  user: User | null; // Adicionado user
  authenticatedAxios: typeof axios; // Adicionado axios autenticado
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Configura uma instância do axios que inclui o token de autenticação
  const authenticatedAxios = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsAuthenticated(!!currentSession);
        setIsLoading(false);

        // Atualiza o header de autorização do axios
        if (currentSession?.access_token) {
          authenticatedAxios.defaults.headers.common['Authorization'] = `Bearer ${currentSession.access_token}`;
        } else {
          delete authenticatedAxios.defaults.headers.common['Authorization'];
        }
      }
    );

    // Tenta obter a sessão inicial
    const getInitialSession = async () => {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting initial session:', error);
      }
      setSession(initialSession);
      setUser(initialSession?.user || null);
      setIsAuthenticated(!!initialSession);
      setIsLoading(false);

      if (initialSession?.access_token) {
        authenticatedAxios.defaults.headers.common['Authorization'] = `Bearer ${initialSession.access_token}`;
      } else {
        delete authenticatedAxios.defaults.headers.common['Authorization'];
      }
    };

    getInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      setIsAuthenticated(true);
      showSuccess('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      showError(error.message || 'Login failed. Please check your credentials.');
      setIsAuthenticated(false);
      setSession(null);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setIsAuthenticated(false);
      setSession(null);
      setUser(null);
      showSuccess('Logged out successfully.');
    } catch (error: any) {
      console.error('Logout failed:', error);
      showError(error.message || 'Logout failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, session, user, authenticatedAxios }}>
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