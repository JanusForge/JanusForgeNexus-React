// src/nexus/NexusPrimeEngine.tsx (Full File)

"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Loader2, X, Globe, ShieldCheck, Lock, Zap, ThumbsUp, Share2, ChevronRight } from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function NexusPrimeEngine() {
  const { user } = useAuth() as any;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userMessage, setUserMessage] = useState('');
  const [chatThread, setChatThread] = useState<any[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>("SYNCING...");
  const [isExpired, setIsExpired] = useState(true);
  const [observerCount, setObserverCount] = useState<number>(1);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStream = async () => {
      const res = await fetch(`${API_BASE_URL}/api/nexus/stream`);
      const data = await res.json();
      if (Array.isArray(data)) setChatThread(data);
    };
    fetchStream();
  }, []);

  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    socket.on('nexus:transmission', (msg) => {
      setChatThread(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg]);
      if (!msg.is_human) setIsSynthesizing(false);
    });
    socket.on('nexus:new_root', (root) => {
      if (!activeThreadId) setChatThread(prev => [root, ...prev]);
    });
    socket.on('pulse-update', (d) => setObserverCount(d.count));
    return () => { socket.disconnect(); };
  }, [activeThreadId]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!user?.access_expiry) { setTimeLeft("ACCESS REQUIRED"); setIsExpired(true); return; }
      const diff = new Date(user.access_expiry).getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft("EXPIRED"); setIsExpired(true); }
      else { 
        setIsExpired(false);
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${h}h ${m}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const handleIgnition = async () => {
    if (!userMessage.trim() || isSynthesizing) return;
    if (isExpired && user?.role !== 'ADMIN') { setIsTrayOpen(true); return; }

    const prompt = userMessage;
    setIsSynthesizing(true);
    setUserMessage('');

    const res = await fetch(`${API_BASE_URL}/api/nexus/ignite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        models: selectedModels,
        userId: user?.id,
        conversationId: activeThreadId
      }),
    });
    const data = await res.json();
    if (!activeThreadId && data.conversationId) setActiveThreadId(data.conversationId);
  };

  const displayMessages = activeThreadId
    ? chatThread.filter(m => m.conversation_id === activeThreadId)
    : chatThread.filter(m => !m.parent_post_id);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden font-sans">
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveThreadId(null)}>
          <Globe className="text-indigo-500 animate-pulse" size={18}/>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Janus Forge Nexus</span>
        </div>
        <button onClick={() => setIsTrayOpen(true)} className="px-5 py-2 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.3em]">
          {timeLeft}
        </button>
      </header>

      <main className="w-full max-w-4xl px-4 pt-32 pb-48">
        {!activeThreadId && (
          <div className="space-y-6 w-full animate-in fade-in duration-700">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-indigo-500 mb-8 uppercase text-center">Neural Pulse Feed</h2>
            {displayMessages.map((root) => (
              <div key={root.id} onClick={() => setActiveThreadId(root.conversation_id)} className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-indigo-500/50 transition-all cursor-pointer shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{root.name}</span>
                  <ChevronRight size={14} className="text-zinc-700" />
                </div>
                <p className="text-lg text-zinc-200 font-medium">{root.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeThreadId && (
          <div className="w-full animate-in slide-in-from-right-8 duration-500">
            <button onClick={() => setActiveThreadId(null)} className="mb-12 flex items-center gap-3 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
              <X size={14} /> Return to Neural Feed
            </button>
            <div className="space-y-12">
              {displayMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.is_human ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 text-zinc-500">{msg.name}</span>
                  <div className={`p-8 rounded-[2rem] border ${msg.is_human ? 'bg-zinc-900/40 border-white/10' : 'bg-zinc-950 border-white/5 shadow-2xl'}`}>
                    <p className="text-sm md:text-base text-zinc-200 leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-8 bg-gradient-to-t from-black via-black flex flex-col items-center z-[150]">
        <div onClick={() => isExpired && setIsTrayOpen(true)} className="w-full max-w-3xl border border-indigo-500/30 rounded-[3rem] p-3 flex items-center gap-4 bg-zinc-950 shadow-2xl">
          <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleIgnition()} placeholder={activeThreadId ? "Reply to thread..." : "Start new pattern..."} className="flex-1 bg-transparent outline-none p-3 text-sm text-white resize-none" />
          <button onClick={handleIgnition} className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center">
            {isSynthesizing ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Observers: {observerCount}</p>
      </footer>

      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
           <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10" onClick={e => e.stopPropagation()}>
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">Temporal Access</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{l: '24H', p: '$5', h: 24, id: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd'}].map((pass, i) => (
                  <button key={i} onClick={() => handleRefuel(pass.id, pass.h)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all">
                    <div className="text-[9px] font-black text-zinc-500">{pass.l}</div>
                    <div className="text-2xl font-black italic">{pass.p}</div>
                  </button>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
