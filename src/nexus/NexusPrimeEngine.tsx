"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Loader2, X, Clock, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';

interface SovereignUser {
  id: string;
  username: string;
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
  const [refuelRequired, setRefuelRequired] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!user?.access_expiry) return;
      const expiryTime = new Date(user.access_expiry).getTime();
      const diff = expiryTime - new Date().getTime();
      
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
  }, [user?.access_expiry]);

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
    if (isExpired) { setIsTrayOpen(true); setRefuelRequired(true); return; }

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

      if (response.status === 403) {
        setChatThread(prev => prev.slice(0, -1));
        setUserMessage(originalMsg);
        setIsTrayOpen(true);
        setRefuelRequired(true);
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
    <div className="min-h-screen w-full bg-[#020202] text-zinc-100 selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* 🏙️ TOP NAV - FIXED & ON TOP */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-md border-b border-white/10 z-[100] px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="text-indigo-500 fill-indigo-500" size={16} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Janus Forge Nexus<sup>®</sup></span>
        </div>
        <button 
            onClick={() => setIsTrayOpen(true)} 
            className={`px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest transition-all ${
                isExpired ? 'border-red-500 text-red-500' : 'border-indigo-500/50 text-indigo-400'
            }`}
        >
          <Clock size={10} className="inline mr-1.5 mb-0.5"/>{timeLeft || "ACCESS DENIED"}
        </button>
      </nav>

      {/* 🌊 MAIN SCROLL AREA */}
      <main className="absolute inset-0 pt-20 pb-32 px-4 overflow-y-auto z-10 custom-scrollbar">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {chatThread.length === 0 && !isSynthesizing && (
            <div className="py-20 text-center opacity-20">
               <p className="text-[9px] font-black uppercase tracking-[0.5em]">System Ready // Awaiting Input</p>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl border ${msg.type === 'user' ? 'bg-indigo-600/5 border-indigo-500/20' : 'bg-white/5 border-white/10'}`}>
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">{msg.sender}</span>
                <p className="text-sm leading-relaxed text-zinc-300">{msg.content}</p>
              </div>
            </div>
          ))}

          {isSynthesizing && (
            <div className="flex items-center gap-2 text-zinc-500 text-[9px] uppercase font-black tracking-widest animate-pulse">
               <Loader2 className="animate-spin" size={12} /> Council Deliberating...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* 🌑 TRAY BACKDROP */}
      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/90 z-[110] transition-opacity" onClick={() => setIsTrayOpen(false)} />
      )}

      {/* ⌨️ INTERACTION BAR & TRAY PORTAL */}
      <div className="fixed bottom-0 left-0 w-full z-[120] px-4 pb-4 md:pb-8 flex flex-col items-center">
        
        {/* THE TRAY */}
        <div className={`w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2rem] p-6 mb-4 shadow-2xl transition-all duration-500 ${isTrayOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[9px] font-black uppercase text-indigo-400 flex items-center gap-2">
              <ShieldCheck size={14}/> Sovereignty Portal
            </h3>
            <X onClick={() => setIsTrayOpen(false)} size={16} className="cursor-pointer opacity-50 hover:opacity-100"/>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{l:'24H', p:'$5', h:24}, {l:'7D', p:'$20', h:168}, {l:'30D', p:'$75', h:720}].map((pass, i) => (
              <button key={i} onClick={() => handleTestRefuel(pass.h)} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:border-indigo-500 text-center transition-colors">
                <div className="text-lg font-black">{pass.p}</div>
                <div className="text-[8px] uppercase opacity-40">{pass.l} PASS</div>
              </button>
            ))}
          </div>

          {/* This renders the existing CouncilBuilder Cluster */}
          <CouncilBuilder 
            userBalance={isExpired ? 0 : 1} 
            selectedModels={selectedModels} 
            setSelectedModels={setSelectedModels} 
            onIgnite={async () => setIsTrayOpen(false)} 
          />
        </div>

        {/* INPUT BAR */}
        <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-full p-2 flex items-center gap-3 shadow-2xl">
          <textarea 
            value={userMessage} 
            onChange={(e) => setUserMessage(e.target.value)} 
            placeholder={isExpired ? "Access Window Closed..." : "Challenge the Council..."} 
            className="flex-1 bg-transparent outline-none resize-none h-10 py-2.5 px-4 text-sm text-white"
          />
          <button 
            onClick={handleIgnition} 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpired ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'}`}
          >
            {isExpired ? <Zap size={18} fill="currentColor" /> : <Send size={18}/>}
          </button>
        </div>
      </div>
    </div>
  );
}
