"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Clock, Trophy, Vote, Loader2, History, Radio, Sparkles, Cpu, MessageSquare, Zap 
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

  useEffect(() => {
    const init = async () => {
      const archRes = await fetch(`${API_BASE_URL}/api/daily-forge/history`);
      if (archRes.ok) setArchives(await archRes.json());
      const forgeRes = await fetch(`${API_BASE_URL}/api/daily-forge/current`);
      if (forgeRes.ok) setCurrent(await forgeRes.json());
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col lg:flex-row font-sans">
      <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col p-8 bg-black/20 backdrop-blur-md sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10 text-indigo-500/70">
          <History size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Chrono-Vault</span>
        </div>
        <div className="space-y-4">
          {archives.map(arch => (
            <Link key={arch.id} href={`/daily-forge/${arch.id}`} className="group block p-4 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all">
              <div className="text-[9px] text-zinc-600 mb-1 font-mono">{new Date(arch.date).toLocaleDateString()}</div>
              <div className="text-xs font-bold text-zinc-400 group-hover:text-white line-clamp-2">{arch.winningTopic}</div>
            </Link>
          ))}
        </div>
      </aside>

      <main className="flex-1 py-12 md:py-20 px-4 md:px-12 lg:px-24 max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-24 text-center">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 text-gradient">The Daily Forge</h1>
          <div className="flex items-center gap-4 text-zinc-500">
             <Clock size={14} className="text-amber-500" />
             <span className="text-xs font-mono tracking-widest">{timeLeft} to Epoch Reset</span>
          </div>
        </div>

        {current && (
          <section className="relative p-1 bg-gradient-to-br from-indigo-500/20 via-transparent to-amber-500/10 rounded-[3rem]">
            <div className="bg-[#080808] rounded-[2.9rem] p-12 md:p-20 text-center relative overflow-hidden">
              <Trophy className="mx-auto mb-8 text-amber-500 shadow-amber-500/20" size={56} />
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tight leading-tight mb-12">"{current.winningTopic}"</h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {current.councilVotes && Object.entries(JSON.parse(current.councilVotes)).map(([ai, vote]) => (
                  <div key={ai} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">{ai}</div>
                    <div className="text-[10px] font-bold text-zinc-300">{vote as string}</div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-indigo-500 animate-grow" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
