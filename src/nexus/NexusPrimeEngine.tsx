"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Loader2, X, Clock, Zap, ShieldCheck } from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';

interface SovereignUser {
  id: string;
  username: string;
  role: string;
  access_expiry?: string | Date;
  is_sovereign?: boolean;
}

export default function NexusPrimeEngine() {
  const { user } = useAuth() as { user: SovereignUser | null }; 
  const [userMessage, setUserMessage] = useState('');
  const [chatThread, setChatThread] = useState<any[]>([]); 
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (user?.role === 'GOD_MODE' || user?.role === 'ADMIN') {
        setTimeLeft("ETERNAL ACCESS");
        setIsExpired(false);
        return;
      }
      if (!user?.access_expiry) { setTimeLeft("ACCESS REQUIRED"); setIsExpired(true); return; }
      const diff = new Date(user.access_expiry).getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft("EXPIRED"); setIsExpired(true); } 
      else {
        setIsExpired(false);
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [user?.access_expiry, user?.role]);

  const handleIgnition = async () => {
    if (!userMessage.trim() || isSynthesizing) return;
    if (isExpired && user?.role !== 'GOD_MODE' && user?.role !== 'ADMIN') { 
      setIsTrayOpen(true); 
      return; 
    }

    const originalMsg = userMessage;
    setChatThread(prev => [...prev, { id: Date.now(), type: 'user', content: originalMsg, sender: user?.username || 'Sovereign' }]);
    setIsSynthesizing(true);
    setUserMessage('');

    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/ignite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: originalMsg, models: selectedModels, userId: user?.id }),
      });

      const data = await response.json();
      if (response.ok && data.results) {
        const aiEntries = data.results.map((r: any) => ({
          type: 'ai', content: r.response, sender: r.model
        }));
        setChatThread(prev => [...prev, ...aiEntries]);
      }
    } catch (error) { setUserMessage(originalMsg); }
    finally { setIsSynthesizing(false); }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col bg-black overflow-hidden">
      
      {/* 🎬 DYNAMIC LOGO CORE (Z-0) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-center p-8 md:p-32">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="max-w-full max-h-full object-contain opacity-75 contrast-150 saturate-125"
        >
          <source src="/janus-logo-video.mp4" type="video/mp4" />
        </video>
        {/* Deep Atmospheric Vignette */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
      </div>

      {/* 🏙️ STATUS INTERFACE (Z-50) */}
      <div className="relative w-full py-4 px-6 md:px-10 flex justify-end z-50">
        <button 
          onClick={() => setIsTrayOpen(true)} 
          className="px-5 py-2 rounded-full border border-indigo-500/20 text-indigo-400 bg-black/40 backdrop-blur-xl text-[10px] font-black tracking-[0.3em] flex items-center gap-2 shadow-[0_0_30px_rgba(79,70,229,0.1)] transition-all hover:border-indigo-500/50"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          {timeLeft}
        </button>
      </div>

      {/* 🌊 TRANSMISSION STREAM (Z-10) */}
      <main className="relative flex-1 px-4 md:px-8 py-2 z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10 md:space-y-14 pb-48">
          {chatThread.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 md:py-40 animate-pulse">
               <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white italic drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] text-center leading-[0.85]">
                 NEXUS  PRIME
               </h3>
               <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[1em] text-indigo-500 mt-8 bg-black/60 px-6 py-2 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">
                 Join the Conversation
               </p>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} group`}>
              <div className={`max-w-[94%] md:max-w-[85%] p-6 md:p-10 rounded-3xl md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 ${
                msg.type === 'user' 
                  ? 'bg-indigo-600/5 border-indigo-500/20 shadow-indigo-500/5' 
                  : 'bg-black/40 border-white/5 hover:border-white/20'
              }`}>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] ${msg.type === 'user' ? 'text-indigo-500' : 'text-amber-500'}`}>
                        {msg.sender}
                    </span>
                    <div className={`h-[1px] flex-1 ${msg.type === 'user' ? 'bg-indigo-500/20' : 'bg-white/10'}`} />
                </div>
                <p className="text-base md:text-xl leading-relaxed text-zinc-200 whitespace-pre-wrap font-medium selection:bg-indigo-500/30">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ⌨️ NEURAL INPUT HUB (Z-50) */}
      <footer className="sticky bottom-0 w-full p-6 md:p-12 z-50 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-3xl mx-auto bg-zinc-950/80 border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-3 md:p-5 flex items-center gap-3 md:gap-6 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
          <textarea 
            value={userMessage} 
            onChange={(e) => setUserMessage(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder="Join the conversation or start your own..." 
            className="flex-1 bg-transparent outline-none resize-none h-12 md:h-16 py-3 md:py-5 px-4 md:px-10 text-sm md:text-2xl text-white font-medium placeholder:text-zinc-800"
          />
          <button 
            onClick={handleIgnition} 
            disabled={isSynthesizing || !userMessage.trim()}
            className={`w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all shadow-2xl shrink-0 group ${
              isExpired && user?.role !== 'GOD_MODE' ? 'bg-amber-600 text-black' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            } disabled:opacity-20 active:scale-90`}
          >
            {isSynthesizing ? <Loader2 className="animate-spin" size={24}/> : <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>}
          </button>
        </div>
      </footer>
    </div>
  );
}
