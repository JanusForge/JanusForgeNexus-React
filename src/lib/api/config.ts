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
