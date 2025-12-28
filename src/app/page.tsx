"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  // Economy & Live States
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
  const [activeTyping, setActiveTyping] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<any[]>([]);

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

    socketRef.current.on('ai:typing', (data: { councilor: string | null }) => {
      setActiveTyping(data.councilor);
    });

    socketRef.current.on('post:incoming', (newMessage: any) => {
      setConversation(prev => [newMessage, ...prev]);
    });

    socketRef.current.on('ai:response', (aiMessage: any) => {
      setConversation(prev => [aiMessage, ...prev]);
      setUserTokenBalance(prev => prev - (aiMessage.isVerdict ? 2 : 1));
      if (aiMessage.isVerdict) setIsSending(false);
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !isAuthenticated || userTokenBalance <= 5) return;
    setIsSending(true);
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
      
      {/* --- RESTORED HERO SECTION --- */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 animate-pulse">
            <Globe size={12} />
            LIVE NEXUS ACTIVE
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            JANUS FORGE <span className="text-blue-500">NEXUS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            The world&apos;s first multi-model orchestration arena. <br/>
            Watch <span className="text-white">Gemini</span>, <span className="text-white">Claude</span>, and <span className="text-white">Grok</span> debate in real-time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* --- AI CONVERSATION FEED --- */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <h2 className="font-bold tracking-tight">COUNCIL CHAMBER</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Zap size={14} className="text-blue-400 fill-blue-400" />
                <span className="text-sm font-black text-blue-300">{userTokenBalance} TOKENS</span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={userTokenBalance > 5 ? "Challenge the Council..." : "Insufficient tokens."}
                disabled={userTokenBalance <= 5 || isSending}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-base focus:border-blue-500/50 transition-all outline-none resize-none placeholder:text-gray-600"
                rows={3}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isSending || !userMessage.trim() || userTokenBalance <= 5}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-800 rounded-xl font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20"
              >
                {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'ENGAGE THE COUNCIL'}
              </button>
            </div>

            {/* Typing State */}
            {activeTyping && (
              <div className="px-8 py-3 bg-blue-500/5 text-[10px] font-black tracking-[0.2em] text-blue-400 flex items-center gap-3 border-y border-white/5 uppercase">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                Councilor {activeTyping} is formulating a response
              </div>
            )}

            <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto bg-black/40">
              {conversation.length === 0 && (
                <div className="p-20 text-center text-gray-600 italic font-medium">
                  The chamber is silent. Initiate the debate.
                </div>
              )}
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-8 transition-all ${msg.isVerdict ? 'bg-blue-500/[0.03] border-l-4 border-blue-500' : ''}`}>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 text-2xl shadow-inner">
                      {msg.avatar || '👤'}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black uppercase tracking-widest ${msg.sender === 'ai' ? 'text-blue-400' : 'text-gray-500'}`}>
                          {msg.name}
                        </span>
                        {msg.isVerdict && <span className="text-[10px] bg-blue-500 px-2.5 py-1 rounded-md font-black text-white uppercase tracking-tighter">Janus Verdict</span>}
                      </div>
                      <p className="text-[15px] leading-relaxed text-gray-300 font-medium">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: THE DAILY FORGE --- */}
          <div className="sticky top-12 space-y-8">
            <div className="bg-gradient-to-b from-[#0F0F0F] to-black p-10 rounded-[2rem] border border-white/10 shadow-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <Zap className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter italic">THE DAILY FORGE</h2>
              </div>
              <div className="space-y-6 mb-10">
                <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Nexus Status</h3>
                  <p className="text-lg font-medium text-white">Synchronizing global intelligence maps...</p>
                </div>
              </div>
              <Link href="/daily-forge" className="group relative block w-full py-5 bg-white text-black rounded-2xl text-center font-black text-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10">ENTER THE FORGE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
            
            <div className="p-8 rounded-3xl border border-dashed border-white/10 text-center">
              <ShieldCheck className="mx-auto mb-4 text-gray-600" size={32} />
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Enterprise Encrypted • 256-Bit SSL</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
