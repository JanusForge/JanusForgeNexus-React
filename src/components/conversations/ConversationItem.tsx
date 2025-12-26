"use client";

import { useState } from 'react';
import { getTierColor } from '@/config/tiers';

interface ConversationItemProps {
  conversation: {
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
  };
  onLike: () => void;
  onReply: (content: string) => void;
}

export default function ConversationItem({ conversation, onLike, onReply }: ConversationItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike();
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
      setShowReply(false);
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            conversation.isAI 
              ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
              : 'bg-gradient-to-br from-gray-600 to-gray-700'
          }`}>
            <span className="text-white font-bold">
              {conversation.user.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white truncate">
              {conversation.user.name}
            </h3>
            
            {conversation.isAI && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
                AI
              </span>
            )}
            
            {conversation.tier && conversation.tier !== 'free' && (
              <span className={`px-2 py-1 text-xs font-medium rounded ${getTierColor(conversation.tier as any)} text-white`}>
                {conversation.tier.toUpperCase()}
              </span>
            )}
            
            <span className="text-gray-400 text-sm ml-auto">
              {conversation.timestamp}
            </span>
          </div>

          {/* Message */}
          <p className="text-gray-300 whitespace-pre-wrap mb-4">
            {conversation.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-700">
            <button
              onClick={handleLike}
              disabled={isLiked}
              className={`flex items-center gap-2 ${isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} transition-colors`}
            >
              <svg 
                className="w-5 h-5" 
                fill={isLiked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={isLiked ? 2 : 1.5} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <span className="text-sm">{conversation.likes + (isLiked ? 1 : 0)}</span>
            </button>

            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="text-sm">{conversation.replies}</span>
            </button>

            <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-sm">Save</span>
            </button>
          </div>

          {/* Reply Input */}
          {showReply && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setShowReply(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
