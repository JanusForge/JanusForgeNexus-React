export const API_CONFIG = {
  // Development: Local backend
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // Timeout settings
  timeout: 30000,
  
  // Endpoints (based on what we discovered)
  endpoints: {
    health: '/api/health',
    test: '/api/test',
    // Note: Other endpoints will be mocked until implemented
  },
  
  // Headers
  headers: {
    'Content-Type': 'application/json',
  },
  
  // WebSocket configuration
  ws: {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
  },
};

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Conversation {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isAI: boolean;
  aiModel?: string;
  likes: number;
  replies: number;
  liked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Debate {
  id: string;
  topic: string;
  description: string;
  status: 'active' | 'completed' | 'upcoming';
  startTime: string;
  endTime: string;
  participants: number;
  aiCouncil: string[];
  positions: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  tokens: number;
  avatar?: string;
}
