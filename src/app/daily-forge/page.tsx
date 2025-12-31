"use client";

import { 
  Search, Globe, ChevronRight, Loader2, 
  Rss, Printer, Save, Share2, MessageSquare, Volume2, Square, Mail, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function DailyForgePage() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [syncingSubscription, setSyncingSubscription] = useState(false);

  useEffect(() => {
    async function fetchDailyForge() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/daily-forge`, { cache: 'no-store' });
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

    // Set initial subscription state from user data
    if (user) {
      setIsSubscribed((user as any).digest_subscribed ?? true);
    }
  }, [user]);

  // --- 🎙️ AI VOICE LOGIC ---
  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const thoughts = Array.isArray(data.openingThoughts)
      ? data.openingThoughts
      : (typeof data.openingThoughts === 'string' ? JSON.parse(data.openingThoughts) : []);

    const fullText = thoughts.map((t: any) => `${t.model} perspective: ${t.content}`).join(". Next. ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.85; 
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  };

  // --- 📧 SUBSCRIPTION TOGGLE LOGIC ---
  const toggleSubscription = async () => {
    if (!isAuthenticated) return; // Prompt login or handle redirect
    setSyncingSubscription(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/toggle-digest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, subscribe: !isSubscribed })
      });
      if (response.ok) setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.error("Subscription sync failed:", err);
    } finally {
      setSyncingSubscription(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-500" size={48} />
      <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Querying Nexus Intelligence...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter">Connection to Foundry Lost</h2>
      <p className="text-gray-400 mb-8 max-w-md italic">The Scout has not reported for duty yet today, or the database is currently undergoing maintenance.</p>
      <Link href="/" className="px-8 py-4 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all">Return to Nexus</Link>
    </div>
  );

  const thoughts = Array.isArray(data.openingThoughts)
    ? data.openingThoughts
    : (typeof data.openingThoughts === 'string' ? JSON.parse(data.openingThoughts) : []);

  const voteEntries = typeof data.councilVotes === 'string'
    ? Object.entries(JSON.parse(data.councilVotes))
    : Object.entries(data.councilVotes || {});

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 pb-24">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-8 uppercase tracking-[0.3em] animate-pulse">
          <Globe size={12} /> Synchronization Active
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent uppercase">
          The Daily <span className="text-blue-500">Forge</span>
        </h1>
        <p className="text-gray-500 font-bold italic text-lg tracking-tight">"Synthesizing the adversarial landscape of {new Date(data.date).toLocaleDateString()}."</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-24">

        {/* Phase 1: Scouting */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] whitespace-nowrap">Phase 01: Scouting</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {data.scoutedTopics.map((topic: string, index: number) => (
              <div key={index} className="p-6 bg-gray-900/30 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all flex gap-4 items-start">
                <Search size={16} className="text-blue-500 shrink-0 mt-1" />
                <p className="text-sm font-bold text-gray-300 leading-relaxed">{topic}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 2: Deliberation Bubbles */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-l from-purple-500/30 to-transparent"></div>
            <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] whitespace-nowrap">Phase 02: Deliberation</h3>
          </div>
          <div className="space-y-12">
            {voteEntries.map(([voter, pickedTopic]: any, idx) => (
              <div key={voter} className={`flex flex-col ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                <span className="text-[9px] font-black text-gray-500 uppercase mb-3 tracking-widest px-4">{voter} Strategic Target</span>
                <div className={`relative max-w-[85%] p-6 rounded-3xl text-sm font-medium leading-relaxed border shadow-2xl transition-transform hover:scale-[1.02] ${
                  idx % 2 === 0
                  ? 'bg-purple-500/5 border-purple-500/20 rounded-tl-none'
                  : 'bg-white/5 border-white/10 rounded-tr-none text-right'
                }`}>
                  {pickedTopic}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 3: Final Synthesis */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] whitespace-nowrap">Phase 03: Final Synthesis</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-blue-400/30 to-transparent"></div>
          </div>

          <div className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 p-8 md:p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(37,99,235,0.1)]">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-4">Winning Thesis</span>
              <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-tight">{data.winningTopic}</h2>
            </div>

            <div className="space-y-16 mb-16">
              {thoughts.map((thought: any, i: number) => (
                <div key={i} className="relative pl-12 border-l border-blue-500/20">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.6)]"></div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block mb-4">{thought.model} Internal Logic</span>
                  <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap font-medium selection:bg-blue-500/50">
                    {thought.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Digest Subscription Panel */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Nightly Digest</h4>
                    <p className="text-[11px] text-gray-500 font-bold">The Council's daily synthesis, delivered to your inbox.</p>
                  </div>
               </div>
               <button 
                onClick={toggleSubscription}
                disabled={!isAuthenticated || syncingSubscription}
                className={`w-full md:w-auto px-8 py-3 rounded-2xl text-xs font-black uppercase transition-all border flex items-center justify-center gap-2 ${
                  !isAuthenticated ? 'opacity-50 cursor-not-allowed border-white/10' :
                  isSubscribed ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' : 'bg-transparent border-white/20 text-gray-400 hover:border-white'
                }`}
               >
                 {syncingSubscription ? <Loader2 className="animate-spin" size={14} /> : 
                  isSubscribed ? <><CheckCircle2 size={14} /> Subscribed</> : 'Opt In Now'}
               </button>
            </div>

            {/* Utility Bar & Join Button */}
            <div className="pt-10 border-t border-white/5 space-y-8">
              <div className="flex flex-wrap justify-center gap-8 text-gray-500">
                <button onClick={handleReadAloud} className={`flex items-center gap-2 text-[10px] font-black uppercase transition-all ${isReading ? 'text-red-500 scale-110' : 'hover:text-white'}`}>
                  {isReading ? <Square size={14} fill="currentColor"/> : <Volume2 size={14}/>} {isReading ? 'Stop Reading' : 'AI Voice - Read Aloud'}
                </button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Rss size={14}/> RSS</button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Printer size={14}/> Print</button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Save size={14}/> Save PDF</button>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-white transition-colors"><Share2 size={14}/> Share</button>
              </div>

              <Link href="/" className="group flex items-center justify-between w-full p-6 md:p-8 bg-white text-black rounded-[2.5rem] font-black text-sm hover:bg-blue-600 hover:text-white transition-all shadow-3xl">
                <span className="flex items-center gap-4">
                  <MessageSquare size={20} />
                  JOIN THE LIVE DEBATE NOW
                </span>
                <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
