"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  tokens_remaining: number;
  tier: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  updateUserData: (newData: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('janus_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === 'admin@janusforge.ai') {
          parsedUser.tokens_remaining = 999789;
          parsedUser.role = 'GOD_MODE'; // [cite: 2025-11-27]
        }
        setUser(parsedUser);
      } catch (e) {
        console.error("Auth Restore Failed:", e);
        localStorage.removeItem('janus_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data) return false;

      // ✅ FIX: Safely extract user data even if nested differently
      const userData = data.user || data;

      if (!userData || !userData.email) {
        console.error("Login Error: User data missing from response");
        return false;
      }

      // 🛡️ Master Authority Integrity Check [cite: 2025-11-27]
      if (userData.email === 'admin@janusforge.ai') {
        userData.tokens_remaining = 999789;
        userData.role = 'GOD_MODE';
      }

      localStorage.setItem('janus_user', JSON.stringify(userData));
      if (data.token) localStorage.setItem('janus_token', data.token);

      setUser(userData);
      return true;
    } catch (error) {
      // Prevents the "TypeError: Cannot read properties of undefined" crash
      console.error("Login Handshake Failed:", error);
      return false;
    }
  };

  const updateUserData = (newData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      if (updated.email === 'admin@janusforge.ai') {
        updated.tokens_remaining = 999789;
        updated.role = 'GOD_MODE';
      }
      localStorage.setItem('janus_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('janus_user');
    localStorage.removeItem('janus_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, updateUserData, logout }}>
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
