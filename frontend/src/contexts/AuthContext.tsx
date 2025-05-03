import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const response = await auth.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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