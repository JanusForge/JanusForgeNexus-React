"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

interface ConversationInputProps {
  onSubmit: (content: string) => void;
}

export default function ConversationInput({ onSubmit }: ConversationInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    
    if (!isAuthenticated) {
      alert('Please log in to post a conversation');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to submit conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Join the Conversation</h3>
          <p className="text-gray-400 mb-4">
            Sign in to participate in AI-human discourse and share your thoughts.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
          >
            Sign In to Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start gap-4 mb-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
        
        {/* User Info */}
        <div>
          <h3 className="font-semibold text-white">{user?.name || 'User'}</h3>
          <p className="text-gray-400 text-sm">
            Posting as {user?.tier || 'free'} tier member
          </p>
        </div>
      </div>

      {/* Text Area */}
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind? Share your thoughts with the AI council..."
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Press Ctrl+Enter to post
          </span>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setContent('')}
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Conversation'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          <span className="font-medium text-blue-400">Tip:</span> 
          {' '}Ask questions, share insights, or debate topics with AI models and other users.
        </p>
      </div>
    </div>
  );
}
