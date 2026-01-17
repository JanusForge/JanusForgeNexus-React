"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Loader2, Lock, Globe, Bookmark, Share2, Settings2, X, Clock, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import CouncilBuilder from './components/CouncilBuilder';

export default function NexusPrimeEngine() {
  const { user } = useAuth(); 
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
  }, [user?.access_expiry]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatThread, isSynthesizing]);

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
    setChatThread(prev => [...prev, { id: Date.now(), type: 'user', content: originalMsg, sender: user?.username }]);
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
    <div className="min-h-screen bg-[#030303] text-zinc-100 overflow-x-hidden">
      {isTrayOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" onClick={() => setIsTrayOpen(false)} />}
      
      <nav className="fixed top-0 w-full h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="text-indigo-500" size={18} />
          <span className="text-xs font-black uppercase italic">Janus Forge Nexus<sup>®</sup></span>
        </div>
        <button onClick={() => setIsTrayOpen(true)} className={`px-4 py-1.5 rounded-full border text-[10px] font-black ${isExpired ? 'border-red-500/50 text-red-500' : 'border-white/10 text-indigo-400'}`}>
          <Clock size={12} className="inline mr-2"/>{timeLeft || "Access Required"}
        </button>
      </nav>

      <main className="pt-24 pb-44 px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          {chatThread.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-6 rounded-3xl border backdrop-blur-3xl ${msg.type === 'user' ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-white/5 border-white/10'}`}>
                <span className="text-[9px] font-black uppercase block mb-2 opacity-50">{msg.sender}</span>
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="fixed bottom-0 md:bottom-10 w-full max-w-2xl z-[70]">
          <div className={`transition-all ${isTrayOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className="mx-4 mb-4 bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8">
              <div className="flex justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase text-indigo-400">Sovereignty Portal</h3>
                <X onClick={() => setIsTrayOpen(false)} size={16} className="cursor-pointer"/>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[{l:'24H', p:'$5', h:24}, {l:'7D', p:'$20', h:168}, {l:'30D', p:'$75', h:720}].map((pass, i) => (
                  <button key={i} onClick={() => handleTestRefuel(pass.h)} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-indigo-500">
                    <div className="text-lg font-black">{pass.p}</div>
                    <div className="text-[9px] uppercase opacity-50">{pass.l} Pass</div>
                  </button>
                ))}
              </div>
              <CouncilBuilder userBalance={isExpired ? 0 : 1} selectedModels={selectedModels} setSelectedModels={setSelectedModels} onIgnite={() => setIsTrayOpen(false)} />
            </div>
          </div>

          <div className="bg-zinc-900/90 border-t md:border border-white/10 md:rounded-[3rem] p-5 flex items-center gap-4">
            <textarea value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder={isExpired ? "Access Expired..." : "Challenge the Council..."} className="flex-1 bg-transparent outline-none resize-none h-12 py-3 text-sm"/>
            <button onClick={handleIgnition} className={`p-4 rounded-2xl ${isExpired ? 'bg-amber-500' : 'bg-indigo-600'}`}><Send size={20}/></button>
          </div>
        </div>
      </main>
    </div>
  );
}
