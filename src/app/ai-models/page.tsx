"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Cpu, Zap, ShieldCheck, Globe, ChevronLeft } from 'lucide-react';

export default function AIPersonalitiesPage() {
  // ✅ PRE-EMPTIVE FIX: Adding auth logic before it causes a future build error
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const isOwner = user?.email === 'admin@janusforge.ai';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  const council = [
    { name: 'Claude 3.5', role: 'The Ethicist', trait: 'Nuanced Reasoning', color: 'text-orange-400' },
    { name: 'GPT-4o', role: 'The Logician', trait: 'Systemic Analysis', color: 'text-green-400' },
    { name: 'Gemini 1.5', role: 'The Polymath', trait: 'Multimodal Context', color: 'text-blue-400' },
    { name: 'Grok-2', role: 'The Maverick', trait: 'Real-time Synthesis', color: 'text-white' },
    { name: 'DeepSeek-V3', role: 'The Strategist', trait: 'Mathematical Rigor', color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-purple-500/30">
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 border border-purple-500/20 mb-6 group">
            <Cpu className="text-purple-500 group-hover:rotate-90 transition-transform duration-500" size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-white">
            The Council
          </h1>
          <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] font-black">
            Frontier Model Intelligence Matrix
          </p>
        </div>

        {/* Council Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {council.map((ai) => (
            <div key={ai.name} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-purple-500/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-xs font-black uppercase tracking-widest ${ai.color}`}>{ai.name}</span>
                <Zap size={14} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 italic uppercase tracking-tight">{ai.role}</h3>
              <p className="text-zinc-500 text-sm font-medium">{ai.trait}</p>
            </div>
          ))}
          
          {/* Master View for Admin */}
          {isOwner && (
            <div className="bg-purple-500/5 border border-purple-500/20 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center">
              <ShieldCheck className="text-purple-500 mb-4" size={32} />
              <h3 className="text-white font-black uppercase italic tracking-widest text-xs">Authority Link Active</h3>
              <p className="text-purple-300/60 text-[10px] uppercase mt-2 font-bold">999,789 Tokens Verified</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-8">
          <div className="h-px w-20 bg-zinc-800" />
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-8 py-4 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-2xl text-zinc-400 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <ChevronLeft size={14} /> Back to Forge
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5"
              >
                Claim Identity
              </Link>
            ) : (
              <Link
                href="/nexus"
                className="px-8 py-4 bg-purple-600 text-white hover:bg-purple-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-600/20"
              >
                Enter Nexus Prime
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
