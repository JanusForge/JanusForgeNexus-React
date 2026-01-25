"use client";

import { Activity, Shield, Cpu, Zap, ArrowLeft, AlertTriangle, GlobeLock } from 'lucide-react';
import Link from 'next/link';

export default function SWVCTCDashboard() {
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
              <ArrowLeft size={14} /> Back to Regional Hub
            </Link>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#87CEEB]">
              Southern WV <span className="text-white">Node</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Logan Campus Infrastructure Core</p>
          </div>
          <div className="bg-[#CFB53B]/10 border border-[#CFB53B]/20 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[#CFB53B] font-black uppercase text-xs tracking-widest text-center">Neural Link: Synchronized</span>
          </div>
        </div>

        {/* --- TELEMETRY GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {nodeStats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all">
              <div className={`${stat.color} mb-3 opacity-50 group-hover:opacity-100 transition-opacity`}>
                {stat.icon}
              </div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- PILLAR 1: SOVEREIGN EDGE MONITOR --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Cpu size={120} />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                 <Zap size={20} className="text-yellow-400" /> Sovereign Edge Hardware
               </h2>
               <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                   <span className="text-zinc-500">Node Cluster ID:</span>
                   <span>LOGAN-NODE-01</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                   <span className="text-zinc-500">LLM Cache Status:</span>
                   <span className="text-emerald-400">OPTIMIZED (Llama-3-70B-Q4)</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                   <span className="text-zinc-500">Offline Resilience:</span>
                   <span className="text-blue-400">READY (72hr Cache Active)</span>
                 </div>
               </div>
               <button className="mt-8 w-full py-4 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#87CEEB] transition-colors shadow-lg">
                 Reboot Local Core
               </button>
            </div>

            {/* --- PILLAR 2: FACULTY REFEREE INTERFACE --- */}
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem]">
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                 <Activity size={20} className="text-amber-400" /> Faculty Referee Control
               </h2>
               <p className="text-zinc-400 text-sm font-medium mb-6">
                 Launch adversarial simulation modules for classroom instruction and AI literacy certification.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-amber-400/50 transition-all group">
                   <p className="text-[10px] font-black text-amber-500 uppercase mb-1">Nursing Module</p>
                   <p className="text-sm font-black uppercase italic tracking-tighter">Clinical Ethics Debate</p>
                 </button>
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-blue-400/50 transition-all group">
                   <p className="text-[10px] font-black text-blue-500 uppercase mb-1">IT Module</p>
                   <p className="text-sm font-black uppercase italic tracking-tighter">Cyber-Defense Simulation</p>
                 </button>
               </div>
            </div>
          </div>

          {/* --- PILLAR 3: PRIVACY GUARDRAIL LOGS --- */}
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-fit">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
               <Shield size={20} className="text-indigo-400" /> Integrity Logs
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-emerald-500 pl-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase">08:45 AM</p>
                <p className="text-[11px] font-bold">Predictive audit complete: No bias detected in Nursing Cohort B.</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase">07:22 AM</p>
                <p className="text-[11px] font-bold">Data Sovereignty Check: 100% of packets remained regional.</p>
              </div>
              <div className="border-l-2 border-amber-500 pl-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase">Yesterday</p>
                <p className="text-[11px] font-bold text-zinc-400">Referee Module: Prof. Miller certified Level 1 Fluency.</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-[9px] font-black uppercase text-red-500 leading-tight">
                Warning: External cloud sync attempt blocked by Logan Privacy Guardrail.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
