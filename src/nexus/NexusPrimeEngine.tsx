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

      if (response.status === 403 && user?.role !== 'GOD_MODE') {
        setIsTrayOpen(true);
        setChatThread(prev => prev.slice(0, -1));
        setUserMessage(originalMsg);
        return;
      }

      if (response.ok && data.results) {
        const aiEntries = data.results.map((r: any) => ({
          type: 'ai',
          content: r.response || r.error || "NODE OFFLINE",
          sender: r.model
        }));
        setChatThread(prev => [...prev, ...aiEntries]);
      } else {
        setChatThread(prev => [...prev, { 
            type: 'ai', 
            content: `The Council remains silent: ${data.error || "Sovereignty Expired"}`, 
            sender: 'FORGE SYSTEM' 
        }]);
      }
    } catch (error) { 
        setUserMessage(originalMsg); 
    } finally { 
        setIsSynthesizing(false); 
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col bg-transparent overflow-x-hidden">
      
      {/* 🎥 FIXED VIDEO BACKGROUND LAYER */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-40">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/janus-forge-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
      </div>

      {/* 🏙️ SOVEREIGN STATUS (Floating below Navbar) */}
      <div className="relative w-full py-6 px-10 flex justify-end z-10">
        <button 
            onClick={() => setIsTrayOpen(true)} 
            className={`px-5 py-2 rounded-full border text-[10px] font-black transition-all flex items-center gap-3 shadow-lg ${
                isExpired && user?.role !== 'GOD_MODE' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-indigo-500/50 text-indigo-400 bg-black/60 backdrop-blur-md'
            }`}
        >
          <Clock size={12}/>
          <span className="tracking-widest uppercase">{timeLeft}</span>
        </button>
      </div>

      {/* 🌊 MAIN STREAM AREA */}
      <main className="relative flex-1 px-4 py-8 z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {chatThread.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
               <h3 className="text-5xl font-black uppercase tracking-[0.3em] text-white italic leading-none opacity-70 drop-shadow-2xl">AWAITING IGNITION</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 opacity-50">The Council is Silent</p>
            </div>
          )}

          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`max-w-[85%] p-8 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all ${
                msg.type === 'user' ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-black/80 border-white/10'
              }`}>
                <span className={`text-[9px] font-black uppercase tracking-widest mb-4 block ${msg.type === 'user' ? 'text-indigo-400' : 'text-amber-500'}`}>
                    {msg.sender}
                </span>
                <p className="text-base leading-relaxed text-zinc-100 font-medium whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isSynthesizing && (
            <div className="flex items-center gap-3 text-indigo-500 text-[10px] uppercase font-black tracking-widest animate-pulse">
               <Loader2 className="animate-spin" size={14} /> Council Synthesis in Progress...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ⌨️ INPUT HUB */}
      <footer className="sticky bottom-0 w-full p-8 z-50">
        <div className="max-w-3xl mx-auto bg-black/90 border border-white/10 rounded-[3rem] p-4 flex items-center gap-4 shadow-2xl backdrop-blur-xl">
          <textarea 
            value={userMessage} 
            onChange={(e) => setUserMessage(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder={isExpired && user?.role !== 'GOD_MODE' ? "Sovereignty Access Window Closed..." : "Challenge the Council..."} 
            className="flex-1 bg-transparent outline-none resize-none h-14 py-4 px-6 text-lg text-white"
          />
          <button 
            onClick={handleIgnition} 
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isExpired && user?.role !== 'GOD_MODE' ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'
            }`}
          >
            {isExpired && user?.role !== 'GOD_MODE' ? <Zap size={24} fill="currentColor" /> : <Send size={24}/>}
          </button>
        </div>
      </footer>
    </div>
  );
}
