// Janus Forge Nexus - Final Autonomous Production API Configuration

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
  status?: 'active' | 'completed' | 'scheduled';
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

/**
 * PRODUCTION DETECTION LOGIC
 * Automatically identifies if we are running on the live domain or Vercel.
 */
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'janusforge.ai' || 
   window.location.hostname === 'www.janusforge.ai' ||
   window.location.hostname.includes('vercel.app'));

export const API_CONFIG = {
  // Primary Bridge: Points to Render in production, localhost in development
  BASE_URL: isProduction
    ? 'https://janusforgenexus-backend.onrender.com'
    : 'http://localhost:5000',

  // Real-time Bridge: Secure WebSockets (WSS) for production
  WS_URL: isProduction
    ? 'wss://janusforgenexus-backend.onrender.com'
    : 'ws://localhost:5000',

  TIMEOUT: 60000, // 60-second AI response capacity
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  WS: {
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_INTERVAL: 3000,
  }
};

// --- Type Guards ---

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
