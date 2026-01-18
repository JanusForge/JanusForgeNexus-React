"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Send, Loader2, X, Globe, ShieldCheck, Lock, Zap, 
  ThumbsUp, Share2, Printer, Bookmark, ChevronRight 
} from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface NexusUser {
  id: string;
  username: string;
  email: string;
  role: string;
  access_expiry?: string | Date;
}

export default function NexusPrimeEngine() {
  const { user } = useAuth() as { user: NexusUser | null };
  const [userMessage, setUserMessage] = useState('');
  const [chatThread, setChatThread] = useState<any[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>("SYNCING...");
  const [isExpired, setIsExpired] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- 📡 REAL-TIME TRANSMISSION SYNC ---
  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    socket.on('nexus:transmission', (entry: any) => {
      setChatThread(prev => {
        if (prev.find(m => m.id === entry.id)) return prev;
        return [...prev, entry];
      });
      if (entry.type === 'ai') setIsSynthesizing(false);
    });
    return () => { socket.disconnect(); };
  }, []);

  // --- ⏳ TEMPORAL ACCESS TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (user?.role === 'GOD_MODE' || user?.role === 'ADMIN' || user?.email === 'admin@janusforge.ai') {
        setTimeLeft("ETERNAL ACCESS");
        setIsExpired(false);
        return;
      }
      if (!user?.access_expiry) {
        setTimeLeft("ACCESS REQUIRED");
        setIsExpired(true);
        return;
      }
      const diff = new Date(user.access_expiry).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        setIsExpired(true);
      } else {
        setIsExpired(false);
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s remaining`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread]);

  const toggleAnchor = (id: string) => {
    setChatThread(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isAnchored: !msg.isAnchored } : msg
    ));
  };

  const handleAction = (action: string, content: string) => {
    if (action === 'print') window.print();
    if (action === 'share') {
      navigator.share?.({ title: 'Janus Forge Nexus Transmission', text: content, url: window.location.href });
    }
    // Logic for Like/Save would typically hit a backend route
    console.log(`${action} triggered for:`, content.substring(0, 20));
  };

  const handleRefuel = async (priceId: string, hours: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user?.id, hours }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) { console.error("Stripe Error:", err); }
  };

  const handleIgnition = async () => {
    if (!userMessage.trim() || isSynthesizing) return;
    if (isExpired && user?.role !== 'ADMIN') {
      setIsTrayOpen(true);
      return;
    }
    const originalMsg = userMessage;
    setIsSynthesizing(true);
    setUserMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/nexus/ignite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: originalMsg, 
          models: selectedModels, 
          userId: user?.id,
          systemContext: `[TEMPORAL_ANCHOR: January 17, 2026]`
        }),
      });
      const data = await response.json();
      if (response.ok && data.results) {
        // Fallback for non-socket updates
        setTimeout(() => {
          setChatThread(prev => {
            if (prev.some(m => m.content === data.results[0].response)) return prev;
            const aiEntries = data.results.map((r: any) => ({
              id: `ai-${Math.random()}`,
              type: 'ai',
              content: r.response,
              sender: r.model, // RESTORED MODEL NAMES
            }));
            setIsSynthesizing(false);
            return [...prev, ...aiEntries];
          });
        }, 2000);
      }
    } catch (e) { setIsSynthesizing(false); }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <Globe className="text-indigo-500 animate-pulse" size={18}/>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase italic">Janus Forge Nexus</span>
        </div>
        <button onClick={() => setIsTrayOpen(true)} className={`px-5 py-2 rounded-full border text-[10px] font-black tracking-[0.3em] transition-all ${isExpired ? 'border-amber-500 text-amber-500' : 'border-indigo-500/20 text-indigo-400'}`}>
          {timeLeft}
        </button>
      </header>

      <main className="w-full max-w-4xl px-4 pt-32 pb-48">
        {/* CHAT THREAD */}
        <div className="space-y-16">
          {chatThread.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-4`}>
              
              {/* SENDER LABEL */}
              <div className="mb-3 px-2 flex items-center gap-3">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${msg.type === 'user' ? 'text-zinc-500' : 'text-indigo-400 italic'}`}>
                  {msg.sender}
                </span>
                {msg.isAnchored && <Zap size={10} className="text-indigo-500 animate-pulse"/>}
              </div>

              <div className={`group relative p-8 rounded-[2rem] border transition-all duration-500 ${
                msg.type === 'user' 
                  ? msg.isAnchored ? 'bg-indigo-600/10 border-indigo-500/50 shadow-2xl shadow-indigo-500/10' : 'bg-zinc-900/40 border-white/10' 
                  : 'bg-zinc-950 border-white/5 shadow-2xl'
              }`}>
                <p className="text-sm md:text-base text-zinc-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {/* INTERACTION BAR */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-6">
                    <button onClick={() => handleAction('like', msg.content)} className="text-zinc-600 hover:text-indigo-400 transition-colors"><ThumbsUp size={14}/></button>
                    <button onClick={() => handleAction('save', msg.content)} className="text-zinc-600 hover:text-indigo-400 transition-colors"><Bookmark size={14}/></button>
                    <button onClick={() => handleAction('print', msg.content)} className="text-zinc-600 hover:text-indigo-400 transition-colors"><Printer size={14}/></button>
                    <button onClick={() => handleAction('share', msg.content)} className="text-zinc-600 hover:text-indigo-400 transition-colors"><Share2 size={14}/></button>
                  </div>
                  {msg.type === 'user' && (
                    <button onClick={() => toggleAnchor(msg.id)} className={`text-[8px] font-black uppercase tracking-widest ${msg.isAnchored ? 'text-indigo-400' : 'text-zinc-700 hover:text-zinc-400'}`}>
                      {msg.isAnchored ? '• Anchored •' : 'Anchor Pattern'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* FOOTER INPUT */}
      <footer className="fixed bottom-0 w-full p-8 bg-gradient-to-t from-black via-black to-transparent flex flex-col items-center">
        <div className={`w-full max-w-3xl border rounded-[3rem] p-3 flex items-center gap-4 backdrop-blur-3xl transition-all ${isExpired ? 'opacity-40 grayscale' : 'bg-zinc-950 border-indigo-500/30'}`}>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder={isExpired ? "Access Required..." : "Challenge the Council..."}
            className="flex-1 bg-transparent outline-none resize-none h-12 py-3 px-6 text-sm text-white placeholder:text-zinc-800"
            disabled={isExpired && user?.role !== 'ADMIN'}
          />
          <button onClick={handleIgnition} className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-all">
            {isSynthesizing ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
          </button>
        </div>
        <p className="mt-4 text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800">Observing Transmission Alpha • Jan 17 2026</p>
      </footer>

      {/* ACCESS TRAY */}
      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
          <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[3rem] p-10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Temporal Access</h3>
              <X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-40 hover:opacity-100"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { label: '24H PASS', price: '$5', hours: 24, priceId: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd' },
                { label: '7D SPRINT', price: '$20', hours: 168, priceId: 'price_1SqeAhGg8RUnSFObRUOFFNH7' },
                { label: '30D FORGE', price: '$75', hours: 720, priceId: 'price_1SqeCqGg8RUnSFObHN4ZMCqs' }
              ].map((pass, i) => (
                <button key={i} onClick={() => handleRefuel(pass.priceId, pass.hours)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left">
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
