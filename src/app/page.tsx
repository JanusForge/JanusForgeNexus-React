"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, Download, ShieldCheck } from 'lucide-react';
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
    if (user) setUserTokenBalance((user as any).token_balance || 0);
  }, [user]);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true, transports: ['polling', 'websocket'] });
    socketRef.current.on('ai:typing', (data) => setActiveTyping(data.councilor));
    socketRef.current.on('post:incoming', (msg) => setConversation(prev => [msg, ...prev]));
    socketRef.current.on('ai:response', (msg) => {
      setConversation(prev => [msg, ...prev]);
      if ((user as any)?.username !== 'admin-access') {
        setUserTokenBalance(prev => prev - (msg.isVerdict ? 2 : 1));
      }
      if (msg.isVerdict) setIsSending(false);
    });
    return () => { socketRef.current?.disconnect(); };
  }, [user]);

  const exportNexusFeed = () => {
    const content = conversation.map(msg => `[${msg.name}] (${new Date(msg.timestamp).toLocaleString()})\n${msg.content}\n\n`).reverse().join('');
    const blob = new Blob([`JANUS FORGE NEXUS® SESSION\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-debate-${Date.now()}.txt`;
    link.click();
  };

  const handleSendMessage = () => {
    if (!userMessage.trim() || isSending || !isAuthenticated) return;
    setIsSending(true);
    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user?.id,
      name: (user as any)?.username || 'Admin'
    });
    setUserMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-16 pb-16 text-center border-b border-white/5">
        
        {/* SCALED LOGO VIDEO: Increased size to w-48 h-48 */}
        <div className="flex justify-center mb-8">
          <video autoPlay muted loop playsInline className="w-48 h-48 md:w-64 md:h-64 object-contain shadow-[0_0_50px_rgba(37,99,235,0.2)] rounded-full">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 animate-pulse uppercase tracking-widest">
            <Globe size={14} />
            Live Nexus Active
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            JANUS FORGE <span className="text-blue-500">NEXUS®</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-xl font-medium leading-relaxed">
            Archive your debates. Export the intelligence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* GRID CONTAINER: Restored 2-column layout */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          
          {/* --- LEFT: COUNCIL CHAMBER --- */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                <h2 className="font-black uppercase text-sm tracking-widest text-gray-200">Council Chamber</h2>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={exportNexusFeed} className="flex items-center gap-2 text-[11px] font-black tracking-widest text-gray-500 hover:text-white border border-white/10 px-4 py-2 rounded-xl uppercase bg-white/5 transition-all">
                  <Download size={14} /> Save Session
                </button>
                <div className="flex items-center gap-2 px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <Zap size={16} className="text-blue-400 fill-blue-400" />
                  <span className="text-sm font-black text-blue-300">
                    {(user as any)?.username === 'admin-access' ? '∞' : userTokenBalance}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Challenge the Council..." disabled={isSending} className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-lg focus:border-blue-500/50 transition-all outline-none resize-none placeholder:text-gray-700" rows={4} />
              <button onClick={handleSendMessage} disabled={isSending || !userMessage.trim()} className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/30 transition-all active:scale-95">
                {isSending ? <Loader2 className="animate-spin mx-auto text-white" /> : 'ENGAGE THE COUNCIL'}
              </button>
            </div>

            {activeTyping && (
              <div className="px-10 py-4 bg-blue-500/5 text-xs font-black tracking-widest text-blue-400 flex items-center gap-4 border-y border-white/5 uppercase animate-pulse">
                <Loader2 size={14} className="animate-spin" /> Councilor {activeTyping} is formulating a response
              </div>
            )}

            <div className="divide-y divide-white/5 max-h-[800px] overflow-y-auto bg-black/60">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-10 ${msg.isVerdict ? 'bg-blue-500/[0.04] border-l-8 border-blue-600' : ''}`}>
                  <div className="flex gap-8">
                    <div className="w-16 h-16 rounded-3xl bg-gray-900 flex items-center justify-center border border-white/10 text-3xl shadow-2xl">{msg.avatar || '👤'}</div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black uppercase tracking-widest ${msg.sender === 'ai' ? 'text-blue-400' : 'text-gray-500'}`}>{msg.name}</span>
                        {msg.isVerdict && <span className="text-[10px] bg-blue-600 px-3 py-1 rounded-lg font-black text-white uppercase tracking-widest">Verdict</span>}
                      </div>
                      <p className="text-[17px] text-gray-300 font-medium leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: THE DAILY FORGE (RESTORED) --- */}
          <div className="sticky top-12 space-y-10">
            <div className="bg-gradient-to-br from-[#0A0A0A] to-black p-12 rounded-[3rem] border border-white/10 shadow-3xl text-center">
              <div className="flex flex-col items-center gap-6 mb-10">
                <div className="p-5 bg-yellow-500/10 rounded-[2rem] border border-yellow-500/20">
                  <Zap className="text-yellow-500 fill-yellow-500" size={48} />
                </div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">The Daily Forge</h2>
              </div>
              <Link href="/daily-forge" className="group relative block w-full py-6 bg-white text-black rounded-[1.5rem] text-center font-black text-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5">
                <span className="relative z-10">ENTER THE FORGE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
            
            <div className="p-10 rounded-[2.5rem] border border-dashed border-white/10 text-center bg-white/[0.01]">
              <ShieldCheck className="mx-auto mb-6 text-gray-600" size={48} />
              <p className="text-sm font-black text-gray-600 uppercase tracking-[0.3em]">Enterprise Encrypted • 256-Bit SSL</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
