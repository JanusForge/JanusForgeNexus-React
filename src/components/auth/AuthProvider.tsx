'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  tokens_remaining: number;
  purchased_tokens: number;
  isAdmin?: boolean;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In production, this would validate the token with backend
      // For now, just clear it since we want real auth
      localStorage.removeItem('auth_token');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // REAL BACKEND CALL - using the correct API method
      const result = await apiClient.authenticate(email, password);
      
      if (result.success && result.data) {
        // Transform the API response to our User interface
        const userData: User = {
          id: result.data.id || `user-${Date.now()}`,
          email: result.data.email || email,
          name: result.data.name || email.split('@')[0],
          tier: (result.data.tier as User['tier']) || 'free',
          tokens_remaining: result.data.tokens_remaining || 0,
          purchased_tokens: result.data.purchased_tokens || 0,
          isAdmin: result.data.isAdmin || false
        };
        
        setUser(userData);
        if (result.data.token) {
          localStorage.setItem('auth_token', result.data.token);
        }
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
      // REAL BACKEND CALL - using the correct API method
      const result = await apiClient.register(email, password, name);
      
      if (result.success && result.data) {
        // Transform the API response to our User interface
        const userData: User = {
          id: result.data.id || `user-${Date.now()}`,
          email: result.data.email || email,
          name: result.data.name || name,
          tier: (result.data.tier as User['tier']) || 'free',
          tokens_remaining: result.data.tokens_remaining || 0,
          purchased_tokens: result.data.purchased_tokens || 0,
          isAdmin: result.data.isAdmin || false
        };
        
        setUser(userData);
        if (result.data.token) {
          localStorage.setItem('auth_token', result.data.token);
        }
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      // REAL BACKEND CALL to refresh user data
      // For now, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be: const result = await apiClient.getCurrentUser();
      console.log('User data refreshed (simulated)');
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
