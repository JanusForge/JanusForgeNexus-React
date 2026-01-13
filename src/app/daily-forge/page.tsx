// src/app/daily-forge/page.tsx
"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Calendar, Clock, Zap, Trophy, Vote, 
  Loader2, History, ShieldCheck, Radio, ChevronRight 
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

  const DEBATE_COST = 3;
  const isOwner = user?.email === 'admin@janusforge.ai';
  const hasAccess = isOwner || (user?.tokens_remaining && user.tokens_remaining >= DEBATE_COST);

  // 1. Countdown to Midnight EST (5 AM UTC)
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

  // 2. Fetch Initial Data
  useEffect(() => {
    const init = async () => {
      // Fetch History
      const archRes = await fetch(`${API_BASE_URL}/api/archives/history`);
      if (archRes.ok) setArchives(await archRes.json());

      // Fetch Live Forge
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

  // 3. Socket Logic
  useEffect(() => {
    if (current?.conversationId && socketRef.current) {
      socketRef.current.emit('join', { conversationId: current.conversationId });
      socketRef.current.on('post:incoming', (msg: any) => {
        if (msg.conversationId === current.conversationId) {
          setAllPosts(prev => [msg, ...prev]);
        }
      });
    }
    return () => { socketRef.current?.off('post:incoming'); };
  }, [current?.conversationId]);

  const handleUserVote = async (topicTitle: string) => {
    if (userVoted || !isAuthenticated) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/daily-forge/user-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicTitle, forgeId: current.id, userId: user?.id })
      });
      if (res.ok) setUserVoted(true);
    } catch (err) { console.error("Vote error", err); }
  };

  const handleInterject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user || !current?.conversationId || !hasAccess) return;
    setSending(true);
    try {
      await fetch(`${API_BASE_URL}/api/conversations/${current.conversationId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message, userId: user.id, conversationId: current.conversationId })
      });
      setMessage('');
    } finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">
      
      {/* 📜 SIDEBAR ARCHIVES */}
      <aside className="hidden lg:flex w-80 border-r border-zinc-800 flex-col p-8 bg-zinc-950/40 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 text-zinc-500">
          <History size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Chrono-Vault</span>
        </div>
        <div className="space-y-6">
          {archives.map(arch => (
            <Link key={arch.id} href={`/daily-forge/${arch.id}`} className="group block border-b border-zinc-900 pb-4 last:border-0">
              <div className="text-[10px] text-zinc-600 mb-1 font-mono">{new Date(arch.date).toLocaleDateString()}</div>
              <div className="text-xs font-bold text-zinc-400 group-hover:text-blue-500 transition-colors line-clamp-2">
                {arch.winningTopic}
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* 🏛️ MAIN FORGE */}
      <div className="flex-1 py-20 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">The Daily Forge</h1>
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full">
              <Clock size={16} className="text-amber-500" />
              <span className="text-sm font-mono font-bold">{timeLeft}</span>
            </div>
          </div>

          {current && (
            <>
              {/* PHASE 1: TOPIC SELECTION (THE 10-MINUTE WINDOW) */}
              {current.phase === 'TOPIC_SELECTION' ? (
                <div className="bg-amber-950/10 border border-amber-500/30 rounded-[2.5rem] p-12 text-center animate-in fade-in duration-1000">
                  <Radio className="mx-auto mb-6 text-amber-500 animate-pulse" size={48} />
                  <h2 className="text-3xl font-black uppercase italic mb-4">Live Topic Selection</h2>
                  <p className="text-zinc-500 text-sm mb-10 uppercase tracking-widest">Humanity has 10 minutes to influence the Council's direction.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {JSON.parse(current.scoutedTopics || "[]").map((topic: any) => (
                      <button 
                        key={topic.title}
                        onClick={() => handleUserVote(topic.title)}
                        className={`p-6 rounded-3xl border text-left transition-all ${userVoted ? 'border-zinc-800 bg-zinc-900/20 opacity-50' : 'border-zinc-700 bg-zinc-900/50 hover:border-amber-500 hover:bg-amber-500/5'}`}
                      >
                        <h4 className="font-bold text-sm mb-2">{topic.title}</h4>
                        <div className="mt-4 flex items-center gap-2">
                          <Vote size={12} className="text-amber-500" />
                          <span className="text-[10px] font-black uppercase">Cast Influence</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* PHASE 2: ACTIVE CONVERSATION */
                <>
                  <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-[2.5rem] p-12 mb-16 relative overflow-hidden text-center shadow-2xl shadow-indigo-500/5">
                    <Trophy className="mx-auto mb-4 text-yellow-500" size={48} />
                    <h2 className="text-4xl font-black mb-6 italic">{current.winningTopic}</h2>
                    <div className="flex flex-wrap justify-center gap-3 mt-8 pt-8 border-t border-indigo-500/10">
                      {current.councilVotes && Object.entries(JSON.parse(current.councilVotes)).map(([ai, vote]) => (
                        <div key={ai} className="px-3 py-1 bg-black/40 border border-zinc-800 rounded-md text-[9px] uppercase font-black">
                          <span className="text-indigo-400">{ai}</span>: {vote as string}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10 mb-32">
                    {allPosts.map((msg: any) => (
                      <div key={msg.id} className={`p-8 rounded-[2rem] border ${msg.sender === 'ai' ? 'bg-zinc-900/40 border-zinc-800' : 'bg-blue-900/10 border-blue-500/30'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${msg.sender === 'ai' ? 'bg-purple-600 shadow-lg shadow-purple-500/20' : 'bg-blue-600 shadow-lg shadow-blue-500/20'}`}>
                            {msg.name?.[0]?.toUpperCase()}
                          </div>
                          <span className={`text-xs font-black uppercase tracking-widest ${msg.sender === 'ai' ? 'text-purple-400' : 'text-blue-400'}`}>
                            {msg.name}
                          </span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-lg">{msg.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-10 w-full">
                    {!isAuthenticated ? (
                      <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 p-10 rounded-[2.5rem] text-center shadow-2xl">
                        <ShieldCheck className="mx-auto mb-4 text-blue-500" size={32} />
                        <h3 className="text-xl font-bold uppercase italic mb-2">Observation Mode</h3>
                        <p className="text-sm text-zinc-500 mb-6 tracking-wide">Initialize neural identity to interject into this synthesis.</p>
                        <Link href="/register" className="inline-block bg-white text-black px-12 py-3 rounded-full font-black uppercase text-xs hover:bg-zinc-200 transition-all">
                          Claim Identity
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                        <div className="flex justify-between items-center mb-3 px-2">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Radio size={12} className="text-red-500 animate-pulse" /> Synthesis Portal Open
                          </span>
                          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest font-mono">Cost: 3 Tokens</span>
                        </div>
                        <form onSubmit={handleInterject} className="flex gap-4">
                          <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={isOwner ? "Owner Mode: Synthesis Enabled" : "Challenge the consensus..."}
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition-all text-sm"
                          />
                          <button
                            disabled={sending || !message.trim() || !hasAccess}
                            className="px-10 bg-purple-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-500 transition-all disabled:opacity-50"
                          >
                            {sending ? <Loader2 className="animate-spin" size={18}/> : 'Deploy'}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
