'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from './client';
import { ApiResponse, Conversation, Debate, User } from './config';

// Helper function to safely convert API tier string to User['tier']
const parseUserTier = (tierString: string | undefined): User['tier'] => {
  if (!tierString) return 'free';
  
  const tier = tierString.toLowerCase();
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    return tier;
  }
  return 'free';
};

// Helper to transform API user data to our User interface
const transformApiUser = (apiData: any): User | null => {
  if (!apiData) return null;
  
  return {
    id: apiData.id || '',
    email: apiData.email || '',
    name: apiData.name || '',
    tier: parseUserTier(apiData.tier),
    tokens_remaining: typeof apiData.tokens_remaining === 'number' ? apiData.tokens_remaining : 0,
    purchased_tokens: typeof apiData.purchased_tokens === 'number' ? apiData.purchased_tokens : 0,
    isAdmin: Boolean(apiData.isAdmin)
  };
};

interface ApiContextType {
  // State
  conversations: Conversation[];
  dailyDebate: Debate | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadConversations: () => Promise<void>;
  createConversation: (content: string, aiModel?: string) => Promise<ApiResponse>;
  likeConversation: (conversationId: string) => Promise<ApiResponse>;
  loadDailyDebate: () => Promise<void>;
  participateInDebate: (debateId: string, position: string, argument: string) => Promise<ApiResponse>;
  login: (email: string, password: string) => Promise<ApiResponse>;
  register: (userData: { email: string; password: string; name: string }) => Promise<ApiResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [dailyDebate, setDailyDebate] = useState<Debate | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Check backend health
      const health = await apiClient.healthCheck();
      if (!health.success) {
        setError(health.error || 'Backend server not available');
        setLoading(false);
        return;
      }

      // Load conversations
      const convResponse = await apiClient.getConversations();
      if (convResponse.success && convResponse.data) {
        const convs = Array.isArray(convResponse.data) ? convResponse.data : [];
        setConversations(convs);
      }

      // Load daily debate
      const debateResponse = await apiClient.getDailyForgeTopic();
      if (debateResponse.success && debateResponse.data) {
        setDailyDebate(debateResponse.data);
      }

      // Load current user if logged in
      const userResponse = await apiClient.getCurrentUser();
      if (userResponse.success && userResponse.data) {
        const user = transformApiUser(userResponse.data);
        setCurrentUser(user);
      }

      setError(null);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Failed to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await apiClient.getConversations();
      if (response.success && response.data) {
        const convs = Array.isArray(response.data) ? response.data : [];
        setConversations(convs);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const createConversation = async (content: string, aiModel?: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.createConversation(content, aiModel);
      if (response.success && response.data) {
        // Add to local state
        setConversations(prev => [response.data, ...prev]);
      }
      return response;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  };

  const likeConversation = async (conversationId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.likeConversation(conversationId);
      return response;
    } catch (err) {
      console.error('Failed to like conversation:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  };

  const loadDailyDebate = async () => {
    try {
      const response = await apiClient.getDailyForgeTopic();
      if (response.success && response.data) {
        setDailyDebate(response.data);
      }
    } catch (err) {
      console.error('Failed to load daily debate:', err);
    }
  };

  const participateInDebate = async (debateId: string, position: string, argument: string): Promise<ApiResponse> => {
    try {
      // This endpoint would be implemented when debate functionality is added
      // For now, return error indicating feature not implemented
      return { 
        success: false, 
        error: 'Debate participation not yet implemented. Check back soon!' 
      };
    } catch (err) {
      console.error('Failed to participate in debate:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  };

  const login = async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.authenticate(email, password);
      if (response.success && response.data) {
        const user = transformApiUser(response.data);
        setCurrentUser(user);
      }
      return response;
    } catch (err) {
      console.error('Login failed:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  };

  const register = async (userData: { email: string; password: string; name: string }): Promise<ApiResponse> => {
    try {
      const response = await apiClient.register(userData.email, userData.password, userData.name);
      if (response.success && response.data) {
        const user = transformApiUser(response.data);
        setCurrentUser(user);
      }
      return response;
    } catch (err) {
      console.error('Registration failed:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      };
    }
  };

  const logout = () => {
    // Clear local state
    setCurrentUser(null);
    // Clear localStorage (handled by AuthProvider in production)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('janus_user');
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        const user = transformApiUser(response.data);
        setCurrentUser(user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const contextValue: ApiContextType = {
    conversations,
    dailyDebate,
    currentUser,
    loading,
    error,
    loadConversations,
    createConversation,
    likeConversation,
    loadDailyDebate,
    participateInDebate,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
