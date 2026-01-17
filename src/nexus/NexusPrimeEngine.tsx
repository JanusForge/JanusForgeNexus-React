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
    <div className="w-full min-h-screen relative flex flex-col bg-transparent overflow-hidden">
      
      {/* 🎬 RESPONSIVE VIDEO LAYER (Z-0) */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-center p-4 md:p-10">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="max-w-full max-h-full object-contain opacity-40 contrast-125"
        >
          <source src="/janus-logo-video.mp4" type="video/mp4" />
        </video>
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* 🏙️ STATUS BAR (Z-50) */}
      <div className="relative w-full py-4 md:py-6 px-4 md:px-10 flex justify-end z-50">
        <button 
          onClick={() => setIsTrayOpen(true)} 
          className="px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-400 bg-black/60 backdrop-blur-md text-[9px] md:text-[10px] font-black tracking-widest flex items-center gap-3 shadow-2xl"
        >
          <Clock size={12}/> {timeLeft}
        </button>
      </div>

      {/* 🌊 SCROLLABLE CONTENT (Z-10) */}
      <main className="relative flex-1 px-4 md:px-6 py-4 md:py-8 z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-44">
          {chatThread.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 md:py-40">
               <h3 className="text-4xl md:text-7xl font-black uppercase tracking-[0.1em] text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] text-center leading-tight">
                 AWAITING<br/>IGNITION
               </h3>
               <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] text-indigo-500 mt-4 md:mt-6 bg-black/40 px-4 py-1 backdrop-blur-sm rounded">
                 The Council is Silent
               </p>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[90%] md:max-w-[85%] p-5 md:p-8 rounded-2xl md:rounded-3xl border backdrop-blur-2xl shadow-2xl ${
                msg.type === 'user' ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-black/70 border-white/10'
              }`}>
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4 block ${msg.type === 'user' ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {msg.sender}
                </span>
                <p className="text-sm md:text-lg leading-relaxed text-zinc-100 whitespace-pre-wrap font-medium">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ⌨️ RESPONSIVE INPUT (Z-50) */}
      <footer className="sticky bottom-0 w-full p-4 md:p-8 z-50">
        <div className="max-w-3xl mx-auto bg-black/80 border border-white/10 rounded-[2rem] md:rounded-[3.5rem] p-2 md:p-4 flex items-center gap-2 md:gap-4 shadow-2xl backdrop-blur-2xl">
          <textarea 
            value={userMessage} 
            onChange={(e) => setUserMessage(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder="Challenge the Council..." 
            className="flex-1 bg-transparent outline-none resize-none h-12 md:h-14 py-3 md:py-4 px-4 md:px-6 text-sm md:text-xl text-white font-medium placeholder:text-zinc-700"
          />
          <button 
            onClick={handleIgnition} 
            className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all shadow-xl shrink-0 ${
              isExpired && user?.role !== 'GOD_MODE' ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'
            }`}
          >
            {isSynthesizing ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}
          </button>
        </div>
      </footer>
    </div>
  );
}
