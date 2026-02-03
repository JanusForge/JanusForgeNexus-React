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
// 🚫 MUTED FOR STABILITY
// import ReferralLeaderboard from '@/components/nexus/ReferralLeaderboard';
// import FlowViewer from '@/components/ui/FlowViewer'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface NexusUser {
  id: string; username: string; email: string; role: string; access_expiry?: string | Date;
}

export default function NexusPrimeEngine() {
  const { user } = useAuth() as { user: NexusUser | null };
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [userMessage, setUserMessage] = useState('');
  const [chatThread, setChatThread] = useState<any[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>("SYNCING...");
  const [isExpired, setIsExpired] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nexusTime, setNexusTime] = useState<string>("");
  const [observerCount, setObserverCount] = useState<number>(0); 

  // 🎨 GRAPHICS REFS MUTED
  // const allNodes = useRef<any[]>([]);
  // const allEdges = useRef<any[]>([]);

  const [userIsAtBottom, setUserIsAtBottom] = useState(true);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeParentPostId, setActiveParentPostId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- HYDRATION ---
  const fetchStream = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/nexus/stream`);
      const data = await res.json();
      if (Array.isArray(data)) setChatThread(data);
    } catch (err) { console.error("Sync Failed:", err); }
  };

  useEffect(() => { fetchStream(); }, []);

  // --- SOCKET ENGINE ---
  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    socket.on('nexus:transmission', (entry: any) => {
      setChatThread(prev => {
        const isDuplicate = prev.find(m => m.id === entry.id || (m.is_human && m.content === entry.content && m.id.startsWith('pending')));
        if (isDuplicate) {
          return prev.map(m => (m.content === entry.content && m.id.startsWith('pending')) ? entry : m);
        }
        if (entry.conversation_id && !entry.is_human && !activeThreadId) {
            setActiveThreadId(entry.conversation_id);
        }
        if (!entry.is_human) setIsSynthesizing(false);
        return [...prev, entry];
      });
      if (!userIsAtBottom) setHasNewMessages(true);
    });
    socket.on('pulse-update', (data: { count: number }) => {
      if (data.count !== undefined) setObserverCount(data.count);
    });
    return () => { socket.disconnect(); };
  }, [activeThreadId, userIsAtBottom]);

  // --- ADMIN & ACCESS ---
  useEffect(() => {
    const timer = setInterval(() => {
      const isAdmin = user?.role === 'GOD_MODE' || user?.role === 'ADMIN' || user?.email === 'admin@janusforge.ai';
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

  // --- ACTIONS ---
  const handleRefuel = async (priceId: string, hours: number) => {
    try {
      const tier = hours === 24 ? '24H' : hours === 168 ? '7D' : '30D';
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier, userId: user?.id })
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { console.error("Stripe Error:", err); }
  };

  const handleIgnition = async () => {
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'GOD_MODE' || user?.email === 'admin@janusforge.ai';
    if (!userMessage.trim() || isSynthesizing) return;
    if (isExpired && !isAdmin) { setIsTrayOpen(true); return; }
    const originalMsg = userMessage;
    setIsSynthesizing(true);
    setUserMessage('');
    const tempId = 'pending-' + Date.now();
    if (!activeThreadId) {
      setChatThread(prev => [...prev, {
        id: tempId, content: originalMsg, is_human: true,
        name: user?.username || "Sovereign Node", conversation_id: 'pending'
      }]);
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/nexus/ignite`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalMsg, models: selectedModels, userId: user?.id, conversationId: activeThreadId, parentPostId: activeParentPostId }),
      });
      const data = await res.json();
      if (data.conversationId) setActiveThreadId(data.conversationId);
    } catch (e) { setIsSynthesizing(false); setChatThread(prev => prev.filter(m => m.id !== tempId)); }
  };

  useEffect(() => {
    const clock = setInterval(() => setNexusTime(new Date().toLocaleTimeString('en-US', { hour12: true, timeZone: 'America/New_York' })), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150;
      setUserIsAtBottom(isBottom);
      if (isBottom) setHasNewMessages(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (userIsAtBottom && chatThread.length > 0) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread, userIsAtBottom]);

  const scrollToBottom = () => { setUserIsAtBottom(true); setHasNewMessages(false); chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const toggleAnchor = (id: string) => { setChatThread(prev => prev.map(msg => msg.id === id ? { ...msg, isAnchored: !msg.isAnchored } : msg )); };
  const handleAction = (action: string, content: string) => { if (action === 'share') navigator.share?.({ title: 'Janus Forge', text: content, url: window.location.href }); };

  const displayMessages = activeThreadId 
    ? chatThread.filter(m => m.conversation_id === activeThreadId || m.id === activeThreadId || m.conversation_id === 'pending') 
    : chatThread.filter(m => !m.parent_post_id);

  const isAdminAccess = user?.role === 'ADMIN' || user?.role === 'GOD_MODE' || user?.email === 'admin@janusforge.ai';

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden font-sans">
      {hasNewMessages && !userIsAtBottom && ( <button onClick={scrollToBottom} className="fixed bottom-32 z-[160] bg-indigo-600 text-white px-6 py-3 rounded-full flex items-center gap-3 border border-white/20 shadow-2xl"><ArrowDown size={16} /><span className="text-[10px] font-black uppercase tracking-widest">New Transmissions</span></button> )}
      
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveThreadId(null); /* allNodes.current=[]; allEdges.current=[]; */ }}><Globe className="text-indigo-500 animate-pulse" size={18}/><span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Janus Forge Nexus</span></div>
        <button onClick={() => setIsTrayOpen(true)} className={`px-5 py-2 rounded-full border text-[10px] font-black tracking-[0.3em] flex items-center gap-3 ${isExpired && !isAdminAccess ? 'border-amber-500 text-amber-500' : 'border-indigo-500/20 text-indigo-400'}`}><div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isExpired && !isAdminAccess ? 'bg-amber-500' : 'bg-indigo-500'}`} />{timeLeft}</button>
      </header>

      <main className="w-full max-w-4xl px-4 flex flex-col items-center pt-32 pb-48">
        {!activeThreadId && (
          <>
            <div className="w-full max-w-sm aspect-video mb-8 overflow-hidden rounded-2xl opacity-80 contrast-125 grayscale hover:grayscale-0 transition-all duration-1000">
              <video autoPlay loop muted playsInline className="w-full h-full object-contain">
                <source src="/janus-logo-video.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white italic drop-shadow-2xl">NEXUS PRIME</h3>
              <p className="text-zinc-500 text-sm mt-4 font-medium italic">Synchronized public transmission feed. Observe or Contribute.</p>
            </div>
            {/* 🚫 Leaderboard Muted */}
            {/* <div className="w-full mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"><ReferralLeaderboard /></div> */}
          </>
        )}

        <div className="space-y-12 w-full">
          {!activeThreadId && <h2 className="text-[10px] font-black tracking-[0.4em] text-indigo-500 mb-8 uppercase">Neural Pulse Feed</h2>}
          {activeThreadId && ( <button onClick={() => { setActiveThreadId(null); setActiveParentPostId(null); /* allNodes.current=[]; allEdges.current=[]; */ }} className="mb-12 flex items-center gap-3 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"><X size={14} /> Return to Feed</button> )}

          {displayMessages.map((msg) => {
            const content = msg.content || "";
            // 🚫 Graphics Engine logic muted for text-only stability
            /*
            const flowRegex = /```(?:json-flow|json)\s*([\s\S]*?)```/;
            const match = content.match(flowRegex);
            if (match && match[1]) {
              try {
                const data = JSON.parse(match[1].trim());
                return (
                  <div key={msg.id} className="w-full space-y-4 my-8 animate-in zoom-in duration-500">
                    <div className="relative z-10 w-full rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-3xl overflow-hidden shadow-2xl" style={{ height: '500px' }}>
                      <FlowViewer nodes={data.nodes} edges={data.edges} />
                    </div>
                  </div>
                );
              } catch (err) { return null; }
            }
            */

            return (
              <div key={msg.id}
                onClick={!activeThreadId ? () => setActiveThreadId(msg.conversation_id || msg.id) : undefined}
                className={`flex flex-col ${msg.is_human || msg.type === 'user' ? 'items-end' : 'items-start'} ${!activeThreadId ? 'cursor-pointer group' : ''} animate-in fade-in slide-in-from-bottom-4`}
              >
                <div className="mb-3 px-2 flex items-center gap-3">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${msg.is_human || msg.type === 'user' ? 'text-zinc-500' : 'text-indigo-400 italic'}`}>
                    {msg.name || msg.sender || msg.ai_model}
                  </span>
                  {!activeThreadId && <ChevronRight size={10} className="text-zinc-800 group-hover:text-indigo-500 transition-all" />}
                </div>
                <div className={`relative p-8 rounded-[2rem] border transition-all duration-500 ${msg.is_human || msg.type === 'user' ? 'bg-zinc-900/40 border-white/10' : 'bg-zinc-950 border-white/5 shadow-2xl'}`}>
                  <p className="text-sm md:text-base text-zinc-200 leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-8 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center z-[150]">
        <div onClick={() => (isExpired && !isAdminAccess) && setIsTrayOpen(true)} className={`w-full max-w-3xl border rounded-[3rem] p-3 flex items-center gap-4 backdrop-blur-3xl transition-all duration-500 cursor-pointer ${ isExpired && !isAdminAccess ? 'bg-amber-500/5 border-amber-500/20' : 'bg-zinc-950 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.1)]' }`}>
          <textarea value={userMessage} readOnly={isExpired && !isAdminAccess} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())} placeholder={isExpired && !isAdminAccess ? "Unlock access to contribute..." : "Start a new neural pattern..."} className="flex-1 bg-transparent outline-none resize-none h-12 py-3 px-6 text-sm text-white" />
          <button onClick={handleIgnition} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${ isExpired && !isAdminAccess ? 'bg-amber-600/20 text-amber-500' : 'bg-indigo-600 text-white hover:bg-indigo-500' }`}>{isSynthesizing ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}</button>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center gap-4"><span className="text-indigo-400">Nodes Active: {chatThread.filter(m => m.is_human || m.type === 'user').length}</span><span className="opacity-30">•</span><span className="text-amber-500/70 animate-pulse">Observers: {observerCount > 0 ? observerCount : "Syncing..."}</span></p>
          <p className="text-[12px] font-black font-mono text-indigo-500 tracking-widest">{nexusTime} EST</p>
        </div>
      </footer>

      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
          <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Temporal Access</h3><X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-40 hover:opacity-100"/></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[ { label: '24H PASS', price: '$5', hours: 24, priceId: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd' }, { label: '7D SPRINT', price: '$20', hours: 168, priceId: 'price_1SqeAhGg8RUnSFObRUOFFNH7' }, { label: '30D FORGE', price: '$75', hours: 720, priceId: 'price_1SqeCqGg8RUnSFObHN4ZMCqs' } ].map((pass, i) => (
                <button key={i} onClick={() => handleRefuel(pass.priceId, pass.hours)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left group">
                  <div className="text-[9px] font-black text-zinc-500 mb-1 group-hover:text-indigo-400">{pass.label}</div>
                  <div className="text-2xl font-black italic">{pass.price}</div>
                </button>
              ))}
            </div>
            <div className="pt-8 border-t border-white/5"><CouncilBuilder selectedModels={selectedModels} setSelectedModels={setSelectedModels} userBalance={0} onIgnite={handleIgnition} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
