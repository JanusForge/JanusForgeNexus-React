"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Loader2, X, Clock, Zap, Star, Globe, ShieldCheck, Lock, Users, MessageSquare } from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';

// 🛡️ UPDATED: Added email to the interface
interface SovereignUser {
  id: string;
  username: string;
  email: string; // <--- Added this line
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
  const [timeLeft, setTimeLeft] = useState<string | null>("SYNCING...");
  const [isExpired, setIsExpired] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🎫 TIME-BASED ACCESS PROGRAM
  useEffect(() => {
    const timer = setInterval(() => {
      // Line 31 will now pass because 'email' is in the interface above
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

  // 🎊 SUCCESS DETECTION
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        setShowSuccess(true);
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => setShowSuccess(false), 8000);
      }
    }
  }, []);

  const toggleStar = (msgId: string) => {
    setChatThread(prev => prev.map(msg =>
      msg.id === msgId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const handleRefuel = async (priceId: string, hours: number) => {
    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/stripe/create-session', {
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

    if (isExpired && user?.role !== 'GOD_MODE' && user?.role !== 'ADMIN') {
      setIsTrayOpen(true);
      return;
    }

    const originalMsg = userMessage;
    const isCommand = originalMsg.includes('/') || originalMsg.length > 50;

    setChatThread(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: originalMsg,
      sender: user?.username || 'Architect',
      starred: false,
      category: isCommand ? 'COMMAND' : 'CHAT'
    }]);

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
          id: `ai-${Math.random()}`,
          type: 'ai',
          content: r.response,
          sender: r.model,
          starred: false
        }));
        setChatThread(prev => [...prev, ...aiEntries]);
      }
    } finally { setIsSynthesizing(false); }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center overflow-x-hidden">

      {showSuccess && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none p-4">
          <div className="bg-indigo-600 border border-white/20 px-8 py-5 rounded-[2rem] shadow-[0_0_80px_rgba(79,70,229,0.4)] animate-in zoom-in duration-500 flex items-center gap-5 pointer-events-auto">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">Handshake Complete</h4>
              <p className="text-indigo-100 text-[8px] font-black uppercase tracking-widest opacity-80">Sovereignty Restored • Access Granted</p>
            </div>
            <X onClick={() => setShowSuccess(false)} size={18} className="ml-4 cursor-pointer opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}

      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-[100] bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe className="text-indigo-500 animate-pulse" size={18}/>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Janus Stream</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <Users size={12} className="text-indigo-400"/>
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Master Flow</span>
          </div>
        </div>

        <button
          onClick={() => setIsTrayOpen(true)}
          className={`px-5 py-2 rounded-full border text-[10px] font-black tracking-[0.3em] flex items-center gap-2 shadow-[0_0_30px_rgba(79,70,229,0.1)] transition-all ${
            isExpired && user?.role !== 'ADMIN' 
            ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' 
            : 'border-indigo-500/20 text-indigo-400 bg-black/40 backdrop-blur-xl'
          }`}
        >
          {isExpired && user?.role !== 'ADMIN' ? <Lock size={12}/> : <ShieldCheck size={12}/>}
          {timeLeft}
        </button>
      </header>

      <main className="w-full max-w-4xl px-4 md:px-8 flex flex-col items-center pt-32 pb-48">
        <div className="w-full max-w-sm aspect-video mb-8 overflow-hidden rounded-2xl opacity-80 contrast-125 grayscale hover:grayscale-0 transition-all duration-1000">
           <video autoPlay loop muted playsInline className="w-full h-full object-contain">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>

        <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white italic text-center mb-16 drop-shadow-2xl">
            NEXUS PRIME
        </h3>

        <div className="w-full space-y-8">
          {chatThread.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
              <div className={`max-w-[90%] md:max-w-[80%] p-6 md:p-8 rounded-3xl border backdrop-blur-3xl relative transition-all duration-500 ${
                msg.type === 'user'
                  ? (msg.category === 'COMMAND' ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-white/5 border-white/10')
                  : 'bg-zinc-900/60 border-white/5 shadow-2xl'
              }`}>
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${msg.type === 'user' ? 'text-zinc-400' : 'text-amber-500'}`}>
                            {msg.sender}
                        </span>
                        {msg.category === 'COMMAND' && (
                          <span className="text-[7px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black">COMMAND</span>
                        )}
                    </div>
                    <button onClick={() => toggleStar(msg.id)} className={`transition-colors ${msg.starred ? 'text-amber-400' : 'text-zinc-700'}`}>
                      <Star size={12} fill={msg.starred ? "currentColor" : "none"} />
                    </button>
                </div>
                <p className={`leading-relaxed text-zinc-100 whitespace-pre-wrap ${msg.category === 'CHAT' ? 'text-sm md:text-base italic text-zinc-400' : 'text-base md:text-xl font-medium'}`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-8 md:p-12 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-4">
        {isExpired && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-2">
            <Lock size={10} className="text-amber-500"/>
            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Spectator Mode Only</span>
          </div>
        )}

        <div className={`w-full max-w-3xl border rounded-[3rem] p-3 md:p-4 flex items-center gap-4 shadow-2xl backdrop-blur-3xl transition-all duration-700 ${
          isExpired ? 'bg-zinc-950/40 border-white/5' : 'bg-zinc-950 border-indigo-500/30'
        }`}>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleIgnition())}
            placeholder={isExpired ? "Sovereignty Required to Ignite Nexus..." : "Command or Chat..."}
            className="flex-1 bg-transparent outline-none resize-none h-12 md:h-14 py-3 px-6 text-sm md:text-lg text-white font-medium placeholder:text-zinc-800 disabled:cursor-not-allowed"
            disabled={isExpired && user?.role !== 'ADMIN'}
          />
          <button
            onClick={handleIgnition}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
              isExpired && user?.role !== 'ADMIN' ? 'bg-zinc-800 text-zinc-600' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isSynthesizing ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
          </button>
        </div>
      </footer>

      {isTrayOpen && (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4" onClick={() => setIsTrayOpen(false)}>
            <div className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400">Sovereignty Portal</h3>
                <X onClick={() => setIsTrayOpen(false)} size={20} className="cursor-pointer opacity-50 hover:opacity-100"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                  { label: '24H PASS', price: '$5', hours: 24, priceId: 'price_1Sqe8rGg8RUnSFObq4cv8Mnd' },
                  { label: '7D SPRINT', price: '$20', hours: 168, priceId: 'price_1SqeAhGg8RUnSFObRUOFFNH7' },
                  { label: '30D FORGE', price: '$75', hours: 720, priceId: 'price_1SqeCqGg8RUnSFObHN4ZMCqs' }
                ].map((pass, i) => (
                  <button key={i} onClick={() => handleRefuel(pass.priceId, pass.hours)} className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-indigo-500 transition-all text-left group">
                    <div className="text-[9px] font-black text-zinc-500 group-hover:text-indigo-400 mb-1">{pass.label}</div>
                    <div className="text-2xl font-black">{pass.price}</div>
                  </button>
                ))}
              </div>
              <div className="pt-8 border-t border-white/5">
                <CouncilBuilder 
                  selectedModels={selectedModels} 
                  setSelectedModels={setSelectedModels} 
                  userBalance={0} 
                  onIgnite={handleIgnition}
                />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
