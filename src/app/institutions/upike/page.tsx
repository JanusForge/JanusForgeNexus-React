"use client";

import { Activity, Shield, Cpu, Zap, ArrowLeft, Microscope, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function UPIKEDashboard() {
  const nodeStats = [
    { label: "Clinical Audit Load", value: "28%", icon: <Stethoscope size={18} />, color: "text-orange-500" },
    { label: "HIPAA Compliance", value: "VERIFIED", icon: <Shield size={18} />, color: "text-emerald-400" },
    { label: "Nursing Cohorts", value: "4 Active", icon: <Activity size={18} />, color: "text-blue-400" },
    { label: "Node Latency", value: "0.8ms", icon: <Zap size={18} />, color: "text-orange-400" },
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
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-[#FF671D]">
              UPIKE <span className="text-white">Elliott Node</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em] mt-2">Clinical Simulation & Medical Research Hub</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,103,29,0.5)]" />
            <span className="text-orange-500 font-black uppercase text-xs tracking-widest">Medical Mesh: Secure</span>
          </div>
        </div>

        {/* --- TELEMETRY GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {nodeStats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl group hover:border-orange-500/20 transition-all">
              <div className={`${stat.color} mb-3 opacity-70 group-hover:opacity-100 transition-opacity`}>
                {stat.icon}
              </div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black italic uppercase tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- PILLAR 1: MEDICAL RESEARCH CORE --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Microscope size={140} className="text-orange-500" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                 <Microscope size={20} className="text-orange-500" /> Clinical Intelligence Core
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Models</p>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-tight text-emerald-400">Bio-Med Llama 3 (Local)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-xs font-bold uppercase tracking-tight text-blue-400">Clinical-GPT-4o (Hybrid)</span>
                    </div>
                 </div>
                 <div className="bg-orange-500/5 border border-orange-500/10 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-black text-orange-500 uppercase mb-2">Sovereign Data Storage</p>
                    <p className="text-lg font-black uppercase tracking-tighter italic">Pikeville Campus Mesh Active</p>
                 </div>
               </div>
            </div>

            {/* --- PILLAR 2: NURSING & OPTOMETRY MODULES --- */}
            <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem]">
               <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3 text-orange-500">
                 <Stethoscope size={20} /> Professional Training Interface
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-orange-500/50 transition-all group relative">
                    <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">New Cases</div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Nursing School</p>
                    <p className="text-sm font-black uppercase italic tracking-tighter">Diagnostic Reasoning Lab</p>
                 </button>
                 <button className="p-6 bg-black border border-white/5 rounded-2xl text-left hover:border-blue-400/50 transition-all group">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">KYCO Optometry</p>
                    <p className="text-sm font-black uppercase italic tracking-tighter">Ocular Health AI Review</p>
                 </button>
               </div>
            </div>
          </div>

          {/* --- PILLAR 3: HIPAA & PRIVACY LOGS --- */}
          <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] h-fit">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
               <Shield size={20} className="text-emerald-400" /> Compliance Audit
            </h2>
            <div className="space-y-4">
               {[
                 { time: "10:15 AM", msg: "De-identification protocol verified for Patient-Dataset-42." },
                 { time: "09:30 AM", msg: "Peer-review session started: Adversarial Clinical Debate." },
                 { time: "Yesterday", msg: "Encryption keys cycled: UPIKE-Elliott-Core-A." }
               ].map((log, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border-l-2 border-orange-500">
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
