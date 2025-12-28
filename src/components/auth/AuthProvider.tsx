'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  username: string; 
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  token_balance: number; // Corrected to match Database/Schema
  purchased_tokens: number;
  isAdmin?: boolean;
}

// ... Context definitions remain the same ...

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
        // We map whatever the API sends to our strict 'token_balance' property
        const userData: User = {
          id: result.data.id,
          email: result.data.email,
          name: result.data.name || result.data.username,
          username: result.data.username,
          tier: result.data.tier || 'free',
          token_balance: result.data.token_balance ?? result.data.tokens_remaining ?? 0,
          purchased_tokens: result.data.purchased_tokens || 0,
          isAdmin: result.data.isAdmin || false
        };

        setUser(userData);
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('janus_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the helper functions ...
}
