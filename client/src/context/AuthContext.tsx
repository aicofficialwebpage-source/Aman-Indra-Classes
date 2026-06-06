import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

interface Admin {
  id: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (token: string, adminData: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyAdmin = async () => {
    const token = localStorage.getItem('aic_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/auth/verify');
      if (data && data.admin) {
        setAdmin({
          id: data.admin.id || data.admin._id,
          email: data.admin.email
        });
      } else {
        localStorage.removeItem('aic_admin_token');
      }
    } catch (err) {
      console.warn('Session verification failed, logging out.');
      localStorage.removeItem('aic_admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAdmin();
  }, []);

  const login = (token: string, adminData: Admin) => {
    localStorage.setItem('aic_admin_token', token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('aic_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
