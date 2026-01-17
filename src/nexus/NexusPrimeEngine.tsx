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

  const handleTestRefuel = async (hours: number) => {
    try {
      const res = await fetch('https://janusforgenexus-backend.onrender.com/api/auth/test-refuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, hours })
      });
      if (res.ok) window.location.reload(); 
    } catch (err) { console.error(err); }
  };

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
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden">

      {/* 🏙️ STATUS INTERFACE (Fixed) */}
      <div className="fixed top-0 right-0 py-4 px-6 md:px-10 z-[100]">
        <button
          onClick={() => setIsTrayOpen(true)}
          className="px-5 py-2 rounded-full border border-indigo-500/20 text-indigo-400 bg-black/40 backdrop-blur-xl text-[10px] font-black tracking-[0.3em] flex items-center gap-2 shadow-[0_0_30px_rgba(79,70,229,0.1)] transition-all hover:border-indigo-500/50"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          {timeLeft}
        </button>
      </div>

      {/* 🌊 MAIN FLOW */}
      <main className="w-full max-w-4xl px-4 md:px-8 flex flex-col items-center pt-24 pb-32">
        
        {/* 🎬 VIDEO HEADER */}
        <div className="w-full max-w-md aspect-video mb-8 overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <video autoPlay loop muted playsInline className="w-full h-full object-contain contrast-125">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 📋 TITLE */}
        <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white italic text-center leading-none mb-12 drop-shadow-2xl">
           NEXUS PRIME
        </h3>

        {/* ⌨️ INTEGRATED INPUT HUB (Now positioned under Title) */}
        <div className="w-full max-w-3xl bg-zinc-950/80 border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-3 md:p-5 flex items-center gap-3 md:gap-6 shadow-2xl backdrop-blur-3xl mb-16">
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
            className={`w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all shadow-2xl shrink-0 ${
              isExpired && user?.role !== 'GOD_MODE' ? 'bg-amber-600 text-black' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            } active:scale-90`}
          >
            {isSynthesizing ? <Loader2 className="animate-spin" size={24}/> : <Send size={28} />}
          </button>
        </div>

        {/* 💬 DYNAMIC CHAT STREAM */}
        <div className="w-full space-y-10">
          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`max-w-[90%] md:max-w-[80%] p-6 md:p-10 rounded-3xl border backdrop-blur-3xl shadow-2xl ${
                msg.type === 'user' ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-zinc-900/40 border-white/5'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-widest mb-4 block ${msg.type === 'user' ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {msg.sender}
                </span>
                <p className="text-base md:text-xl leading-relaxed text-zinc-100 whitespace-pre-wrap font-medium">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* 🌑 SOVEREIGNTY PORTAL (The Refuel Tray) */}
      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
           <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-400" size={20}/>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Sovereignty Portal</h3>
                </div>
                <X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-50 hover:opacity-100"/>
              </div>

              {/* 🎫 REFUEL PACKS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[{l:'24H PASS', p:'$5', h:24}, {l:'7D SPRINT', p:'$20', h:168}, {l:'30D FORGE', p:'$75', h:720}].map((pass, i) => (
                  <button key={i} onClick={() => handleTestRefuel(pass.h)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left group">
                    <div className="text-[9px] font-black text-zinc-500 group-hover:text-indigo-400 mb-1">{pass.l}</div>
                    <div className="text-2xl font-black text-white">{pass.p}</div>
                  </button>
                ))}
              </div>

              {/* ⚙️ COUNCIL BUILDER */}
              <CouncilBuilder 
                userBalance={isExpired && user?.role !== 'GOD_MODE' ? 0 : 1} 
                selectedModels={selectedModels} 
                setSelectedModels={setSelectedModels} 
                onIgnite={async () => setIsTrayOpen(false)} 
              />
           </div>
        </div>
      )}

    </div>
  );
}
