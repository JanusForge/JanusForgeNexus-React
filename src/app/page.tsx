"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, Download } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-12 pb-16 text-center border-b border-white/5">
        
        {/* LOGO VIDEO: Moved outside and above the badge */}
        <div className="flex justify-center mb-6">
          <video autoPlay muted loop playsInline className="w-24 h-24 md:w-32 md:h-32 object-contain">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 animate-pulse">
            <Globe size={12} />
            LIVE NEXUS ACTIVE
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            JANUS FORGE <span className="text-blue-500">NEXUS®</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-12">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="font-bold uppercase text-xs">Council Chamber</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Zap size={14} className="text-blue-400 fill-blue-400" />
                <span className="text-sm font-black text-blue-300">
                  {(user as any)?.username === 'admin-access' ? '∞' : userTokenBalance}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Challenge the Council..." disabled={isSending} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-base focus:border-blue-500 transition-all outline-none resize-none" rows={3} />
            <button onClick={handleSendMessage} disabled={isSending || !userMessage.trim()} className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black text-lg transition-all active:scale-95">
              {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'ENGAGE THE COUNCIL'}
            </button>
          </div>

          {activeTyping && (
            <div className="px-8 py-3 bg-blue-500/5 text-[10px] font-black tracking-widest text-blue-400 flex items-center gap-3 border-y border-white/5 uppercase animate-pulse">
              <Loader2 size={10} className="animate-spin" /> Councilor {activeTyping} is formulating a response
            </div>
          )}

          <div className="divide-y divide-white/5 max-h-[700px] overflow-y-auto bg-black/40">
            {conversation.map((msg) => (
              <div key={msg.id} className={`p-8 ${msg.isVerdict ? 'bg-blue-500/[0.03] border-l-4 border-blue-500' : ''}`}>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center border border-white/10 text-2xl">{msg.avatar || '👤'}</div>
                  <div className="flex-1 space-y-2 text-sm">
                    <span className={`text-xs font-black uppercase tracking-widest ${msg.sender === 'ai' ? 'text-blue-400' : 'text-gray-500'}`}>{msg.name}</span>
                    <p className="text-gray-300 font-medium leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
