"use client";

import { Activity, Shield, Cpu, Zap, ArrowLeft, HeartPulse, ClipboardCheck, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function GalenDashboard() {
  const nodeStats = [
    { label: "Simulation Load", value: "18%", icon: <Activity size={18} />, color: "text-[#007CBA]" },
    { label: "NCLEX Readiness", value: "94%", icon: <ClipboardCheck size={18} />, color: "text-emerald-400" },
    { label: "Clinical Hours", value: "Live Sync", icon: <HeartPulse size={18} />, color: "text-red-400" },
    { label: "Node Security", value: "WPA3-AES", icon: <Shield size={18} />, color: "text-[#003366]" },
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
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#007CBA]">
              Galen <span className="text-white">Nursing Node</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Clinical Simulation & Workforce Intelligence</p>
          </div>
          <div className="bg-[#007CBA]/10 border border-[#007CBA]/20 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="w-3 h-3 bg-[#007CBA] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,124,186,0.5)]" />
            <span className="text-[#007CBA] font-black uppercase text-xs tracking-widest text-center">Sim-Link: Established</span>
          </div>
        </div>

        {/* --- TELEMETRY GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {nodeStats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl group hover:border-[#007CBA]/30 transition-all">
              <div className={`${stat.color} mb-3 opacity-70 group-hover:opacity-100 transition-opacity`}>
                {stat.icon}
              </div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- PILLAR 1: CLINICAL SIMULATION CORE --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <HeartPulse size={140} className="text-[#007CBA]" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                 <Thermometer size={20} className="text-[#007CBA]" /> Patient Simulation Engine
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Sim Models</p>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-tight text-emerald-400">Clinical-Logic-13B (Local)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-tight text-blue-400">NCLEX-Tutor-GPT (Cached)</span>
                    </div>
                 </div>
                 <div className="bg-[#007CBA]/5 border border-[#007CBA]/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black text-[#007CBA] uppercase mb-2">HCA Network link</p>
                    <p className="text-lg font-black uppercase tracking-tighter italic">Pikeville Clinical Data Ring Active</p>
                 </div>
               </div>
            </div>

            {/* --- PILLAR 2: NURSING EXAM INTERFACE --- */}
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem]">
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3 text-emerald-400">
                 <ClipboardCheck size={20} /> Professional Certification Lab
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-[#007CBA]/50 transition-all group relative">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Board Prep</p>
                    <p className="text-sm font-black uppercase italic tracking-tighter">NCLEX Adversarial Quizzer</p>
                 </button>
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-red-400/50 transition-all group">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Simulation</p>
                    <p className="text-sm font-black uppercase italic tracking-tighter">Emergency Response AI Relay</p>
                 </button>
               </div>
            </div>
          </div>

          {/* --- PILLAR 3: HIPAA COMPLIANCE LOGS --- */}
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-fit">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
               <Shield size={20} className="text-blue-400" /> Compliance Monitor
            </h2>
            <div className="space-y-4">
               {[
                 { time: "02:00 PM", msg: "Simulated patient telemetry scrubbed." },
                 { time: "11:45 AM", msg: "Referee Module: Clinical Judgment Bias Audit." },
                 { time: "Yesterday", msg: "Node Heartbeat: Pikeville-Galen-Sim-01." }
               ].map((log, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border-l-2 border-[#007CBA]">
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
