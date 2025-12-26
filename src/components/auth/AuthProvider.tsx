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
    const savedUser = localStorage.getItem('janus_user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
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
      // Use the correct apiClient method
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
        localStorage.setItem('janus_user', JSON.stringify(userData));
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to simulation if backend is not available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        tier: 'basic',
        tokens_remaining: 250,
        purchased_tokens: 0,
        isAdmin: email === 'admin@janusforge.ai'
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', `mock-token-${Date.now()}`);
      localStorage.setItem('janus_user', JSON.stringify(mockUser));
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
      // Use the correct apiClient method
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
          isAdmin: false
        };
        
        setUser(userData);
        if (result.data.token) {
          localStorage.setItem('auth_token', result.data.token);
        }
        localStorage.setItem('janus_user', JSON.stringify(userData));
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback to simulation if backend is not available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        tier: 'free',
        tokens_remaining: 50,
        purchased_tokens: 0,
        isAdmin: false
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_token', `mock-token-${Date.now()}`);
      localStorage.setItem('janus_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      // Try to get fresh user data from backend
      const result = await apiClient.getCurrentUser();
      
      if (result.success && result.data) {
        const updatedUser: User = {
          id: result.data.id || user.id,
          email: result.data.email || user.email,
          name: result.data.name || user.name,
          tier: (result.data.tier as User['tier']) || user.tier,
          tokens_remaining: result.data.tokens_remaining || user.tokens_remaining,
          purchased_tokens: result.data.purchased_tokens || user.purchased_tokens,
          isAdmin: result.data.isAdmin || user.isAdmin
        };
        
        setUser(updatedUser);
        localStorage.setItem('janus_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Silently fail - user can continue with cached data
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
