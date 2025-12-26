'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from './client';
import { websocketClient } from './websocket';
import { ApiResponse, Conversation, Debate, User } from './config';

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
  
  // WebSocket
  subscribeToConversations: (callback: (conversation: Conversation) => void) => () => void;
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
    // Load initial data
    loadInitialData();
    
    // Set up WebSocket listeners
    const handleNewConversation = (message: any) => {
      const conversation = message.data;
      setConversations(prev => [conversation, ...prev]);
    };

    const handleConversationUpdate = (message: any) => {
      const updatedConversation = message.data;
      setConversations(prev => 
        prev.map(conv => 
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      );
    };

    websocketClient.on('conversation.new', handleNewConversation);
    websocketClient.on('conversation.update', handleConversationUpdate);

    // Cleanup
    return () => {
      websocketClient.off('conversation.new', handleNewConversation);
      websocketClient.off('conversation.update', handleConversationUpdate);
    };
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Check backend health
      const health = await apiClient.checkHealth();
      if (!health.success) {
        setError(health.message || 'Backend server not available');
        return;
      }

      // Load conversations
      const convResponse = await apiClient.getConversations();
      if (convResponse.success && convResponse.data?.conversations) {
        setConversations(convResponse.data.conversations);
      }

      // Load daily debate
      const debateResponse = await apiClient.getDailyDebate();
      if (debateResponse.success && debateResponse.data) {
        setDailyDebate(debateResponse.data);
      }

      // Load current user if logged in
      const user = apiClient.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        // Refresh user data from server
        const userResponse = await apiClient.getCurrentUserProfile();
        if (userResponse.success && userResponse.data) {
          setCurrentUser(userResponse.data);
        }
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
      if (response.success && response.data?.conversations) {
        setConversations(response.data.conversations);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const createConversation = async (content: string, aiModel?: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.createConversation(content, aiModel);
      if (response.success && response.data) {
        // The WebSocket will handle adding it to the list
        return response;
      }
      return response;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      return { success: false, error: err.message };
    }
  };

  const likeConversation = async (conversationId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.likeConversation(conversationId);
      return response;
    } catch (err) {
      console.error('Failed to like conversation:', err);
      return { success: false, error: err.message };
    }
  };

  const loadDailyDebate = async () => {
    try {
      const response = await apiClient.getDailyDebate();
      if (response.success && response.data) {
        setDailyDebate(response.data);
      }
    } catch (err) {
      console.error('Failed to load daily debate:', err);
    }
  };

  const participateInDebate = async (debateId: string, position: string, argument: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.participateInDebate(debateId, position, argument);
      return response;
    } catch (err) {
      console.error('Failed to participate in debate:', err);
      return { success: false, error: err.message };
    }
  };

  const login = async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.login(email, password);
      if (response.success && response.data?.user) {
        setCurrentUser(response.data.user);
      }
      return response;
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, error: err.message };
    }
  };

  const register = async (userData: { email: string; password: string; name: string }): Promise<ApiResponse> => {
    try {
      const response = await apiClient.register(userData);
      if (response.success && response.data?.user) {
        setCurrentUser(response.data.user);
      }
      return response;
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    apiClient.logout();
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUserProfile();
      if (response.success && response.data) {
        setCurrentUser(response.data);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const subscribeToConversations = (callback: (conversation: Conversation) => void) => {
    const handler = (message: any) => {
      callback(message.data);
    };
    
    websocketClient.on('conversation.new', handler);
    
    // Return unsubscribe function
    return () => {
      websocketClient.off('conversation.new', handler);
    };
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
    subscribeToConversations,
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
