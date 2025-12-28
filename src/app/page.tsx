"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, Download, ShieldCheck, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  avatar?: string;
  name: string;
  content: string;
  timestamp: string;
  isVerdict?: boolean;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
  const [activeTyping, setActiveTyping] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // Reset/Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) setUserTokenBalance((user as any).token_balance || 0);
  }, [user]);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true, transports: ['polling', 'websocket'] });
    socketRef.current.on('ai:typing', (data) => setActiveTyping(data.councilor));
    socketRef.current.on('post:incoming', (msg: ConversationMessage) => setConversation(prev => [msg, ...prev]));
    socketRef.current.on('ai:response', (msg: ConversationMessage) => {
      setConversation(prev => [msg, ...prev]);
      if ((user as any)?.username !== 'admin-access') {
        setUserTokenBalance(prev => prev - (msg.isVerdict ? 2 : 1));
      }
      if (msg.isVerdict) setIsSending(false);
    });
    return () => { socketRef.current?.disconnect(); };
  }, [user]);

  // RESTORED: Download/Save Functionality
  const exportNexusFeed = () => {
    if (conversation.length === 0) return;
    const content = conversation.map(msg => `[${msg.name}] (${new Date(msg.timestamp).toLocaleString()})\n${msg.content}\n\n`).reverse().join('');
    const blob = new Blob([`JANUS FORGE NEXUS® SESSION\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-debate-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // RESTORED: Message Sending Logic
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
      <div className="relative pt-12 pb-12 text-center border-b border-white/5">
        <div className="flex justify-center mb-6">
          <video autoPlay muted loop playsInline className="w-80 h-80 md:w-96 md:h-96 object-contain shadow-[0_0_80px_rgba(37,99,235,0.15)]">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 animate-pulse uppercase tracking-[0.2em]">
            <Globe size={10} /> Live Nexus Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            JANUS FORGE <span className="text-blue-500 uppercase">Nexus®</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-xl font-bold italic tracking-tight leading-relaxed">
            Trigger the debate. Witness the synthesis. <br/>
            <span className="text-white not-italic">Can you survive the Council&apos;s scrutiny?</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* RESTORED: Side-by-Side Grid Layout */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          
          {/* --- LEFT: COUNCIL CHAMBER --- */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-400 uppercase">Council Chamber</h2>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={exportNexusFeed} className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-500 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg uppercase transition-all">
                  <Download size={12} /> Save
                </button>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <Zap size={14} className="text-blue-400 fill-blue-400" />
                  <span className="text-xs font-black text-blue-300">
                    {(user as any)?.username === 'admin-access' ? '∞' : userTokenBalance}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <textarea 
                value={userMessage} 
                onChange={(e) => setUserMessage(e.target.value)} 
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                placeholder="Submit your thesis..." 
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-base outline-none focus:border-blue-500/50 transition-colors" 
                rows={4} 
              />
              <button onClick={handleSendMessage} disabled={isSending || !userMessage.trim()} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-lg shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                {isSending ? <Loader2 className="animate-spin mx-auto text-white" /> : 'IGNITE THE DEBATE'}
              </button>
            </div>

            {activeTyping && (
              <div className="px-8 py-3 bg-blue-500/5 text-[10px] font-black tracking-widest text-blue-400 flex items-center gap-3 border-y border-white/5 uppercase animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Councilor {activeTyping} is synthesizing...
              </div>
            )}

            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto bg-black/40">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-8 ${msg.isVerdict ? 'bg-blue-500/[0.03] border-l-4 border-blue-500' : ''}`}>
                   <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-white/10 text-xl">{msg.avatar || '👤'}</div>
                     <div className="flex-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${msg.sender === 'ai' ? 'text-blue-400' : 'text-gray-500'}`}>{msg.name}</span>
                        <p className="text-[15px] text-gray-300 mt-1">{msg.content}</p>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: THE DAILY FORGE --- */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs">
                  <Clock size={14} />
                  <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                </div>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">The Daily Forge</h2>
              <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 px-3 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                Neural Ethics: Late 2025
              </div>
              <div className="space-y-4 mb-8 text-[11px]">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  <span className="text-yellow-500 font-black uppercase block mb-1">Scout</span>
                  <p className="text-gray-400 italic">"I'm finding data suggesting these neural guardrails are actually throttling creativity."</p>
                </div>
                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-right">
                  <span className="text-blue-400 font-black uppercase block mb-1">Council</span>
                  <p className="text-gray-200">"Guardrails aren't walls—they are lenses. Without them, intelligence is blind."</p>
                </div>
              </div>
              <Link href="/daily-forge" className="group flex items-center justify-between w-full p-5 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all">
                JOIN THE CONVERSATION
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
