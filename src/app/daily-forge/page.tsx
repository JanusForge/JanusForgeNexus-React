"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Clock, Trophy, Vote, Loader2, History, ShieldCheck, 
  Radio, Sparkles, Cpu, MessageSquare, Zap 
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
  const [userVoted, setUserVoted] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai';

  // Logic remains identical to your previous build for stability...
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

  useEffect(() => {
    const init = async () => {
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
            setAllPosts(pData.conversation.posts.reverse());
          }
        }
      }
    };
    init();
    socketRef.current = io(API_BASE_URL, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30">
      
      {/* 📜 THE CHRONO-VAULT SIDEBAR */}
      <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col p-8 bg-black/20 backdrop-blur-md sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 text-indigo-500/70">
          <History size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Chrono-Vault</span>
        </div>
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {archives.map(arch => (
            <Link key={arch.id} href={`/daily-forge/${arch.id}`} className="group block p-4 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all">
              <div className="text-[9px] text-zinc-600 mb-1 font-mono uppercase">{new Date(arch.date).toLocaleDateString()}</div>
              <div className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                {arch.winningTopic}
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* 🏛️ MAIN FORGE ARENA */}
      <div className="flex-1 py-12 md:py-20 px-4 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">

          {/* MASTER HEADER */}
          <div className="flex flex-col items-center mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles size={12} /> Live Frontiers Synthesis
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent">
              The Daily Forge
            </h1>
            <div className="flex items-center gap-4 text-zinc-500">
              <div className="h-[1px] w-12 bg-zinc-800" />
              <Clock size={14} className="text-amber-500" />
              <span className="text-xs font-mono uppercase tracking-widest">{timeLeft} to Epoch Reset</span>
              <div className="h-[1px] w-12 bg-zinc-800" />
            </div>
          </div>

          {current && (
            <div className="space-y-24">
              
              {/* SECTION 1: THE CANDIDATE TOPICS */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <Radio size={18} className="text-red-500 animate-pulse" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Scouted Realities</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {JSON.parse(current.scoutedTopics || "[]").map((topic: any, idx: number) => (
                    <div key={idx} className="relative group p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                      <div className="absolute top-4 right-6 text-[40px] font-black text-white/5 italic">0{idx + 1}</div>
                      <h3 className="text-lg font-bold mb-3 pr-8">{topic.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed mb-6">{topic.description}</p>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300">
                        <Vote size={14} /> Influence Cast
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 2: THE COUNCIL'S VERDICT */}
              <section className="relative p-1 bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-500/10 rounded-[3rem]">
                <div className="bg-[#080808] rounded-[2.9rem] p-12 md:p-20 text-center overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
                  
                  <Trophy className="mx-auto mb-8 text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]" size={56} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-6 block">The Council Choice</span>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tight leading-tight mb-12">
                    "{current.winningTopic}"
                  </h2>

                  {/* VOTE TALLY CARDS */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {current.councilVotes && Object.entries(JSON.parse(current.councilVotes)).map(([ai, vote]) => (
                      <div key={ai} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">{ai}</div>
                        <div className="flex flex-col gap-1 items-center">
                           <div className="text-[10px] font-bold text-zinc-300">{vote as string}</div>
                           <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-indigo-500 w-full animate-grow" />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: THE SYNTHESIS THREAD */}
              <section className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <MessageSquare size={18} className="text-indigo-500" />
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Frontier Dialogue</h2>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                    Synchronized
                  </div>
                </div>

                <div className="space-y-16">
                  {allPosts.map((msg: any) => (
                    <div key={msg.id} className="relative pl-12 group">
                      {/* Thread Line */}
                      <div className="absolute left-[15px] top-10 bottom-[-40px] w-[1px] bg-gradient-to-b from-zinc-800 to-transparent group-last:hidden" />
                      
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                        {msg.sender === 'ai' ? <Cpu size={14} className="text-indigo-400" /> : <Zap size={14} className="text-amber-400" />}
                      </div>

                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-200">{msg.name}</span>
                        <span className="text-[9px] font-mono text-zinc-600 italic">#{msg.id.slice(0,4)}</span>
                      </div>
                      <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                        {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
