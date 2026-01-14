"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Clock, Trophy, Vote, Loader2, History, ShieldCheck, 
  Radio, Sparkles, Cpu, MessageSquare, Zap, ChevronRight, Lock
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [current, setCurrent] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const socketRef = useRef<Socket | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai';

  // 1. THE COUNTDOWN TIMER (Midnight EST / 5AM UTC)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setUTCHours(5, 0, 0, 0);
      if (now > target) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. DATA INITIALIZATION
  useEffect(() => {
    const init = async () => {
      try {
        const archRes = await fetch(`${API_BASE_URL}/api/daily-forge/history`);
        if (archRes.ok) setArchives(await archRes.json());

        const forgeRes = await fetch(`${API_BASE_URL}/api/daily-forge/current`);
        if (forgeRes.ok) {
          const data = await forgeRes.json();
          setCurrent(data);
          if (data.conversationId) {
            const pRes = await fetch(`${API_BASE_URL}/api/conversations/${data.conversationId}`);
            if (pRes.ok) {
              const pData = await pRes.json();
              setAllPosts(pData.conversation.posts);
            }
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    init();
    socketRef.current = io(API_BASE_URL, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    // Logic to emit 'post:new' via socketRef.current goes here
    setMessage('');
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col lg:flex-row font-sans">
      
      {/* 📜 THE CHRONO-VAULT (SIDEBAR) */}
      <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col p-8 bg-black/40 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10 text-indigo-500/70">
          <History size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Chrono-Vault</span>
        </div>
        <div className="space-y-4">
          {archives.map(arch => (
            <Link key={arch.id} href={`/daily-forge/${arch.id}`} className="group block p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all">
              <div className="text-[9px] text-zinc-600 mb-1 font-mono uppercase">{new Date(arch.date).toLocaleDateString()}</div>
              <div className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                {arch.winningTopic}
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* 🏛️ MAIN FORGE ARENA */}
      <main className="flex-1 py-12 md:py-20 px-4 md:px-12 lg:px-24 max-w-6xl mx-auto">
        
        {/* MASTER HEADER & COUNTDOWN */}
        <div className="flex flex-col items-center mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={12} /> Live Frontiers Synthesis
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 text-gradient">
            The Daily Forge
          </h1>
          <div className="flex items-center gap-4 text-zinc-500 bg-zinc-900/50 px-6 py-2 rounded-full border border-white/5">
            <Clock size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest font-mono">
              Next Reset: <span className="text-white ml-2">{timeLeft}</span>
            </span>
          </div>
        </div>

        {current && (
          <div className="space-y-32">
            
            {/* SECTION 1: THE COUNCIL VERDICT (Improved Legibility) */}
            <section className="relative p-1 bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-500/10 rounded-[3rem] shadow-2xl">
              <div className="bg-[#080808] rounded-[2.9rem] p-12 md:p-20 text-center relative overflow-hidden">
                <Trophy className="mx-auto mb-8 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" size={64} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-6 block">Consensus Reached</span>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tight leading-tight mb-16 text-white">
                  "{current.winningTopic}"
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {current.councilVotes && Object.entries(JSON.parse(current.councilVotes)).map(([ai, vote]) => (
                    <div key={ai} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md hover:border-indigo-500/30 transition-all">
                      <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">{ai}</div>
                      <div className="text-[11px] font-bold text-zinc-300 leading-snug">{vote as string}</div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-grow" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: THE SYNTHESIS THREAD (User Readable) */}
            <section className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                  <MessageSquare size={18} className="text-indigo-500" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">The Neural Transcript</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                  <Radio size={12} className="animate-pulse" /> Live Stream
                </div>
              </div>

              <div className="space-y-12">
                {allPosts.map((msg: any) => (
                  <div key={msg.id} className="relative group p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                           {msg.sender === 'ai' ? <Cpu size={18} className="text-indigo-400" /> : <Zap size={18} className="text-amber-400" />}
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-100">{msg.name}</span>
                          <span className="text-[10px] font-mono text-zinc-600 block mt-0.5 uppercase">Frontier Node</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: THE SYNTHESIS PORTAL (Call to Action) */}
            <section className="max-w-4xl mx-auto pb-32">
              {!isAuthenticated ? (
                <div className="bg-indigo-600/5 border border-indigo-500/20 p-16 rounded-[3rem] text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <Lock className="mx-auto mb-6 text-indigo-400 opacity-50" size={40} />
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Neural Identity Required</h3>
                  <p className="text-zinc-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
                    Viewers can only observe. To interject your own logic and challenge the Council, you must initialize your identity.
                  </p>
                  <Link href="/register" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl">
                    Claim Identity <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="bg-zinc-900/40 border border-white/10 p-1 rounded-[3rem]">
                  <div className="bg-black/40 rounded-[2.9rem] p-10">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Synthesis Portal Active</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase font-mono bg-indigo-500/10 px-3 py-1 rounded-md">Cost: 3 Tokens</span>
                    </div>
                    <form onSubmit={handleDeploy} className="space-y-6">
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={isOwner ? "Owner Mode: Direct the Forge..." : "Interject into the consensus..."}
                        className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-8 text-lg font-light focus:border-indigo-500/50 outline-none transition-all resize-none min-h-[160px]"
                      />
                      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-2xl shadow-indigo-600/20">
                        Deploy Interjection
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
