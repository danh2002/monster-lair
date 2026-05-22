'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  displayName?: string | null;
  avatar?: string | null;
  goldCoins?: number;
  gems?: number;
  createdAt?: string;
  locale?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, phone: string, locale?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'authUser';

interface AuthResponse {
  success?: boolean;
  error?: string;
  user?: AuthUser;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (!storedUser) return;

    try {
      setUser(JSON.parse(storedUser) as AuthUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = (await response.json()) as AuthResponse;

    if (!response.ok || !data.success || !data.user) {
      throw new Error(data.error || 'INTERNAL_ERROR');
    }

    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
  };

  const register = async (username: string, email: string, password: string, phone: string, locale = 'vi') => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, phone, locale }),
    });

    const data = (await response.json()) as AuthResponse;

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'INTERNAL_ERROR');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
