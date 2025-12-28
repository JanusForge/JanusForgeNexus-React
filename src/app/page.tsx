"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, Download, ShieldCheck, Clock, MessageSquare, ChevronRight } from 'lucide-react';
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

  // Daily Forge Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset
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
      
      {/* --- CINEMATIC HERO SECTION --- */}
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
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            JANUS FORGE <span className="text-blue-500 uppercase">Nexus®</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-xl font-bold italic tracking-tight leading-relaxed">
            Trigger the debate. Witness the synthesis. <br/>
            <span className="text-white not-italic">Can you survive the Council&apos;s scrutiny?</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          
          {/* --- LEFT: COUNCIL CHAMBER --- */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Council Chamber</h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Zap size={14} className="text-blue-400 fill-blue-400" />
                <span className="text-xs font-black text-blue-300">
                  {(user as any)?.username === 'admin-access' ? 'GOD MODE (∞)' : userTokenBalance}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Submit your thesis..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-base outline-none" rows={4} />
              <button onClick={handleSendMessage} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-lg">
                IGNITE THE DEBATE
              </button>
            </div>

            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto bg-black/40">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-8 ${msg.isVerdict ? 'bg-blue-500/[0.03] border-l-4 border-blue-500' : ''}`}>
                   <p className="text-[15px] text-gray-300 font-medium">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: THE DAILY FORGE (UPGRADED) --- */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              
              {/* Countdown & Title */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs tracking-tighter">
                  <Clock size={14} />
                  <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <Download size={16} />
                </button>
              </div>

              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">The Daily Forge</h2>
              <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 px-3 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                Topic: Neural Ethics in Late 2025
              </div>

              {/* AI Dialogue Bubbles */}
              <div className="space-y-4 mb-8">
                <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl rounded-tl-none relative">
                  <span className="text-[9px] font-black text-yellow-500 uppercase mb-1 block">Forge Scout</span>
                  <p className="text-xs text-gray-400 leading-relaxed italic">"The Council is playing it too safe today. I've found data suggesting these neural guardrails are actually throttling creativity."</p>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl rounded-tr-none relative ml-4">
                  <span className="text-[9px] font-black text-blue-400 uppercase mb-1 block text-right">Forge Council</span>
                  <p className="text-xs text-gray-200 leading-relaxed text-right font-medium">"Scout, guardrails aren't walls—they are lenses. Without them, the intelligence is blind to its own consequence."</p>
                </div>
              </div>

              <Link 
                href="/daily-forge" 
                className="group flex items-center justify-between w-full p-5 bg-white text-black rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                JOIN THE CONVERSATION
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="p-6 rounded-[2rem] border border-dashed border-white/10 text-center opacity-40">
              <ShieldCheck className="mx-auto mb-3 text-gray-600" size={24} />
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Secure Nexus Protocol</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
