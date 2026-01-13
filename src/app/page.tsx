// src/app/page.tsx
"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Zap, Loader2, Radio } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
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
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden flex flex-col min-h-[700px]">
            {/* TOP INFO BAR */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-3">
                <Radio className="text-red-500 animate-pulse" />
                <div>
                  <span className="font-bold uppercase text-lg tracking-widest block">Frontier Synthesis</span>
                  <span className="text-[12px] text-gray-500 uppercase font-mono">Status: Nexus Online</span>
                </div>
              </div>
              <div className={`px-4 py-1.5 border rounded-full text-xs font-bold ${!canAfford ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                {isOwner ? '∞' : tokensRemaining} Tokens
              </div>
            </div>

            {/* CENTERED LOGO VIDEO & INPUT AREA */}
            <div className="p-8 border-b border-gray-800 bg-black/20 flex flex-col items-center">
              
              {/* CENTERED LOGO VIDEO */}
              <div className="mb-6 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-24 h-24 overflow-hidden rounded-full border-2 border-zinc-700 bg-black flex items-center justify-center">
                  <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                    <source src="/janus-logo-video.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 px-3 py-0.5 rounded-full border border-zinc-700">
                   <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Nexus-V3</span>
                </div>
              </div>

              {/* TEXTAREA */}
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Owner Mode: Interject freely..." : "Submit query to Council (3 Tokens)..."}
                className="w-full bg-black/60 border border-gray-700 rounded-2xl p-6 text-white min-h-[140px] outline-none focus:border-blue-500 transition-all placeholder:text-zinc-700 text-center"
              />
              
              <button
                onClick={handleSendMessage}
                disabled={isSending || !userMessage.trim() || !canAfford}
                className={`w-full max-w-md mt-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${canAfford ? 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
              >
                {isSending ? <Loader2 className="animate-spin mx-auto" /> : canAfford ? 'Initialize Showdown' : 'Insufficient Balance'}
              </button>
              
              {!isOwner && (
                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold mt-4">
                  Triggers adversarial synthesis across 5 frontier models
                </p>
              )}
            </div>

            {/* TRANSCRIPT AREA */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-700 italic">
                  <Zap size={24} className="mb-4 opacity-20" />
                  <p className="text-sm">Awaiting first interjection...</p>
                </div>
              ) : (
                conversation.map((msg) => (
                  <div key={msg.id} className={`flex gap-5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-xs font-bold border border-white/10">
                        {msg.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      <div className="text-[10px] uppercase font-black text-zinc-500 mb-1.5 tracking-widest">
                        {msg.name}
                      </div>
                      <div className={`text-sm leading-relaxed p-5 rounded-3xl ${
                        msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-zinc-800/50 text-zinc-300 rounded-tl-none border border-zinc-700'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold border border-white/10">
                        {msg.name[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
