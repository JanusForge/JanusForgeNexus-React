"use client";

import { useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion } from 'framer-motion';
import { Terminal, ShieldCheck } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';

// ✅ HQ COMPONENTS: Domain-driven design
import CouncilBuilder from './components/CouncilBuilder';

/**
 * 🎬 Massive Cinematic Logo
 */
const LogoVideo = () => (
  <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-[6rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_120px_rgba(99,102,241,0.3)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative z-20 group">
    <div className="absolute inset-0 bg-indigo-500/10 animate-pulse group-hover:bg-indigo-500/20 transition-colors duration-1000" />
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

  const handleIgnite = (models: string[]) => {
    console.log("Ignition Sequence Start:", models, "Prompt:", userMessage);
    // Integration point for your backend synthesis engine
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        {/* Persistent Header */}
        <header className="p-8 w-full flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-2xl z-30 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
             <h1 className="text-[11px] font-black uppercase tracking-[0.9em] text-zinc-500 italic">
               Nexus Prime Cluster <span className="text-indigo-400 ml-4">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/40 shadow-[0_0_25px_rgba(99,102,241,0.15)]">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-400 italic">Master Authority</span>
            </div>
          )}
        </header>

        {/* Scrollable Container for the Entire Interface */}
        <div className="w-full max-w-7xl mx-auto px-12 py-24 space-y-32 flex flex-col items-center">
          
          {/* 1. THE HERO SECTION: Massive Branding */}
          <section className="flex flex-col items-center space-y-20 w-full">
            <LogoVideo />
            
            <div className="text-center space-y-8">
              {/* Massive prominent Title */}
              <h2 className="text-[20rem] md:text-[30rem] font-black italic uppercase tracking-tighter bg-gradient-to-b from-white via-white to-zinc-900 bg-clip-text text-transparent leading-[0.75] drop-shadow-2xl">
                Nexus Prime
              </h2>
              <p className="text-zinc-600 text-md md:text-lg uppercase tracking-[0.8em] font-bold opacity-60 italic">
                Synchronize Intelligence Across The Frontier
              </p>
            </div>

            {/* 2. THE INPUT: Strategic Objective */}
            <div className="w-full max-w-5xl relative group pt-10">
              <div className="absolute -inset-2 bg-indigo-500/10 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-zinc-900/60 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Initiate Strategic Objective..."
                  className="w-full bg-transparent p-14 text-white min-h-[250px] outline-none resize-none text-3xl font-light placeholder:text-zinc-800 text-center"
                />
                <div className="p-10 border-t border-white/5 bg-black/40 flex justify-between items-center">
                  <div className="flex items-center gap-5 text-zinc-600">
                    <Terminal size={20} className="text-indigo-600" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] italic">Adversarial Engine Active</span>
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">
                    Protocol Awaiting Ignition
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. THE MARKETPLACE: Selection Grid */}
          <section className="w-full pt-12 animate-in fade-in slide-in-from-bottom-20 duration-1000">
             <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mb-32" />
             
             {/* Stacking the Council Builder directly under the Hero area */}
             <CouncilBuilder 
                userBalance={isOwner ? 999999 : userBalance} 
                onIgnite={handleIgnite} 
             />
          </section>

        </div>
      </main>
    </div>
  );
}
