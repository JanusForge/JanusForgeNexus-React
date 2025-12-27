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

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Type guard for Conversation
export function isConversation(data: any): data is Conversation {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.content === 'string' &&
    typeof data.user_id === 'string' &&
    typeof data.is_ai === 'boolean' &&
    typeof data.created_at === 'string' &&
    typeof data.likes === 'number' &&
    typeof data.replies === 'number'
  );
}

// Type guard for User
export function isUser(data: any): data is User {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    typeof data.name === 'string' &&
    ['free', 'basic', 'pro', 'enterprise'].includes(data.tier) &&
    typeof data.tokens_remaining === 'number' &&
    typeof data.purchased_tokens === 'number'
  );
}
