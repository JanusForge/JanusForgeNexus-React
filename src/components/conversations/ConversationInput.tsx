"use client";
import { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ConversationInput({ onSend }: { onSend: (message: string) => void }) {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isAuthenticated) {
      onSend(message.trim());
      setMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-900/50 border-t border-gray-800 text-center">
        <p className="text-gray-400">Please log in to join the conversation</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900/50 border-t border-gray-800">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="font-semibold text-white">{user?.username || 'Architect'}</h3>
            <p className="text-gray-400 text-sm">Active Nexus Member</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts with the Council..."
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl flex items-center gap-2 font-bold transition-colors"
            >
              <Send size={18} />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
