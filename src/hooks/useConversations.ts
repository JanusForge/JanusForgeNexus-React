import { useState, useEffect, useCallback } from 'react';

// import { apiClient } from '@/lib/api/client';  // Commented out - backend module not in frontend repo

export interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isAI?: boolean;
  tier?: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const loadConversations = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const result = await apiClient.getConversations(1, 20);
  //     if (result.success && result.data) {
  //       const conversationsData = Array.isArray(result.data) ? result.data : [];
  //       const transformed = conversationsData.map((conv: any) => ({
  //         id: conv.id || `conv-${Date.now()}`,
  //         user: {
  //           name: conv.user_id || 'Anonymous',
  //           avatar: `/avatars/${conv.is_ai ? 'ai' : 'user'}.png`
  //         },
  //         content: conv.content || '',
  //         timestamp: conv.created_at
  //           ? new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  //           : 'Just now',
  //         likes: conv.likes || 0,
  //         replies: conv.replies || 0,
  //         isAI: conv.is_ai || false,
  //         tier: conv.tier || 'basic'
  //       }));
  //       setConversations(transformed);
  //     } else {
  //       setError(result.error || 'No conversations found');
  //       setConversations([]);
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Failed to load conversations');
  //     setConversations([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // const addConversation = useCallback(async (content: string) => {
  //   try {
  //     const result = await apiClient.createConversation(content, 'gpt-4');
  //     if (result.success && result.data) {
  //       const newConv: Conversation = {
  //         id: result.data.id || `conv-${Date.now()}`,
  //         user: {
  //           name: 'You',
  //           avatar: '/avatars/user.png'
  //         },
  //         content: result.data.content || content,
  //         timestamp: 'Just now',
  //         likes: 0,
  //         replies: 0,
  //         tier: 'basic'
  //       };
  //       setConversations(prev => [newConv, ...prev]);
  //       return true;
  //     } else {
  //       console.error('Failed to create conversation:', result.error);
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Failed to add conversation:', error);
  //     return false;
  //   }
  // }, []);

  // Static placeholder data (mock conversations) for development/production fallback
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setConversations([
        {
          id: 'placeholder-1',
          user: { name: 'Grok', avatar: '/avatars/ai.png' },
          content: 'Hello! How can I assist you today?',
          timestamp: 'Just now',
          likes: 5,
          replies: 2,
          isAI: true,
          tier: 'pro'
        },
        {
          id: 'placeholder-2',
          user: { name: 'You', avatar: '/avatars/user.png' },
          content: 'Exploring the Daily Forge topic...',
          timestamp: '2 minutes ago',
          likes: 3,
          replies: 1,
          isAI: false,
          tier: 'basic'
        }
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return {
    conversations,
    loading,
    error,
    // refresh: loadConversations,  // Commented out - no live fetch
    // addConversation              // Commented out - no live add
  };
}
