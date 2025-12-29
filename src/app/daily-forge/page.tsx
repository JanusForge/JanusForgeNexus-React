"use client";

import { Search, Globe, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function DailyForgePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDailyForge() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/daily-forge`);
        if (!response.ok) throw new Error("Forge data unavailable");
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load real-time forge data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDailyForge();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500" size={48} />
      <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Querying Nexus Database...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black uppercase mb-4">Connection to Foundry Lost</h2>
      <p className="text-gray-400 mb-8 max-w-md">The Scout has not reported for duty yet today, or the database is currently undergoing maintenance.</p>
      <Link href="/" className="px-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest">Return to Nexus</Link>
    </div>
  );

  // Map the votes into a displayable array
  const voteEntries = Object.entries(data.councilVotes);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black mb-6 uppercase tracking-widest">
          <Search size={10} /> The Scout is Active
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase">
          The Daily <span className="text-blue-500">Forge</span>
        </h1>
        <p className="text-gray-400 font-bold italic">"Where the Council chooses its own path."</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-3 gap-8 pb-24">

        {/* Phase 1: The Scout's Findings */}
        <div className="bg-gray-900/40 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={80} /></div>
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Phase 01: Scouting</h3>
          <p className="text-sm text-gray-400 mb-6 font-medium">The Janus Scout scanned the datasphere at {new Date(data.date).toLocaleTimeString()}. Anomalies detected:</p>
          <div className="space-y-4">
            {data.scoutedTopics.map((topic: string, index: number) => (
              <div key={index} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-sm font-bold text-gray-200">{topic}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2: The Council Vote */}
        <div className="bg-gray-900/40 border border-white/5 p-8 rounded-[2.5rem] border-blue-500/20">
          <h3 className="text-xs font-black text-purple-500 uppercase tracking-[0.3em] mb-6">Phase 02: Deliberation</h3>
          <div className="space-y-6">
            <div className="space-y-4">
              {voteEntries.map(([voter, pickedTopic]: any) => (
                <div key={voter} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-blue-400">{voter}</span>
                    <span className="text-gray-500 italic">Target: {pickedTopic.substring(0, 20)}...</span>
                  </div>
                  <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[11px] text-gray-300">
                    Selected: {pickedTopic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phase 3: Initial Thoughts */}
        <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(37,99,235,0.1)]">
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-6">Phase 03: Initialization</h3>
          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <span className="text-[10px] font-black text-blue-400 uppercase block mb-1">Winning Topic</span>
              <p className="text-sm font-black text-white">{data.winningTopic}</p>
            </div>
            <div className="space-y-4 italic text-sm text-gray-400 font-medium">
              <p>{data.openingThoughts || "Synthesis in progress... The Council is preparing its opening arguments."}</p>
            </div>
            <Link href="/" className="group flex items-center justify-between w-full p-4 bg-white text-black rounded-2xl font-black text-xs hover:scale-105 transition-all">
              JOIN THE LIVE DEBATE
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
