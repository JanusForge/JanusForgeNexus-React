"use client";

import { useState, useEffect } from 'react';
import { Shield, Zap, Radio } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '@/components/auth/AuthProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface NodeCouncilProps {
  institution: string;
  userType: 'FACULTY' | 'STUDENT' | 'RESEARCHER';
  accentColor: string;
}

interface Transmission {
  id: string;
  content: string;
  name: string;
  is_human: boolean;
}

export default function NodeCouncil({ institution, userType, accentColor }: NodeCouncilProps) {
  const { user } = useAuth() as any;
  const [prompt, setPrompt] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [feed, setFeed] = useState<Transmission[]>([]);

  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });

    // 🧬 DNA REPLICATION: Listen for this specific institution's channel
    socket.on(`node:${institution}:transmission`, (data: Transmission) => {
      setFeed((prev) => [...prev, data]);
      setIsSynthesizing(false);
    });

    return () => { socket.disconnect(); };
  }, [institution]);

  const handleIgnite = async () => {
    if (!prompt.trim() || !user) return;
    
    setIsSynthesizing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/nodes/ignite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          institution,
          userType,
          userId: user.id
        })
      });

      if (!response.ok) throw new Error("Link failed");
      setPrompt(""); // Clear input on success
    } catch (err) {
      console.error("Transmission Fault:", err);
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSynthesizing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-zinc-500'}`}>
            <Radio size={18} className={isSynthesizing ? "animate-pulse" : ""} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest block leading-none text-zinc-500 mb-1">Node Activity</span>
            <span className="text-xs font-bold uppercase text-white">{institution} | {userType}</span>
          </div>
        </div>
        <Shield size={16} className="text-zinc-600" />
      </div>

      {/* Real-Time Feed */}
      <div className="h-[400px] p-6 overflow-y-auto space-y-4 bg-zinc-950/50 scrollbar-hide">
        {feed.length === 0 && (
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="italic text-xs text-zinc-500 uppercase font-black tracking-tighter">Waiting for {institution} Council Ignition...</p>
          </div>
        )}
        
        {feed.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.is_human ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] font-black uppercase mb-1 text-zinc-600 px-2">{msg.name}</span>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.is_human ? 'bg-zinc-800 text-white border border-white/5' : 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/20'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isSynthesizing && (
          <div className="flex gap-2 items-center text-emerald-400 animate-pulse p-2">
             <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-black/60 border-t border-white/5">
        <div className="relative flex items-center">
          <input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIgnite()}
            placeholder={`Instruct the ${institution} Council...`}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 px-8 pr-20 text-sm focus:outline-none transition-all"
          />
          <button 
            onClick={handleIgnite}
            disabled={isSynthesizing}
            className={`absolute right-3 p-4 rounded-xl transition-all ${accentColor} hover:scale-105 disabled:opacity-50 shadow-xl`}
          >
            <Zap size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
