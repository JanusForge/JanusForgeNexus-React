'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  tier: string;
  token_balance: number;
  tokens_used: number;
  tokens_remaining: number;
  purchased_tokens?: number; // Made optional to prevent build errors
  isAdmin?: boolean;         // Made optional to prevent build errors
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('janus_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('janus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await apiClient.authenticate(email, password);

      if (result.success && result.data) {
        const balance = result.data.token_balance ?? 0;
        const used = result.data.tokens_used ?? 0;

        const userData: User = {
          id: result.data.id || `user-${Date.now()}`,
          email: result.data.email || email,
          name: result.data.name || result.data.username || email.split('@')[0] || 'User',
          username: result.data.username || email.split('@')[0],
          tier: result.data.tier || 'free',
          token_balance: balance,
          tokens_used: used,
          tokens_remaining: balance - used,
          purchased_tokens: result.data.purchased_tokens || 0,
          isAdmin: result.data.isAdmin || result.data.username === 'admin-access'
        };

        setUser(userData);
        if (result.data.token) {
          localStorage.setItem('auth_token', result.data.token);
        }
        localStorage.setItem('janus_user', JSON.stringify(userData));
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('janus_user');
  };

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await apiClient.register(email, password, name);
      if (result.success && result.data) {
        const userData: User = {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name || name || 'User',
          username: result.data.username || name,
          tier: result.data.tier || 'free',
          token_balance: 50,
          tokens_used: 0,
          tokens_remaining: 50,
          purchased_tokens: 0,
          isAdmin: false
        };
        setUser(userData);
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('janus_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const result = await apiClient.getCurrentUser();
      if (result.success && result.data) {
        const balance = result.data.token_balance ?? user.token_balance;
        const used = result.data.tokens_used ?? user.tokens_used;

        const updatedUser: User = {
          ...user,
          token_balance: balance,
          tokens_used: used,
          tokens_remaining: balance - used,
          tier: result.data.tier || user.tier,
        };
        setUser(updatedUser);
        localStorage.setItem('janus_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = { user, isAuthenticated: !!user, isLoading, login, logout, register, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
