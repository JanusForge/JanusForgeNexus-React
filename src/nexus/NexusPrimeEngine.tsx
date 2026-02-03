"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Send, Loader2, X, Globe, ShieldCheck, Lock, Zap,
  ThumbsUp, Share2, Printer, Bookmark, ChevronRight, ArrowDown
} from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface NexusUser {
  id: string; username: string; email: string; role: string; access_expiry?: string | Date;
}

export default function NexusPrimeEngine() {
  const { user } = useAuth() as { user: NexusUser | null };
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- STATE ---
  const [userMessage, setUserMessage] = useState('');
  const [chatThread, setChatThread] = useState<any[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>("SYNCING...");
  const [isExpired, setIsExpired] = useState(true);
  const [nexusTime, setNexusTime] = useState<string>("");
  const [observerCount, setObserverCount] = useState<number>(0); 

  const [userIsAtBottom, setUserIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- HYDRATION ---
  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/nexus/stream`);
        const data = await res.json();
        if (Array.isArray(data)) setChatThread(data);
      } catch (err) { console.error("Sync Failed", err); }
    };
    fetchStream();
  }, []);

  // --- SOCKET ENGINE ---
  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    socket.on('nexus:transmission', (entry: any) => {
      setChatThread(prev => {
        // Strict deduplication to stop the double-posts seen in screenshots
        if (prev.find(m => m.id === entry.id || (m.is_human && m.content === entry.content && m.id.startsWith('pending')))) {
          return prev.map(m => (m.content === entry.content && m.id.startsWith('pending')) ? entry : m);
        }
        // Force snap to thread on first AI response
        if (entry.conversation_id && !entry.is_human && !activeThreadId) {
            setActiveThreadId(entry.conversation_id);
        }
        if (!entry.is_human) setIsSynthesizing(false);
        return [...prev, entry];
      });
    });
    socket.on('pulse-update', (data: { count: number }) => setObserverCount(data.count));
    return () => { socket.disconnect(); };
  }, [activeThreadId]);

  // --- ADMIN/ACCESS ---
  useEffect(() => {
    const timer = setInterval(() => {
      const isAdmin = user?.role === 'ADMIN' || user?.role === 'GOD_MODE' || user?.email === 'admin@janusforge.ai';
      if (isAdmin) { setTimeLeft("ETERNAL ACCESS"); setIsExpired(false); return; }
      if (!user?.access_expiry) { setTimeLeft("ACCESS REQUIRED"); setIsExpired(true); return; }
      const diff = new Date(user.access_expiry).getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft("EXPIRED"); setIsExpired(true); }
      else {
        setIsExpired(false);
        const h = Math.floor(diff/3600000); const m = Math.floor((diff%3600000)/60000); const s = Math.floor((diff%60000)/1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  // --- IGNITION ---
  const handleIgnition = async () => {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'GOD_MODE' || user?.email === 'admin@janusforge.ai';
    if (!userMessage.trim() || isSynthesizing) return;
    if (isExpired && !isAdmin) { setIsTrayOpen(true); return; }

    const originalMsg = userMessage;
    setIsSynthesizing(true);
    setUserMessage('');

    const tempId = 'pending-' + Date.now();
    if (!activeThreadId) {
      setChatThread(prev => [...prev, { id: tempId, content: originalMsg, is_human: true, name: user?.username || "Node", conversation_id: 'pending' }]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/nexus/ignite`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalMsg, models: selectedModels, userId: user?.id, conversationId: activeThreadId }),
      });
      const data = await res.json();
      if (data.conversationId) setActiveThreadId(data.conversationId);
    } catch (e) { setIsSynthesizing(false); }
  };

  const handleRefuel = async (priceId: string, hours: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier: hours === 24 ? '24H' : '7D', userId: user?.id })
      });
      const data = await response.json(); if (data.url) window.location.href = data.url;
    } catch (err) { console.error("Stripe Error", err); }
  };

  // --- UTILS ---
  useEffect(() => {
    const clock = setInterval(() => setNexusTime(new Date().toLocaleTimeString('en-US', { hour12: true, timeZone: 'America/New_York' })), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (userIsAtBottom) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread]);

  // RENDER LOGIC
  const displayMessages = activeThreadId 
    ? chatThread.filter(m => m.conversation_id === activeThreadId || m.id === activeThreadId || m.conversation_id === 'pending') 
    : chatThread.filter(m => !m.parent_post_id);

  const isAdminAccess = user?.role === 'ADMIN' || user?.role === 'GOD_MODE' || user?.email === 'admin@janusforge.ai';

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center font-sans overflow-x-hidden">
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveThreadId(null)}>
          <Globe className="text-indigo-500 animate-pulse" size={18}/><span className="text-[10px] font-black uppercase italic tracking-widest">Janus Forge Nexus</span>
        </div>
        <button onClick={() => setIsTrayOpen(true)} className="px-5 py-2 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-widest">{timeLeft}</button>
      </header>

      <main className="w-full max-w-4xl px-4 pt-32 pb-48">
        {!activeThreadId && (
          <div className="text-center mb-16">
            <h3 className="text-5xl font-black uppercase italic tracking-tighter">NEXUS PRIME</h3>
            <p className="text-zinc-500 text-sm mt-4 font-medium italic">Synchronized transmission feed.</p>
          </div>
        )}

        <div className="space-y-12 w-full">
          {activeThreadId && ( <button onClick={() => setActiveThreadId(null)} className="mb-8 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><X size={14}/> Return to Feed</button> )}
          {displayMessages.map((msg) => (
            <div key={msg.id} onClick={!activeThreadId ? () => setActiveThreadId(msg.conversation_id || msg.id) : undefined} className={`flex flex-col ${msg.is_human || msg.type === 'user' ? 'items-end' : 'items-start'} ${!activeThreadId ? 'cursor-pointer' : ''}`}>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">{msg.name || msg.ai_model}</span>
              <div className={`p-8 rounded-[2rem] border ${msg.is_human ? 'bg-zinc-900/40 border-white/10' : 'bg-zinc-950 border-white/5 shadow-2xl'}`}>
                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{msg.content || ""}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-8 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center">
        <div className={`w-full max-w-3xl border rounded-[3rem] p-3 flex items-center gap-4 backdrop-blur-3xl bg-zinc-950 border-indigo-500/30`}>
          <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())} placeholder="Start a neural pattern..." className="flex-1 bg-transparent outline-none resize-none h-12 py-3 px-6 text-sm text-white" />
          <button onClick={handleIgnition} className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center">{isSynthesizing ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}</button>
        </div>
        <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-4">
          <span className="text-indigo-400">Nodes Active: {chatThread.length}</span>
          <span className="text-amber-500/70 animate-pulse">Observers: {observerCount > 0 ? observerCount : "Syncing..."}</span>
        </div>
      </footer>

      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
          <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10" onClick={e => e.stopPropagation()}>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-10">Temporal Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[{ label: '24H PASS', price: '$5', hours: 24, id: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd' }].map((pass, i) => (
                <button key={i} onClick={() => handleRefuel(pass.id, pass.hours)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left">
                  <div className="text-[9px] font-black text-zinc-500 mb-1">{pass.label}</div>
                  <div className="text-2xl font-black italic">{pass.price}</div>
                </button>
              ))}
            </div>
            <div className="pt-8 border-t border-white/5">
              <CouncilBuilder selectedModels={selectedModels} setSelectedModels={setSelectedModels} userBalance={0} onIgnite={handleIgnition} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
