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

  // 🛡️ SOVEREIGNTY STATUS ENGINE
  useEffect(() => {
    const timer = setInterval(() => {
      if (user?.role === 'GOD_MODE' || user?.role === 'ADMIN') {
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
    // Immediately show the user message in the thread
    setChatThread(prev => [...prev, { id: Date.now(), type: 'user', content: originalMsg, sender: user?.username || 'Sovereign' }]);
    setIsSynthesizing(true);
    setUserMessage('');

    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/ignite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: originalMsg, 
            models: selectedModels, 
            userId: user?.id 
        }),
      });

      const data = await response.json();

      if (response.status === 403 && user?.role !== 'GOD_MODE') {
        setIsTrayOpen(true);
        setChatThread(prev => prev.slice(0, -1));
        setUserMessage(originalMsg);
        return;
      }

      if (response.ok && data.results) {
        // Map the Council results into the chat thread
        const aiEntries = data.results.map((r: any) => ({
          type: 'ai',
          content: r.response || r.error || "NODE OFFLINE",
          sender: r.model
        }));
        setChatThread(prev => [...prev, ...aiEntries]);
      } else {
        // Handle server-side errors
        setChatThread(prev => [...prev, { 
            type: 'ai', 
            content: `The Council remains silent: ${data.error || "System Desync"}`, 
            sender: 'FORGE SYSTEM' 
        }]);
      }
    } catch (error) { 
        console.error("Ignition Failure:", error);
        setUserMessage(originalMsg); 
    } finally { 
        setIsSynthesizing(false); 
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col bg-black overflow-x-hidden">
      
      {/* 🎥 FIXED VIDEO BACKGROUND */}
      <div className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="/janus-forge-background.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
      </div>

      {/* 🏙️ PROTOCOL HEADER (Transparent to show video) */}
      <div className="relative w-full py-10 px-10 flex items-center justify-between z-10">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Nexus Prime</h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-indigo-400 font-bold ml-1">Adversarial Protocol v2.6</p>
        </div>

        <button 
            onClick={() => setIsTrayOpen(true)} 
            className={`px-6 py-2 rounded-full border text-[11px] font-black transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.2)] ${
                isExpired ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-indigo-500/50 text-indigo-400 bg-black/60 backdrop-blur-md'
            }`}
        >
          <Clock size={12}/>
          <span className="tracking-widest uppercase">{timeLeft}</span>
        </button>
      </div>

      {/* 🌊 SCROLLABLE STREAM AREA */}
      <main className="relative flex-1 px-4 py-16 z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {chatThread.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-pulse">
               <div className="w-20 h-20 rounded-full border border-indigo-500/20 flex items-center justify-center bg-indigo-500/5 shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                  <Zap size={32} className="text-indigo-500 fill-indigo-500" />
               </div>
               <div className="text-center">
                  <h3 className="text-6xl font-black uppercase tracking-[0.3em] text-white italic leading-none opacity-80">AWAITING IGNITION</h3>
                  <p className="text-[12px] font-black uppercase tracking-[0.8em] text-indigo-500 mt-4">The Council is Silent</p>
               </div>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`max-w-[85%] p-10 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all ${
                msg.type === 'user' ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-black/80 border-white/10'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${msg.type === 'user' ? 'text-indigo-400' : 'text-amber-500'}`}>
                        {msg.sender}
                    </span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <p className="text-lg leading-loose text-zinc-100 font-medium whitespace-pre-wrap selection:bg-indigo-500/40">
                    {msg.content}
                </p>
              </div>
            </div>
          ))}

          {isSynthesizing && (
            <div className="flex items-center gap-4 text-indigo-400 text-[11px] uppercase font-black tracking-[0.5em] animate-pulse px-6">
               <Loader2 className="animate-spin" size={16} /> Council Synthesis in Progress...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* 🌑 PORTAL BACKDROP */}
      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
           <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-12 shadow-[0_0_100px_rgba(79,70,229,0.15)]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-indigo-400" size={24}/>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-white">Sovereignty Portal</h3>
                </div>
                <X onClick={() => setIsTrayOpen(false)} size={24} className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[{l:'24H PASS', p:'$5', h:24}, {l:'7D SPRINT', p:'$20', h:168}, {l:'30D FORGE', p:'$75', h:720}].map((pass, i) => (
                  <button key={i} onClick={() => handleTestRefuel(pass.h)} className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-indigo-500 transition-all text-center group">
                    <div className="text-[10px] font-black text-zinc-500 group-hover:text-indigo-400 mb-2">{pass.l}</div>
                    <div className="text-3xl font-black text-white">{pass.p}</div>
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
      <footer className="sticky bottom-0 w-full p-10 z-50 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="max-w-4xl mx-auto bg-black/90 border border-white/10 rounded-[3.5rem] p-5 flex items-center gap-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          <textarea 
            value={userMessage} 
            onChange={(e) => setUserMessage(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder={isExpired && user?.role !== 'GOD_MODE' ? "Sovereignty Access Window Closed..." : "Challenge the Council..."} 
            className="flex-1 bg-transparent outline-none resize-none h-16 py-5 px-8 text-xl text-white font-medium placeholder:text-zinc-700"
          />
          <button 
            onClick={handleIgnition} 
            disabled={isSynthesizing || !userMessage.trim()}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                isExpired && user?.role !== 'GOD_MODE' ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'
            } hover:scale-105 active:scale-95 disabled:opacity-20`}
          >
            {isExpired && user?.role !== 'GOD_MODE' ? <Zap size={28} fill="currentColor" /> : <Send size={28}/>}
          </button>
        </div>
      </footer>
    </div>
  );
}
