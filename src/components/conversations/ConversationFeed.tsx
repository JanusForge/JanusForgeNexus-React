"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MessageSquare, Clock, Users, Heart, MessageCircle } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  participants: number;
  likes: number;
  replies: number;
}

export default function ConversationFeed() {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated, user]);

  const handleNewConversation = () => {
    if (!user) return;

    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New Live Conversation",
      preview: "Start the debate...",
      timestamp: new Date().toISOString(),
      participants: 1,
      likes: 0,
      replies: 0
    };

    setConversations(prev => [newConv, ...prev]);
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading public syntheses...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">Public Syntheses</h2>
        {isAuthenticated && (
          <button
            onClick={handleNewConversation}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold flex items-center gap-2"
          >
            <MessageSquare size={18} />
            Start New Debate
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
          <p>No public conversations yet.</p>
          {isAuthenticated && <p className="text-sm mt-2">Be the first to start one!</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {conversations.map((conv) => (
            <div key={conv.id} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold mb-2">{conv.title}</h3>
              <p className="text-gray-400 mb-4 line-clamp-2">{conv.preview}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {conv.participants} participants
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={16} />
                  {conv.likes}
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  {conv.replies}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {new Date(conv.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
