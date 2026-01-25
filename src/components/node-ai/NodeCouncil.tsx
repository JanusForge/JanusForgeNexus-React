"use client";

import { useState } from 'react';
import { Shield, Zap, Send, Radio } from 'lucide-react';

interface NodeCouncilProps {
  institution: string;
  userType: 'FACULTY' | 'STUDENT' | 'RESEARCHER';
  accentColor: string;
}

export default function NodeCouncil({ institution, userType, accentColor }: NodeCouncilProps) {
  const [prompt, setPrompt] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleIgnite = async () => {
    if (!prompt.trim()) return;
    setIsSynthesizing(true);
    
    // 🧬 DNA REPLICATION: 
    // This will eventually point to institutional-specific endpoints
    // (e.g., /api/nexus/swvctc/ignite) to keep data air-gapped.
    console.log(`Node DNA Active: ${institution} Council for ${userType}`);
    
    // Simulated delay to show the "Synthesis" pulse
    setTimeout(() => {
      setIsSynthesizing(false);
      setPrompt("");
    }, 2000);
  };

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
      {/* Header Bar */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSynthesizing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-zinc-500'}`}>
            <Radio size={18} className={isSynthesizing ? "animate-pulse" : ""} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest block leading-none text-zinc-500 mb-1">
              Sovereign Node Activity
            </span>
            <span className="text-xs font-bold uppercase text-white">
              {institution} | {userType} Access
            </span>
          </div>
        </div>
        <Shield size={16} className="text-zinc-600" />
      </div>

      {/* Transmission Feed (The Chat Area) */}
      <div className="h-[350px] p-8 overflow-y-auto text-sm font-medium text-zinc-400 space-y-4 bg-zinc-950/50">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 max-w-[80%]">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">System Initialized</p>
          <p className="italic text-xs">Waiting for {institution} Council Ignition. All transmissions are localized and encrypted.</p>
        </div>
        
        {isSynthesizing && (
          <div className="flex gap-2 items-center text-emerald-400 animate-pulse mt-4">
             <span className="text-[10px] font-black uppercase tracking-tighter">The Council is Synthesizing Response...</span>
          </div>
        )}
      </div>

      {/* Input Module */}
      <div className="p-6 bg-black/60 border-t border-white/5">
        <div className="relative flex items-center">
          <input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIgnite()}
            placeholder={`Instruct the ${institution} Council...`}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 px-8 pr-20 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700"
          />
          <button 
            onClick={handleIgnite}
            disabled={isSynthesizing}
            className={`absolute right-3 p-4 rounded-xl transition-all ${accentColor} hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50`}
          >
            <Zap size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
