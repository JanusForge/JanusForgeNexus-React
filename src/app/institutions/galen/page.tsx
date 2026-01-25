"use client";

import { Activity, Shield, Zap, ArrowLeft, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import NodeCouncil from '@/components/node-ai/NodeCouncil';

export default function GalenDashboard() {
  const [activeRole, setActiveRole] = useState<'FACULTY' | 'STUDENT'>('FACULTY');

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/institutions" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-xs font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Regional Hub
            </Link>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#007CBA]">
              Galen <span className="text-white">Nursing Node</span>
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3">
             <div className="bg-[#007CBA]/10 border border-[#007CBA]/20 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[#007CBA] font-black uppercase text-xs tracking-widest">Sim-Link: Established</span>
             </div>
             <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-white/5">
                <button onClick={() => setActiveRole('FACULTY')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'FACULTY' ? 'bg-[#007CBA] text-white' : 'text-zinc-500'}`}>Clinical Faculty</button>
                <button onClick={() => setActiveRole('STUDENT')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'STUDENT' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>LPN/RN Student</button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NodeCouncil institution="Galen" userType={activeRole} accentColor="bg-[#007CBA]" />
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] h-fit">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-500">Integrity Logs</h2>
            <div className="bg-black/30 p-4 rounded-xl border-l-2 border-[#007CBA]">
              <p className="text-[11px] font-bold">Sim telemetry scrubbed: Patient privacy active.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
