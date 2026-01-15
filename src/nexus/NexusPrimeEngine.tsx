"use client";

import { useState, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';

// ✅ HQ COMPONENTS: Consolidated in the Domain Layer
import CouncilBuilder from './components/CouncilBuilder';

/**
 * 🎬 Cinematic Logo: Scaled up for prominence
 */
const LogoVideo = () => (
  <div className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-[5rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.25)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative z-20 group">
    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors duration-1000" />
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
    // Future: API handshake via src/nexus/components/IgnitionChamber.tsx
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        {/* 🏆 Header Meta-Data */}
        <header className="p-8 w-full flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-30 border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
             <h1 className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500">
               Frontier Cluster <span className="text-indigo-400">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Master Authority</span>
            </div>
          )}
        </header>

        <div className="w-full max-w-6xl mx-auto p-12 space-y-24 flex flex-col items-center">
          
          {/* SECTION 1: HERO & TEXTAREA */}
          <section className="flex flex-col items-center space-y-16 pt-12">
            <LogoVideo />
            
            <div className="text-center space-y-6">
              <h2 className="text-9xl md:text-[11rem] font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent leading-[0.8]">
                Nexus Prime
              </h2>
              <p className="text-zinc-600 text-xs md:text-sm uppercase tracking-[0.6em] font-bold opacity-60">
                Synchronize Intelligence Across The Frontier
              </p>
            </div>

            <div className="w-full max-w-4xl relative group">
              <div className="absolute -inset-1 bg-indigo-500/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-zinc-900/60 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Initiate Strategic Objective..."
                  className="w-full bg-transparent p-12 text-white min-h-[220px] outline-none resize-none text-2xl font-light placeholder:text-zinc-800 text-center"
                />
                <div className="p-8 border-t border-white/5 bg-black/40 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-zinc-600">
                    <Terminal size={18} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Adversarial Engine Active</span>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                    Ready for Synthesis
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: COUNCIL SELECTION GRID */}
          <section className="w-full pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="relative">
              {/* Divider line for cinematic separation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-indigo-500/50 to-transparent -translate-y-12" />
              
              <CouncilBuilder 
                userBalance={isOwner ? 999999 : userBalance} 
                onIgnite={handleIgnite} 
              />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
