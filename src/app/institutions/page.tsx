"use client";

import { School, ShieldCheck } from 'lucide-react';

export default function InstitutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <School size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Institutional Hub</h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Regional AI Readiness Mapping</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl">
            <h2 className="text-xl font-black mb-4">Southern WV CTC</h2>
            <p className="text-zinc-400 mb-6 font-medium leading-relaxed">
              $1.8M AI Readiness Initiative. FIPSE Grant synchronization pending...
            </p>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} />
              Status: Active Strategy Node
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
