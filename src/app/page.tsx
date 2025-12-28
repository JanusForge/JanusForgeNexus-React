"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
// Added Video back to imports
温import { Zap, Loader2, ShieldCheck, Globe, Download, Video } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

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

  const exportNexusFeed = () => {
    if (conversation.length === 0) return;
    const content = conversation
      .map(msg => `[${msg.name}] (${new Date(msg.timestamp).toLocaleString()})\n${msg.content}\n\n`)
      .reverse()
      .join('');
    const blob = new Blob([`JANUS FORGE NEXUS® SESSION\nDate: ${new Date().toLocaleString()}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-debate-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
      
      {/* --- HERO SECTION WITH TRADEMARK --- */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 animate-pulse">
            <Video size={12} className="text-blue-400" /> {/* RESTORED VIDEO LOGO */}
            LIVE NEXUS ACTIVE
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            JANUS FORGE <span className="text-blue-500">NEXUS®</span> {/* RESTORED TRADEMARK */}
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            Archive your debates. Export the intelligence. <br/>
            The world&apos;s most advanced multi-model orchestration arena.
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
                <h2 className="font-bold tracking-tight uppercase text-xs flex items-center gap-2">
                  <Video size={14} className="text-gray-500" /> {/* SECONDARY VIDEO LOGO */}
                  Council Chamber
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={exportNexusFeed}
                  disabled={conversation.length === 0}
                  className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-500 hover:text-white disabled:opacity-30 transition-all border border-white/10 px-3 py-1.5 rounded-lg uppercase bg-white/5"
                >
                  <Download size={12} />
                  Save Session
                </button>
                
                <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <Zap size={14} className="text-blue-400 fill-blue-400" />
                  <span className="text-sm font-black text-blue-300">{userTokenBalance}</span>
                </div>
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

            {activeTyping && (
              <div className="px-8 py-3 bg-blue-500/5 text-[10px] font-black tracking-[0.2em] text-blue-400 flex items-center gap-3 border-y border-white/5 uppercase">
                <Loader2 size={10} className="animate-spin" />
                Councilor {activeTyping} is formulating a response
              </div>
            )}

            <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto bg-black/40">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-8 transition-all ${msg.isVerdict ? 'bg-blue-500/[0.03] border-l-4 border-blue-500' : ''}`}>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-white/10 text-2xl">
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

          <div className="sticky top-12 space-y-8">
            <div className="bg-gradient-to-b from-[#0F0F0F] to-black p-10 rounded-[2rem] border border-white/10 shadow-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                  <Zap className="text-yellow-500 fill-yellow-500" size={24} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter italic uppercase tracking-widest flex items-center gap-2">
                  THE DAILY FORGE
                </h2>
              </div>
              <Link href="/daily-forge" className="group relative block w-full py-5 bg-white text-black rounded-2xl text-center font-black text-xl overflow-hidden transition-all hover:scale-[1.02]">
                <span className="relative z-10">ENTER THE FORGE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
