// src/app/page.tsx
"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Loader2, Globe, ShieldCheck, Radio, Info, Coins, Menu, PlusCircle, Share2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import ShareDropdown from '@/components/ShareDropdown';
import ConversationSidebar from '@/app/components/ConversationSidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  name: string;
  content: string;
  timestamp: string;
  tokens_remaining?: number;
  conversationId?: string;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const DEBATE_COST = 3;
  const isOwner = user?.email === 'admin@janusforge.ai';
  const canAfford = (tokensRemaining >= DEBATE_COST) || isOwner;

  // 1. Initialize Socket
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true, transports: ['polling', 'websocket'] });

    socketRef.current.on('post:incoming', (msg: ConversationMessage) => {
      setConversation(prev => {
        if (prev.some(p => p.id === msg.id)) return prev;
        return [msg, ...prev];
      });
      if (msg.tokens_remaining !== undefined) setTokensRemaining(msg.tokens_remaining);
      setIsSending(false);
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 2. Room Switching Logic
  useEffect(() => {
    if (currentConversationId && socketRef.current) {
      socketRef.current.emit('join', { conversationId: currentConversationId });
      setConversation([]); 
      loadHistory(currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    if (user) setTokensRemaining(user.tokens_remaining || 0);
  }, [user]);

  const loadHistory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/${id}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const formatted = data.conversation.posts.map((p: any) => ({
          id: p.id,
          name: p.is_human ? (user?.username || 'user') : (p.ai_model || 'Council'),
          content: p.content,
          sender: p.is_human ? 'user' : 'ai',
          timestamp: p.created_at
        }));
        setConversation(formatted.reverse());
      }
    } catch (err) { console.error("History load error", err); }
  };

  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !user || !currentConversationId || !canAfford) return;
    setIsSending(true);
    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user.id,
      conversationId: currentConversationId
    });
    setUserMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      <ConversationSidebar
        onSelectConversation={setCurrentConversationId}
        currentConversationId={currentConversationId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">Live Nexus <span className="text-blue-500">Showdown</span></h1>

          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Radio className="text-red-500 animate-pulse" />
                <div>
                  <span className="font-bold uppercase text-sm tracking-widest block">Frontier Synthesis</span>
                  <span className="text-[10px] text-gray-500 uppercase font-mono">2026 Reasoning Engine Active</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 border rounded-full text-xs font-bold ${!canAfford ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                  {isOwner ? '∞' : tokensRemaining} Tokens
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-800">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Owner: Interject freely..." : "Submit query to Council (3 Tokens)..."}
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white min-h-[100px] outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isSending || !userMessage.trim() || !canAfford}
                className={`w-full mt-4 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${canAfford ? 'bg-blue-600 hover:bg-blue-500' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {isSending ? <Loader2 className="animate-spin mx-auto" /> : canAfford ? 'Execute Synthesis' : 'Insufficient Tokens'}
              </button>
              {!isOwner && <p className="text-[9px] text-center mt-2 text-zinc-600 uppercase tracking-widest font-bold italic">High-Compute synthesis triggers 5 frontier models</p>}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {conversation.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'opacity-90' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {msg.name[0]}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-gray-500 mb-1">{msg.name}</div>
                    <div className="text-sm text-gray-300 bg-white/5 p-4 rounded-2xl rounded-tl-none">{msg.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
