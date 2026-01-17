"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Loader2, X, Clock, Zap, ShieldCheck } from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';

interface SovereignUser {
  id: string;
  username: string;
  role: string; // Critical for Admin bypass
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

  // 🛡️ ADMIN & TIME LOGIC
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. GOD_MODE BYPASS
      if (user?.role === 'GOD_MODE' || user?.role === 'ADMIN') {
        setTimeLeft("ETERNAL ACCESS");
        setIsExpired(false);
        return;
      }

      // 2. Standard User Check
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
    
    // Admin bypass for synthesis block
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

      if (response.status === 403 && user?.role !== 'GOD_MODE') {
        setChatThread(prev => prev.slice(0, -1));
        setUserMessage(originalMsg);
        setIsTrayOpen(true);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setChatThread(prev => [...prev, ...data.results.map((r: any) => ({ type: 'ai', content: r.response, sender: r.model }))]);
      }
    } catch (error) { setUserMessage(originalMsg); }
    finally { setIsSynthesizing(false); }
  };

  return (
    // 🎥 TRANSPARENCY FIX: Removed 'bg-black' and 'fixed inset-0'
    <div className="w-full flex flex-col min-h-screen transparent">
      
      {/* 🏙️ PROTOCOL HEADER */}
      <div className="w-full py-8 px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white drop-shadow-md">Nexus Prime</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-bold">Adversarial Protocol Active</p>
        </div>

        <button 
            onClick={() => setIsTrayOpen(true)} 
            className={`px-5 py-2 rounded-full border text-[10px] font-black transition-all flex items-center gap-3 shadow-lg ${
                isExpired ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-indigo-500/50 text-indigo-400 bg-black/40'
            }`}
        >
          <Clock size={12}/>
          <span className="tracking-widest">{timeLeft}</span>
        </button>
      </div>

      {/* 🌊 STREAM AREA */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {chatThread.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
               <h3 className="text-6xl font-black uppercase tracking-[0.2em] text-white italic text-center leading-none opacity-80 drop-shadow-2xl">AWAITING IGNITION</h3>
               <p className="text-[11px] font-black uppercase tracking-[0.6em] text-indigo-500 opacity-60">The Council is Silent</p>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-8 rounded-3xl border backdrop-blur-xl shadow-2xl transition-all ${
                msg.type === 'user' ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-black/60 border-white/10'
              }`}>
                <span className={`text-[10px] font-black uppercase tracking-widest mb-4 block ${msg.type === 'user' ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {msg.sender}
                </span>
                <p className="text-base leading-relaxed text-zinc-100 font-medium whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isSynthesizing && (
            <div className="flex items-center gap-3 text-indigo-500 text-[10px] uppercase font-black tracking-widest animate-pulse drop-shadow-md">
               <Loader2 className="animate-spin" size={14} /> COUNCIL SYNTHESIS IN PROGRESS...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* 🌑 PORTAL BACKDROP */}
      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
           <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-400" size={20}/>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Sovereignty Portal</h3>
                </div>
                <X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-50 hover:opacity-100"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[{l:'24H PASS', p:'$5', h:24}, {l:'7D SPRINT', p:'$20', h:168}, {l:'30D FORGE', p:'$75', h:720}].map((pass, i) => (
                  <button key={i} onClick={() => handleTestRefuel(pass.h)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left">
                    <div className="text-[9px] font-black text-zinc-500 mb-1">{pass.l}</div>
                    <div className="text-2xl font-black text-white">{pass.p}</div>
                  </button>
                ))}
              </div>

              <CouncilBuilder 
                userBalance={isExpired ? 0 : 1} 
                selectedModels={selectedModels} 
                setSelectedModels={setSelectedModels} 
                onIgnite={async () => setIsTrayOpen(false)} 
              />
           </div>
        </div>
      )}

      {/* ⌨️ INPUT HUB */}
      <div className="sticky bottom-0 w-full p-8 z-50">
        <div className="max-w-3xl mx-auto bg-black/80 border border-white/10 rounded-[3rem] p-4 flex items-center gap-4 shadow-2xl backdrop-blur-xl">
          <textarea 
            value={userMessage} 
            onChange={(e) => setUserMessage(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder={isExpired && user?.role !== 'GOD_MODE' ? "Sovereignty Access Window Closed..." : "Challenge the Council..."} 
            className="flex-1 bg-transparent outline-none resize-none h-14 py-4 px-6 text-lg text-white font-medium"
          />
          <button 
            onClick={handleIgnition} 
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isExpired && user?.role !== 'GOD_MODE' ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'
            } shadow-xl hover:scale-105 active:scale-95`}
          >
            {isExpired && user?.role !== 'GOD_MODE' ? <Zap size={24} fill="currentColor" /> : <Send size={24}/>}
          </button>
        </div>
      </div>
    </div>
  );
}
