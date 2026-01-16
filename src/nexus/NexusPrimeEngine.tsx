"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Terminal, ShieldCheck } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from './components/CouncilBuilder';

/**
 * 🎬 MASTER LOGO: Massive presence
 */
const LogoVideo = () => (
  <div className="w-[400px] h-[400px] md:w-[200px] md:h-[200px] rounded-[6rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_150px_rgba(99,102,241,0.4)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative z-20 group mb-12">
    <video autoPlay loop muted playsInline className="w-half h-half object-cover">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function NexusPrimeEngine() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining ?? 0;

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      {/* ✅ FIXED: Added missing props to resolve Vercel Type Error */}
      <ConversationSidebar 
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        {/* Cinematic Header */}
        <header className="p-10 w-full flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-3xl z-30 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
             <h1 className="text-sm font-black uppercase tracking-[1em] text-zinc-500 italic">
               Nexus Prime Cluster <span className="text-indigo-400 ml-4">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="px-10 py-4 rounded-full bg-indigo-500/10 border border-indigo-500/40">
              <span className="text-xs font-black uppercase tracking-[0.5em] text-indigo-400 italic">Master Authority</span>
            </div>
          )}
        </header>

        <div className="w-full flex flex-col items-center py-32 px-10">
          
          {/* SECTION 1: THE GOLIATH TITLES */}
          <div className="flex flex-col items-center mb-40 w-full">
            <LogoVideo />
            
            {/* 🚨 GOLIATH SCALE: Direct pixel override for maximum 
prominence */}
            <h2 className="text-[140px] md:text-[240px] lg:text-[240px] font-black italic uppercase tracking-[-0.05em] bg-gradient-to-b from-white via-white to-zinc-900 bg-clip-text text-transparent leading-[0.7] drop-shadow-[0_20px_60px_rgba(0,0,0,1)] text-center">
              Nexus Prime
            </h2>
            
            {/* Expanded subtitle for visual weight */}
            <p className="mt-14 text-zinc-600 text-xl md:text-3xl lg:text-4xl uppercase tracking-[1.4em] font-bold opacity-70 italic text-center leading-relaxed">
              Synchronize Intelligence Across The Frontier
            </p>
          </div>

          {/* SECTION 2: THE STRATEGIC INPUT */}
          <div className="w-full max-w-6xl relative mb-48">
            <div className="relative bg-zinc-900/60 border border-white/10 rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Initiate Strategic Objective..."
                className="w-full bg-transparent p-20 text-white min-h-[400px] outline-none resize-none text-4xl font-light placeholder:text-zinc-800 text-center"
              />
              <div className="p-12 border-t border-white/5 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-6 text-zinc-600">
                  <Terminal size={24} className="text-indigo-600" />
                  <span className="text-xs font-black uppercase tracking-[0.5em] italic">Adversarial Engine Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: THE MARKETPLACE */}
          <div className="w-full max-w-7xl">
             <div className="w-full h-px bg-indigo-500/20 mb-32" />
             <CouncilBuilder 
                userBalance={isOwner ? 999999 : userBalance} 
                onIgnite={(models) => console.log("Ignition with:", models)} 
             />
          </div>

        </div>
      </main>
    </div>
  );
}
