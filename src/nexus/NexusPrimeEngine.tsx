"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Terminal, ShieldCheck } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from './components/CouncilBuilder';

/**
 * 🎬 GOLDILOCKS LOGO: Inviting but powerful.
 * Scaled to be the anchor without dominating the entire viewport.
 */
const LogoVideo = () => (
  <div className="w-56 h-56 md:w-72 md:h-72 rounded-[3.5rem] overflow-hidden border border-indigo-500/20 shadow-[0_0_60px_rgba(99,102,241,0.15)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative z-20 group mb-8">
    <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-1000" />
    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000">
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
      {/* Sidebar Sync */}
      <ConversationSidebar 
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        {/* Minimal Header */}
        <header className="p-6 w-full flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-2xl z-30 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
             <h1 className="text-[9px] font-black uppercase tracking-[0.7em] text-zinc-500 italic">
               Nexus Prime Cluster <span className="text-indigo-400 ml-3">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 italic">Master Authority</span>
            </div>
          )}
        </header>

        <div className="w-full flex flex-col items-center py-16 px-8">
          
          {/* SECTION 1: BALANCED HIERARCHY */}
          <div className="flex flex-col items-center mb-16 w-full text-center">
            <LogoVideo />
            
            {/* "Nexus Prime" is now roughly half the visual weight of the video logo */}
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent leading-none mb-4">
              Nexus Prime
            </h2>
            
            {/* ✅ UPDATED: Scaled to fit perfectly under the width of the title above */}
            <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-[1em] font-bold opacity-50 italic">
              Synchronize Intelligence Across The Frontier
            </p>
          </div>

          {/* SECTION 2: THE INPUT */}
          <div className="w-full max-w-4xl relative mb-24">
            <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-xl">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Initiate Strategic Objective..."
                className="w-full bg-transparent p-12 text-white min-h-[200px] outline-none resize-none text-xl font-light placeholder:text-zinc-800 text-center"
              />
              <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-4 text-zinc-600">
                  <Terminal size={18} className="text-indigo-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">Adversarial Engine Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: THE MARKETPLACE */}
          <div className="w-full max-w-5xl animate-in fade-in duration-1000">
             <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent mb-16" />
             <CouncilBuilder 
                userBalance={isOwner ? 999999 : userBalance} 
                onIgnite={(models) => console.log("Ignition Sequence:", models)} 
             />
          </div>

        </div>
      </main>
    </div>
  );
}
