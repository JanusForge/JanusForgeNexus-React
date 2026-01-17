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
    // 🛡️ High Z-index on the container to blast through any global overlays
    <div className="fixed inset-0 w-full h-full bg-[#020202] text-zinc-100 z-[9999] flex flex-col overflow-hidden">
      
      {/* 🏙️ INTEGRATED HEADER */}
      <header className="shrink-0 h-20 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Zap size={14} className="text-white fill-white" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-tighter italic">Janus Forge Nexus<sup>®</sup></h1>
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-indigo-400 font-bold mt-1">Nexus Prime Protocol</p>
        </div>

        <button 
            onClick={() => setIsTrayOpen(true)} 
            className={`px-4 py-2 rounded-full border text-[10px] font-black transition-all flex items-center gap-3 ${
                isExpired ? 'border-red-500 bg-red-500/10 text-red-500 animate-pulse' : 'border-indigo-500/40 text-indigo-400 bg-indigo-500/5'
            }`}
        >
          <Clock size={12}/>
          <span>{timeLeft || "ACCESS DENIED"}</span>
        </button>
      </header>

      {/* 🌊 SCROLLABLE STREAM AREA */}
      <main className="flex-1 overflow-y-auto px-4 py-12 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {chatThread.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-30">
               <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Nexus Prime</h2>
               <p className="text-[9px] font-black uppercase tracking-[0.5em]">Awaiting Adversarial Ignition</p>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-8 rounded-3xl border shadow-2xl transition-all ${
                msg.type === 'user' 
                  ? 'bg-indigo-600/5 border-indigo-500/30 rounded-tr-none' 
                  : 'bg-white/5 border-white/10 rounded-tl-none'
              }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest mb-4 block ${msg.type === 'user' ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {msg.sender} {msg.type === 'ai' && 'PROTOCOL'}
                </span>
                <p className="text-base leading-relaxed text-zinc-200 font-medium whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isSynthesizing && (
            <div className="flex items-center gap-3 text-indigo-500 text-[10px] uppercase font-black tracking-widest animate-pulse px-4">
               <Loader2 className="animate-spin" size={14} /> Council Synthesis in Progress...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* 🌑 PORTAL BACKDROP */}
      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
           <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(79,70,229,0.1)]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-400" size={20}/>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Sovereignty Portal</h3>
                </div>
                <X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-50 hover:opacity-100"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[{l:'24H PASS', p:'$5', h:24}, {l:'7D SPRINT', p:'$20', h:168}, {l:'30D FORGE', p:'$75', h:720}].map((pass, i) => (
                  <button key={i} onClick={() => handleTestRefuel(pass.h)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left group">
                    <div className="text-[9px] font-black text-zinc-500 group-hover:text-indigo-400 mb-1">{pass.l}</div>
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
      <footer className="shrink-0 p-6 md:p-10 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-900/90 border border-white/10 rounded-[2.5rem] p-3 flex items-center gap-4 shadow-2xl">
            <textarea 
              value={userMessage} 
              onChange={(e) => setUserMessage(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
              placeholder={isExpired ? "Access Window Closed..." : "Challenge the Council..."} 
              className="flex-1 bg-transparent outline-none resize-none h-14 py-4 px-4 text-base text-white placeholder:text-zinc-700"
            />
            <button 
              onClick={handleIgnition} 
              className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all ${isExpired ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20'} shadow-xl`}
            >
              {isExpired ? <Zap size={24} fill="currentColor" /> : <Send size={24}/>}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
