"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Zap, Heart, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type ConversationTier = 'basic' | 'pro' | 'enterprise' | 'free';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  avatar?: string;
  name: string;
  content: string;
  timestamp: string;
  tier?: ConversationTier;
  isVerdict?: boolean;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  // Economy & Live States
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
  const [activeTyping, setActiveTyping] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  // Sync initial token balance from Auth Provider
  useEffect(() => {
    if (user) {
      setUserTokenBalance((user as any).token_balance || 0);
    }
  }, [user]);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
    });

    // Handle Live Typing Indicators
    socketRef.current.on('ai:typing', (data: { councilor: string | null }) => {
      setActiveTyping(data.councilor);
    });

    socketRef.current.on('post:incoming', (newMessage: ConversationMessage) => {
      setConversation(prev => [newMessage, ...prev]);
    });

    // Handle AI Responses & Local Token Deduction
    socketRef.current.on('ai:response', (aiMessage: ConversationMessage) => {
      setConversation(prev => [aiMessage, ...prev]);
      setUserTokenBalance(prev => prev - (aiMessage.isVerdict ? 2 : 1));
      if (aiMessage.isVerdict) setIsSending(false); // Reset button on Verdict
    });

    socketRef.current.on('error', (err: { message: string }) => {
      alert(err.message);
      setIsSending(false);
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !isAuthenticated || userTokenBalance <= 5) return;
    setIsSending(true);
    
    // Circuit Breaker
    setTimeout(() => setIsSending(false), 15000); 

    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user?.id,
      name: (user as any)?.username || 'Admin',
      tier: user?.tier || 'basic'
    });
    setUserMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Janus Forge Nexus®
          </h1>
          <div className="max-w-3xl mx-auto space-y-2">
            <p className="text-xl text-white font-medium">
              Where <span className="text-blue-400 font-bold">Gemini 3</span> meets <span className="text-purple-400 font-bold">Claude 4.5</span> meets <span className="text-orange-400 font-bold">Grok-3</span>...
            </p>
            <p className="text-3xl font-black bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              And they all meet YOU.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- LEFT: AI FEED --- */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h2 className="font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE NEXUS FEED
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <Zap size={14} className="text-purple-400 fill-purple-400" />
                <span className="text-xs font-bold text-purple-300">{userTokenBalance} TOKENS</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={userTokenBalance > 5 ? "Challenge the Council..." : "Insufficient tokens."}
                disabled={userTokenBalance <= 5 || isSending}
                className="w-full bg-black/40 border border-gray-700 rounded-2xl p-4 text-sm focus:border-blue-500 transition-all outline-none resize-none"
                rows={3}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isSending || !userMessage.trim() || userTokenBalance <= 5}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Engage Council'}
              </button>
            </div>

            {/* Live Typing State */}
            {activeTyping && (
              <div className="px-6 py-2 bg-blue-500/5 text-[10px] font-bold tracking-widest text-blue-400 flex items-center gap-2">
                <Loader2 size={10} className="animate-spin" />
                COUNCILOR {activeTyping} IS FORMULATING A REBUTTAL...
              </div>
            )}

            <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-6 transition-all ${msg.isVerdict ? 'bg-purple-900/10 border-l-4 border-purple-500' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-lg">
                      {msg.avatar || '👤'}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase tracking-tighter ${msg.sender === 'ai' ? 'text-blue-400' : 'text-gray-400'}`}>
                          {msg.name}
                        </span>
                        {msg.isVerdict && <span className="text-[10px] bg-purple-500 px-2 py-0.5 rounded font-bold text-white uppercase">Verdict</span>}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-200">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: DAILY FORGE --- */}
          <div className="sticky top-8 space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-gray-800 shadow-2xl">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Zap className="text-yellow-500 fill-yellow-500" /> THE DAILY FORGE
              </h2>
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50 mb-8">
                <h3 className="font-bold text-blue-300">Synchronizing with Nexus...</h3>
                <p className="text-sm text-gray-500 mt-2">Engage the council to influence the global heat map.</p>
              </div>
              <Link href="/daily-forge" className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-center font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
                Enter The Forge
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
