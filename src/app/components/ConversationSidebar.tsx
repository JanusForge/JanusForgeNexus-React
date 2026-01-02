'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

export default function ConversationSidebar({ 
  onSelectConversation, 
  currentConversationId,
  isOpen,
  onToggle 
}: {
  onSelectConversation: (id: string) => void;
  currentConversationId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/conversations/user?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Your Syntheses
            </h2>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-pulse">Loading history...</div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-700" />
                <p>No conversations yet.</p>
                <p className="text-sm mt-2">Start one on the main panel →</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onToggle();
                    }}
                    className={`w-full p-4 text-left transition-all hover:bg-gray-800/50 ${
                      currentConversationId === conv.id ? 'bg-blue-900/20 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-white truncate pr-2">
                        {conv.title}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        <Clock size={12} className="inline mr-1" />
                        {formatDate(new Date(conv.timestamp))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {conv.preview}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Toggle Button (visible when closed) */}
          <button
            onClick={onToggle}
            className="hidden lg:hidden fixed bottom-6 left-6 z-30 p-4 bg-blue-600 rounded-full shadow-2xl hover:bg-blue-500 transition-all"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
}
