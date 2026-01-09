"use client";
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  tokens_remaining: number;
  role?: string;
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
    const savedUser = localStorage.getItem('janus_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
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
    console.log('=== LOGIN DEBUG ===');
    console.log('API response:', data);

    // Use data directly (flat user object)
    const userData: User = {
      id: data.id,
      email: data.email,
      name: data.name || data.username || email.split('@')[0],
      username: data.username || email.split('@')[0],
      tokens_remaining: data.tokens_remaining,
      role: data.role
    };
    console.log('UserData to store:', userData);

    setUser(userData);
    localStorage.setItem('janus_user', JSON.stringify(userData));
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};  

const register = async (email: string, name: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email.toLowerCase().trim(), 
        username: name, 
        password 
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed');
    }

    const data = await response.json();
    console.log('=== REGISTER DEBUG ===');
    console.log('API response (flat style):', data);

    // Flat response: user data is directly in data (no nested .user)
    const userData: User = {
      id: data.id,
      email: data.email,
      name: data.name || data.username || name,
      username: data.username || name,
      tokens_remaining: data.tokens_remaining,
      role: data.role
    };

    console.log('UserData to store (flat):', userData);
    setUser(userData);
    localStorage.setItem('janus_user', JSON.stringify(userData));
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('janus_user');
  };

  const refreshUser = async () => {
    if (!user) return;
    // Optional future enhancement
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
