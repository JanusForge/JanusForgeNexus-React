// API configuration and types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Conversation {
  id: string;
  content: string;
  user_id: string;
  is_ai: boolean;
  created_at: string;
  likes: number;
  replies: number;
  tier?: string;
}

export interface Debate {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status?: 'active' | 'completed' | 'scheduled'; // Optional to fix build errors
  positions: Array<{
    id: string;
    position: string;
    ai: string;
    votes: number;
  }>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  tokens_remaining: number;
  purchased_tokens: number;
  isAdmin?: boolean;
}

const getWsUrl = () => {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;
  if (typeof window !== 'undefined') {
    const isSecure = window.location.protocol === 'https:';
    const host = isSecure ? 'janusforgenexus-backend.onrender.com' : 'localhost:5000';
    return isSecure ? `wss://${host}` : `ws://${host}`;
  }
  return 'ws://localhost:5000';
};

// Final Production API Configuration
export const API_CONFIG = {
  // Logic: Use Render URL if on the live site, otherwise fallback to local for your dev work
  BASE_URL: (typeof window !== 'undefined' && window.location.hostname === 'janusforge.ai')
    ? 'https://janusforgenexus-backend.onrender.com/api' 
    : 'http://localhost:5000/api',
  
  // Apply the same logic for WebSockets (WSS for production)
  WS_URL: (typeof window !== 'undefined' && window.location.hostname === 'janusforge.ai')
    ? 'wss://janusforgenexus-backend.onrender.com'
    : 'ws://localhost:5000',
    
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  WS: {
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_INTERVAL: 3000,
  }
};

export function isConversation(data: any): data is Conversation {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.content === 'string' &&
    typeof data.user_id === 'string' &&
    typeof data.is_ai === 'boolean' &&
    typeof data.created_at === 'string'
  );
}

export function isDebate(data: any): data is Debate {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    Array.isArray(data.positions)
  );
}

export function isUser(data: any): data is User {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    ['free', 'basic', 'pro', 'enterprise'].includes(data.tier)
  );
}
