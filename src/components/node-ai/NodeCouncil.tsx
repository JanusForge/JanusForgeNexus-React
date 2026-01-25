"use client";

import { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Radio, Lock } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🏛️ 1. PRIVATE HISTORY RECOVERY
  // Only fetches threads owned by THIS user, tagged for THIS institution/role
  useEffect(() => {
    const fetchPrivateHistory = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/nodes/history?institution=${institution}&userType=${userType}&userId=${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setFeed(data);
        }
      } catch (err) {
        console.error("Node History Retrieval Fault:", err);
      }
    };

    fetchPrivateHistory();
  }, [institution, userType, user]);

  // 🧬 2. REAL-TIME NODE SYNC
  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });

    // Listen only for transmissions meant for this specific node context
    socket.on(`node:${institution}:transmission`, (data: Transmission) => {
      setFeed((prev) => [...prev, data]);
      setIsSynthesizing(false);
    });

    return () => { socket.disconnect(); };
  }, [institution]);

  // Auto-scroll to latest transmission
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [feed]);

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
      setPrompt(""); 
    } catch (err) {
      console.error("Node Transmission Fault:", err);
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500">
      {/* --- PRIVATE HEADER --- */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSynthesizing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-zinc-500'}`}>
            <Radio size={18} className={isSynthesizing ? "animate-pulse" : ""} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={10} className="text-zinc-600" />
              <span className="text-[10px] font-black uppercase tracking-widest block leading-none text-zinc-600">
                Private Sovereign Node
              </span>
            </div>
            <span className="text-xs font-bold uppercase text-white tracking-tight">
              {institution} | {userType} Session
            </span>
          </div>
        </div>
        <Shield size={16} className="text-zinc-700" />
      </div>

      {/* --- TRANSMISSION FEED --- */}
      <div 
        ref={scrollRef}
        className="h-[450px] p-8 overflow-y-auto space-y-6 bg-zinc-950/50 scrollbar-hide"
      >
        {feed.length === 0 && (
          <div className="p-6 border border-white/5 rounded-3xl bg-white/5 text-center">
            <p className="italic text-xs text-zinc-500 uppercase font-black tracking-widest">
              Initializing Secure {institution} Feed...
            </p>
          </div>
        )}
        
        {feed.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.is_human ? 'items-end' : 'items-start'}`}>
            <span className="text-[9px] font-black uppercase mb-2 text-zinc-600 px-2 tracking-widest">
              {msg.is_human ? 'Sovereign User' : msg.name.replace(`${institution}_`, '')}
            </span>
            <div className={`p-5 rounded-3xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
              msg.is_human 
                ? 'bg-zinc-800 text-white border border-white/5' 
                : 'bg-indigo-500/10 text-indigo-100 border border-indigo-500/20'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isSynthesizing && (
          <div className="flex gap-2 items-center text-emerald-400 animate-pulse p-2">
             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Council is Synthesizing...</span>
          </div>
        )}
      </div>

      {/* --- SECURE INPUT --- */}
      <div className="p-6 bg-black/60 border-t border-white/5">
        <div className="relative flex items-center">
          <input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleIgnite()}
            placeholder={`Instruct the ${institution} Council...`}
            className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 px-8 pr-20 text-sm focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700 shadow-inner"
          />
          <button 
            onClick={handleIgnite}
            disabled={isSynthesizing}
            className={`absolute right-3 p-4 rounded-xl transition-all ${accentColor} hover:scale-105 disabled:opacity-50 shadow-2xl text-white`}
          >
            <Zap size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
