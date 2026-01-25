"use client";

import { Activity, Shield, Cpu, Zap, ArrowLeft, Construction, HardHat, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function BSCTCDashboard() {
  const nodeStats = [
    { label: "Industrial AI Load", value: "34%", icon: <Wrench size={18} />, color: "text-[#e7a614]" },
    { label: "Safety Protocols", value: "CERTIFIED", icon: <Shield size={18} />, color: "text-emerald-400" },
    { label: "Vocational Labs", value: "6 Active", icon: <Construction size={18} />, color: "text-blue-400" },
    { label: "Node Uptime", value: "99.9%", icon: <Zap size={18} />, color: "text-[#e7a614]" },
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
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#00467f]">
              Big Sandy <span className="text-white">Mayo Node</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Industrial Maintenance & Workforce AI Hub</p>
          </div>
          <div className="bg-[#e7a614]/10 border border-[#e7a614]/20 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="w-3 h-3 bg-[#e7a614] rounded-full animate-pulse shadow-[0_0_10px_rgba(231,166,20,0.5)]" />
            <span className="text-[#e7a614] font-black uppercase text-xs tracking-widest text-center">Industrial Mesh: Active</span>
          </div>
        </div>

        {/* --- TELEMETRY GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {nodeStats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl group hover:border-[#00467f]/30 transition-all">
              <div className={`${stat.color} mb-3 opacity-70 group-hover:opacity-100 transition-opacity`}>
                {stat.icon}
              </div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- PILLAR 1: INDUSTRIAL AI CORE --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <HardHat size={140} className="text-[#e7a614]" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                 <Cpu size={20} className="text-[#00467f]" /> Workforce Intelligence Engine
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Local Workforce Models</p>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-tight text-yellow-500">Industrial-Safety-Llama (Local)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-tight text-blue-400">Technical-Manual-GPT (Cached)</span>
                    </div>
                 </div>
                 <div className="bg-[#00467f]/5 border border-[#00467f]/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black text-[#00467f] uppercase mb-2">Resilience Protocol</p>
                    <p className="text-lg font-black uppercase tracking-tighter italic">Paintsville/Mayo Fiber Failover Enabled</p>
                 </div>
               </div>
            </div>

            {/* --- PILLAR 2: VOCATIONAL TRAINING INTERFACE --- */}
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem]">
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3 text-[#e7a614]">
                 <Wrench size={20} /> Applied Training Modules
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-[#00467f]/50 transition-all group relative">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Welding & Fabrication</p>
                    <p className="text-sm font-black uppercase italic tracking-tighter">Blueprint AI Interpretation</p>
                 </button>
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-[#e7a614]/50 transition-all group">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Industrial Maintenance</p>
                    <p className="text-sm font-black uppercase italic tracking-tighter">Predictive Failure Simulation</p>
                 </button>
               </div>
            </div>
          </div>

          {/* --- PILLAR 3: WORKFORCE READINESS LOGS --- */}
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-fit">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
               <Shield size={20} className="text-emerald-400" /> Regional Compliance
            </h2>
            <div className="space-y-4">
               {[
                 { time: "11:00 AM", msg: "Industrial Tech dataset sync complete." },
                 { time: "08:15 AM", msg: "Safety Referee session: OSHA Guidelines Debate." },
                 { time: "Yesterday", msg: "Local cache updated: HVAC Maintenance Manuals." }
               ].map((log, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border-l-2 border-[#00467f]">
                  <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{log.time}</p>
                  <p className="text-[11px] font-bold tracking-tight leading-relaxed">{log.msg}</p>
                </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
