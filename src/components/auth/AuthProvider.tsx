'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  tokens: number;
  isAdmin?: boolean;  // Added isAdmin as optional property
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is the hook that Header.tsx is trying to use
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

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('janus_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Add isAdmin based on email (for demo purposes)
        const userWithAdmin = {
          ...parsedUser,
          isAdmin: parsedUser.email?.includes('admin') || parsedUser.email === 'admin@janusforge.ai'
        };
        setUser(userWithAdmin);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('janus_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in production, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        tier: 'pro',
        tokens: 1000,
        isAdmin: email.includes('admin') || email === 'admin@janusforge.ai'
      };
      
      setUser(mockUser);
      localStorage.setItem('janus_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('janus_user');
  };

  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        tier: 'free',
        tokens: 100,
        isAdmin: email.includes('admin') || email === 'admin@janusforge.ai'
      };
      
      setUser(mockUser);
      localStorage.setItem('janus_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
