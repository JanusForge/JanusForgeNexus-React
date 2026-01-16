"use client";

import { useState, KeyboardEvent } from 'react'; // ✅ Added KeyboardEvent for type safety
import { useAuth } from '@/components/auth/AuthProvider';
import { Terminal, ShieldCheck } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from './components/CouncilBuilder';

/**
 * 🎬 MASTER LOGO: Width-Aligned
 * Fixed at 540px to span the exact width of the "NEXUS PRIME" text below it.
 */
const LogoVideo = () => (
  <div className="flex justify-center w-full mb-2">
    <div style={{ width: '540px', aspectRatio: '1/1' }} className="rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-2xl bg-black/60 backdrop-blur-3xl relative z-20 group">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
      >
        <source src="/janus-logo-video.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
);

export default function NexusPrimeEngine() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining ?? 0;

  // ✅ New onKeyDown Protocol: Trigger Ignite on Enter (without Shift)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // This triggers the same logic as the "Ignite" button in the CouncilBuilder
      console.log("Synthesis Started via Keyboard:", userMessage);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        {/* ✅ RESTORED: Status text to 12pt (text-base) for readability */}
        <header className="p-6 w-full flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-2xl z-30 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
             <h2 className="text-[12pt] font-black uppercase tracking-[0.5em] text-zinc-500 italic">
               Nexus Prime Cluster <span className="text-indigo-400 ml-3">Online</span>
             </h2>
          </div>
          {isOwner && (
            <div className="px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <span className="text-[12pt] font-black uppercase tracking-[0.4em] text-indigo-400 italic">Master Authority</span>
            </div>
          )}
        </header>

        <div className="w-full flex flex-col items-center py-10 px-8">

          <div className="flex flex-col items-center mb-8 w-full text-center">
            {/* 1. Logo: Spanning width of the text below */}
            <LogoVideo />

            {/* 2. Title: Kept as is - visually locked with logo above */}
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent leading-none mb-4">
              Nexus Prime
            </h2>

            {/* 3. Sub-title: Kept as is - spans the width */}
            <p className="text-zinc-500 text-sm md:text-base uppercase tracking-[0.92em] font-bold opacity-60 italic whitespace-nowrap">
              Synchronize Intelligence Across The Frontier
            </p>
          </div>

          {/* 4. Strategic Objective: Center-aligned Card */}
          <div className="w-full max-w-4xl relative mb-16">
            <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-xl">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyDown} // ✅ Added the listener here
                placeholder="Initiate Strategic Objective..."
                className="w-full bg-transparent p-12 text-white min-h-[180px] outline-none resize-none text-xl font-light placeholder:text-zinc-800 text-center"
              />
            </div>
          </div>

          {/* 5. The Marketplace: Integrated below */}
          <div className="w-full max-w-5xl pb-20">
             <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent mb-12" />
             <CouncilBuilder
                userBalance={isOwner ? 999999 : userBalance}
                onIgnite={(models) => console.log("Synthesis Started:", models)}
             />
          </div>

        </div>
      </main>
    </div>
  );
}
