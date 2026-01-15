"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { MessageSquare, Clock, Users, Heart, MessageCircle, Loader2 } from 'lucide-react';

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
  // ✅ REPAIR: Destructure 'loading' instead of 'isAuthenticated'
  const { user, loading: authLoading } = useAuth();
  
  // ✅ REPAIR: Locally derive authentication status
  const isAuthenticated = !!user;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      // Don't fetch until auth state is determined
      if (authLoading) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch (err) {
        console.error("Failed to load feed:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchConversations();
  }, [authLoading, user]);

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

  // 🔄 REPAIR: Sync loading states
  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Retrieving Syntheses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Public Syntheses</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Open Council Archives</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={handleNewConversation}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-purple-600/20"
          >
            <MessageSquare size={16} fill="white" />
            Start New Debate
          </button>
        )}
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/20 border border-white/5 rounded-[3rem]">
          <div className="p-6 bg-zinc-900/50 inline-block rounded-3xl mb-6">
            <MessageSquare size={48} className="text-zinc-800" />
          </div>
          <p className="text-zinc-500 uppercase font-black text-xs tracking-widest">The archives are empty.</p>
          {isAuthenticated && (
            <p className="text-purple-500/60 font-bold text-[10px] uppercase mt-2 italic">Be the architect of the first synthesis.</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {conversations.map((conv) => (
            <div key={conv.id} className="group bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors italic">{conv.title}</h3>
                <span className="text-[10px] font-mono text-zinc-600">{new Date(conv.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed line-clamp-2">{conv.preview}</p>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                  <Users size={14} className="text-zinc-400" />
                  <span className="text-[10px] font-black uppercase text-zinc-300">{conv.participants} Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-zinc-600 group-hover:text-red-500 transition-colors" />
                  <span className="text-[10px] font-black text-zinc-500">{conv.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-black text-zinc-500">{conv.replies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
