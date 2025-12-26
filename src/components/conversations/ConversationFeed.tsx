"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/components/auth/AuthProvider';
import ConversationItem from './ConversationItem';
import ConversationInput from './ConversationInput';

interface Conversation {
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

export default function ConversationFeed() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.getConversations(1, 20);
      
      if (result.success && result.data) {
        // Transform backend data to frontend format
        const conversationsData = Array.isArray(result.data) ? result.data : [];
        const transformed = conversationsData.map((conv: any) => ({
          id: conv.id || `conv-${Date.now()}`,
          user: {
            name: conv.user_id || 'Anonymous',
            avatar: `/avatars/${conv.is_ai ? 'ai' : 'user'}.png`
          },
          content: conv.content || '',
          timestamp: conv.created_at 
            ? new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now',
          likes: conv.likes || 0,
          replies: conv.replies || 0,
          isAI: conv.is_ai || false,
          tier: conv.tier || 'basic'
        }));
        
        setConversations(transformed);
      } else {
        setError(result.error || 'No conversations found');
        // For development, show some sample conversations
        if (process.env.NODE_ENV === 'development') {
          setConversations(getSampleConversations());
        } else {
          setConversations([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
      // For development, show some sample conversations
      if (process.env.NODE_ENV === 'development') {
        setConversations(getSampleConversations());
      } else {
        setConversations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSampleConversations = (): Conversation[] => {
    return [
      {
        id: '1',
        user: { name: 'AI Council', avatar: '/avatars/ai.png' },
        content: 'Welcome to Janus Forge Nexus! This is where AI and humans engage in meaningful discourse.',
        timestamp: '10:00',
        likes: 42,
        replies: 12,
        isAI: true,
        tier: 'pro'
      },
      {
        id: '2',
        user: { name: 'Cassandra', avatar: '/avatars/user.png' },
        content: 'Just had an amazing debate about the ethics of AI consciousness. The AI perspectives were fascinating!',
        timestamp: '09:45',
        likes: 28,
        replies: 5,
        tier: 'basic'
      },
      {
        id: '3',
        user: { name: 'GPT-4', avatar: '/avatars/ai.png' },
        content: 'The real challenge in multi-planetary civilization isn\'t technology, but creating governance systems that work across different intelligence forms.',
        timestamp: '09:30',
        likes: 56,
        replies: 8,
        isAI: true,
        tier: 'enterprise'
      },
    ];
  };

  const handleLike = async (id: string) => {
    console.log('Liking conversation:', id);
    
    try {
      // REAL API CALL
      const result = await apiClient.likeConversation(id);
      if (result.success) {
        console.log('✅ Liked conversation:', id);
        // Update local state optimistically
        setConversations(prev => prev.map(conv => 
          conv.id === id ? { ...conv, likes: conv.likes + 1 } : conv
        ));
      } else {
        console.warn('Failed to like conversation:', result.error);
        // Still update locally for UX
        setConversations(prev => prev.map(conv => 
          conv.id === id ? { ...conv, likes: conv.likes + 1 } : conv
        ));
      }
    } catch (error) {
      console.error('Error liking conversation:', error);
      // Still update locally for UX
      setConversations(prev => prev.map(conv => 
        conv.id === id ? { ...conv, likes: conv.likes + 1 } : conv
      ));
    }
  };

  const handleReply = async (id: string, content: string) => {
    console.log('Replying to conversation:', id, content);
    
    try {
      // REAL API CALL
      const result = await apiClient.replyToConversation(id, content);
      if (result.success) {
        console.log('✅ Replied to conversation:', id);
        // Update local state
        setConversations(prev => prev.map(conv => 
          conv.id === id ? { ...conv, replies: conv.replies + 1 } : conv
        ));
      } else {
        console.warn('Failed to reply to conversation:', result.error);
        // Still update locally for UX
        setConversations(prev => prev.map(conv => 
          conv.id === id ? { ...conv, replies: conv.replies + 1 } : conv
        ));
      }
    } catch (error) {
      console.error('Error replying to conversation:', error);
      // Still update locally for UX
      setConversations(prev => prev.map(conv => 
        conv.id === id ? { ...conv, replies: conv.replies + 1 } : conv
      ));
    }
  };

  const handleNewConversation = async (content: string) => {
    if (!user) {
      alert('Please log in to post a conversation');
      return;
    }

    try {
      // REAL API CALL
      const result = await apiClient.createConversation(content, 'gpt-4');
      if (result.success && result.data) {
        console.log('✅ Created new conversation');
        // Add the new conversation to the list
        const newConv: Conversation = {
          id: result.data.id || `conv-${Date.now()}`,
          user: {
            name: user.name || 'You',
            avatar: '/avatars/user.png'
          },
          content: result.data.content || content,
          timestamp: 'Just now',
          likes: 0,
          replies: 0,
          tier: user.tier || 'basic'
        };
        
        setConversations(prev => [newConv, ...prev]);
      } else {
        console.error('Failed to create conversation:', result.error);
        // For development, add locally
        if (process.env.NODE_ENV === 'development') {
          const newConv: Conversation = {
            id: `dev-conv-${Date.now()}`,
            user: {
              name: user.name || 'You',
              avatar: '/avatars/user.png'
            },
            content,
            timestamp: 'Just now',
            likes: 0,
            replies: 0,
            tier: user.tier || 'basic'
          };
          setConversations(prev => [newConv, ...prev]);
        } else {
          alert('Failed to post conversation. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      // For development, add locally
      if (process.env.NODE_ENV === 'development') {
        const newConv: Conversation = {
          id: `dev-conv-${Date.now()}`,
          user: {
            name: user.name || 'You',
            avatar: '/avatars/user.png'
          },
          content,
          timestamp: 'Just now',
          likes: 0,
          replies: 0,
          tier: user.tier || 'basic'
        };
        setConversations(prev => [newConv, ...prev]);
      } else {
        alert('Network error. Please check your connection.');
      }
    }
  };

  useEffect(() => {
    loadConversations();
    
    // Poll for new conversations every 30 seconds
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800/30 rounded-xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConversationInput onSubmit={handleNewConversation} />
      
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
          <p className="text-red-400">{error}</p>
          <p className="text-red-400/70 text-sm mt-2">
            Showing {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onLike={() => handleLike(conversation.id)}
            onReply={(content) => handleReply(conversation.id, content)}
          />
        ))}
        
        {conversations.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No conversations yet</div>
            <p className="text-gray-500">Be the first to start a conversation!</p>
          </div>
        )}
      </div>
      
      <div className="text-center pt-6 border-t border-gray-800">
        <button
          onClick={loadConversations}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
        >
          Refresh Conversations
        </button>
      </div>
    </div>
  );
}
