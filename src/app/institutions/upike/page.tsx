"use client";

import { Activity, Shield, Zap, ArrowLeft, Microscope, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import NodeCouncil from '@/components/node-ai/NodeCouncil';

export default function UPIKEDashboard() {
  const [activeRole, setActiveRole] = useState<'FACULTY' | 'STUDENT' | 'RESEARCHER'>('FACULTY');

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/institutions" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-xs font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Regional Hub
            </Link>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#FF671D]">
              UPIKE <span className="text-white">Elliott Node</span>
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3">
             <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,103,29,0.5)]" />
                <span className="text-orange-500 font-black uppercase text-xs tracking-widest">Medical Mesh: Secure</span>
             </div>
             <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-white/5">
                <button onClick={() => setActiveRole('FACULTY')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'FACULTY' ? 'bg-[#FF671D] text-black' : 'text-zinc-500'}`}>Clinical Faculty</button>
                <button onClick={() => setActiveRole('RESEARCHER')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'RESEARCHER' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Researcher</button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NodeCouncil institution="UPIKE Elliott" userType={activeRole} accentColor="bg-[#FF671D]" />
          </div>
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem]">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-orange-500">Compliance Audit</h2>
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-xl border-l-2 border-orange-500">
                  <p className="text-[9px] font-black text-zinc-500 uppercase">HIPAA Status</p>
                  <p className="text-[11px] font-bold">100% On-Premise Processing Verified.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
