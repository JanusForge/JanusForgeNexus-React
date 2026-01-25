"use client";

import { Activity, Shield, Cpu, Zap, ArrowLeft, GlobeLock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import NodeCouncil from '@/components/node-ai/NodeCouncil';

export default function SWVCTCDashboard() {
  const [activeRole, setActiveRole] = useState<'FACULTY' | 'STUDENT'>('FACULTY');

  const nodeStats = [
    { label: "Local GPU Load", value: "42%", icon: <Cpu size={18} />, color: "text-emerald-400" },
    { label: "Sovereignty Status", value: "100% LOCAL", icon: <GlobeLock size={18} />, color: "text-blue-400" },
    { label: "Active Referees", value: "12 Faculty", icon: <Activity size={18} />, color: "text-amber-400" },
    { label: "Stigma Guardrail", value: "ACTIVE", icon: <Shield size={18} />, color: "text-indigo-400" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/institutions" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-4 text-xs font-black uppercase tracking-widest">
              <ArrowLeft size={14} /> Regional Hub
            </Link>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#87CEEB]">
              Southern WV <span className="text-white">Node</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Logan Campus Core</p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
             <div className="bg-[#CFB53B]/10 border border-[#CFB53B]/20 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[#CFB53B] font-black uppercase text-xs tracking-widest text-center">Neural Link: Active</span>
             </div>
             {/* ROLE SWITCHER */}
             <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-white/5">
                <button 
                  onClick={() => setActiveRole('FACULTY')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'FACULTY' ? 'bg-[#87CEEB] text-black' : 'text-zinc-500'}`}
                >
                  Faculty
                </button>
                <button 
                  onClick={() => setActiveRole('STUDENT')}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeRole === 'STUDENT' ? 'bg-[#CFB53B] text-black' : 'text-zinc-500'}`}
                >
                  Student
                </button>
             </div>
          </div>
        </div>

        {/* --- MAIN INTERACTIVE GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* THE COUNCIL CLONE */}
          <div className="lg:col-span-2">
            <NodeCouncil 
              institution="SWVCTC" 
              userType={activeRole} 
              accentColor={activeRole === 'FACULTY' ? 'bg-[#87CEEB]' : 'bg-[#CFB53B]'} 
            />
          </div>

          {/* TELEMETRY COLUMN */}
          <div className="space-y-4">
            {nodeStats.map((stat) => (
              <div key={stat.label} className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} opacity-70`}>{stat.icon}</div>
                  <div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xl font-black italic uppercase tracking-tighter">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* INTEGRITY LOG MODULE */}
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2rem] mt-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-500">Integrity Logs</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4">
                  <p className="text-[9px] font-black text-zinc-600 uppercase">08:45 AM</p>
                  <p className="text-[11px] font-bold">Predictive audit: No bias detected.</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <p className="text-[9px] font-black text-zinc-600 uppercase">07:22 AM</p>
                  <p className="text-[11px] font-bold">Data Sovereignty: 100% Local.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
