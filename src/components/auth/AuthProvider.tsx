'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Use the public backend URL to bypass Vercel /api proxy
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  tier: string;
  token_balance: number;
  tokens_used: number;
  tokens_remaining: number;
  purchased_tokens?: number;
  isAdmin?: boolean;
  role?: string; // Added for GOD_MODE / ENTERPRISE support
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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
      }

      const data = await response.json();

      const balance = data.token_balance ?? data.tokens_remaining ?? 0;
      const used = data.tokens_used ?? 0;

      const userData: User = {
        id: data.id || `user-${Date.now()}`,
        email: data.email || email,
        name: data.name || data.username || email.split('@')[0] || 'User',
        username: data.username || email.split('@')[0],
        tier: data.tier || 'free',
        token_balance: balance,
        tokens_used: used,
        tokens_remaining: balance - used,
        purchased_tokens: data.purchased_tokens || 0,
        isAdmin: data.isAdmin || data.username === 'admin-access',
        role: data.role || 'USER'
      };

      setUser(userData);
      localStorage.setItem('janus_user', JSON.stringify(userData));
      // Note: Your backend currently doesn't return a JWT — remove token storage if not used
    } catch (error: any) {
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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), username: name, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const data = await response.json();

      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.name || name || 'User',
        username: data.username || name,
        tier: data.tier || 'free',
        token_balance: data.token_balance ?? data.tokens_remaining ?? 50,
        tokens_used: data.tokens_used ?? 0,
        tokens_remaining: data.tokens_remaining ?? 50,
        purchased_tokens: 0,
        isAdmin: false,
        role: data.role || 'USER'
      };

      setUser(userData);
      localStorage.setItem('janus_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    // Optional: Add a /api/auth/me endpoint later for true refresh
    // For now, rely on localStorage
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
