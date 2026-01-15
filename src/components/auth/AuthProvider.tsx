"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  tokens_remaining: number;
  tier: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUserData: (newData: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Initial Identity Sync
  useEffect(() => {
    const storedUser = localStorage.getItem('janus_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // 🛡️ Master Authority Integrity Check [cite: 2025-11-27]
        if (parsedUser.email === 'admin@janusforge.ai') {
          parsedUser.tokens_remaining = 999789;
        }
        
        setUser(parsedUser);
      } catch (e) {
        console.error("Auth Restore Failed:", e);
      }
    }
    setLoading(false);
  }, []);

  /**
   * 🔄 updateUserData
   * Essential for Nexus Prime to subtract tokens from UI immediately
   */
  const updateUserData = (newData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      
      // Preserve Master Balance even during updates
      if (updated.email === 'admin@janusforge.ai') {
        updated.tokens_remaining = 999789;
      }
      
      localStorage.setItem('janus_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('janus_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, updateUserData, logout }}>
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
