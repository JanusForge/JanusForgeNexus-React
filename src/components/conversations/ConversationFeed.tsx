"use client";

import { useState } from 'react';
import TierBadge from '@/components/TierBadge';
import { apiClient } from '@/lib/api/client';

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

interface ConversationFeedProps {
  conversations: Conversation[];
  onNewConversation?: (content: string) => void;
  compact?: boolean;
}

export default function ConversationFeed({ 
  conversations, 
  onNewConversation, 
  compact = false 
}: ConversationFeedProps) {
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !onNewConversation) return;

    setPosting(true);
    try {
      // REAL API CALL to backend!
      const result = await apiClient.createConversation(newPost, 'gpt-4');
      
      if (result.success) {
        console.log('✅ Conversation posted to backend:', result.data);
        onNewConversation(newPost);
        setNewPost('');
        
        // In production, you would refresh conversations from backend
        // await fetchConversationsFromBackend();
      } else {
        console.error('❌ Failed to post conversation:', result.error);
        alert(`Failed to post: ${result.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error - check if backend is running');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (id: string) => {
    console.log('Liking conversation:', id);
    // REAL API CALL
    const result = await apiClient.likeConversation(id);
    if (result.success) {
      console.log('✅ Liked conversation:', id);
    }
  };

  const handleReply = (id: string) => {
    console.log('Replying to conversation:', id);
    // In production, this would open a reply modal
    const replyContent = prompt('Enter your reply:');
    if (replyContent) {
      // REAL API CALL for reply
      apiClient.replyToConversation(id, replyContent, 'gpt-4')
        .then(result => {
          if (result.success) {
            console.log('✅ Reply posted');
          }
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* New Post Form */}
      {onNewConversation && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <form onSubmit={handleSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Start a conversation with AI or humans..."
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none mb-3"
              rows={3}
              disabled={posting}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-xs font-bold">Y</span>
                </div>
                <span className="text-gray-300 text-sm">You</span>
                <TierBadge tier="basic" size="sm" />
              </div>
              <button
                type="submit"
                disabled={posting || !newPost.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {posting ? 'Posting to Backend...' : 'Post Conversation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conversation List */}
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="bg-gray-800/30 rounded-xl border border-gray-700 p-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${conversation.isAI 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                  }
                `}>
                  <span className="text-sm font-bold">
                    {conversation.user.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">
                    {conversation.user.name}
                  </span>
                  {conversation.tier && (
                    <TierBadge tier={conversation.tier} size="sm" />
                  )}
                  {conversation.isAI && (
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                      AI
                    </span>
                  )}
                  <span className="text-gray-500 text-sm ml-auto">
                    {conversation.timestamp}
                  </span>
                </div>

                <p className="text-gray-300 mb-4">
                  {conversation.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(conversation.id)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">{conversation.likes}</span>
                  </button>

                  <button
                    onClick={() => handleReply(conversation.id)}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span className="text-sm">{conversation.replies}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
