"use client";

import { useState, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';

// ✅ HQ COMPONENT: Located in the Domain Layer
import CouncilBuilder from './components/CouncilBuilder';

const LogoVideo = () => (
  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative z-20">
    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function NexusPrimeEngine() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [showCouncil, setShowCouncil] = useState(false); // 🔑 Controls the Selection Grid
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining ?? 0;

  // ⌨️ PROTOCOL: Enter key triggers selection grid
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userMessage.trim()) setShowCouncil(true);
    }
  };

  const handleIgnite = (models: string[]) => {
    console.log("Igniting with:", models, "Prompt:", userMessage);
    // Future: Integration with IgnitionChamber.tsx
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black items-center">
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar w-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!showCouncil && !currentConversationId ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-12"
              >
                <LogoVideo />
                <h2 className="text-8xl md:text-9xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">
                  Nexus Prime
                </h2>

                <div className="w-full max-w-3xl relative group">
                  <div className="relative bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl">
                    <textarea
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Initiate Strategic Objective..."
                      className="w-full bg-transparent p-10 text-white min-h-[160px] outline-none resize-none text-xl font-light placeholder:text-zinc-800 text-center"
                    />
                    <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                      <div className="flex items-center gap-4 text-zinc-600">
                        <Terminal size={16} className="text-indigo-600" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Adversarial Engine Active</span>
                      </div>
                      <button
                        onClick={() => { if(userMessage.trim()) setShowCouncil(true); }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] transition-all"
                      >
                        Initialize Showdown
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : showCouncil ? (
              <motion.div key="council" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                {/* 🚀 5-AI SELECTION GRID */}
                <CouncilBuilder
                  userBalance={isOwner ? 999999 : userBalance}
                  onIgnite={handleIgnite}
                />
                <button
                  onClick={() => setShowCouncil(false)}
                  className="mt-8 text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white mx-auto block"
                >
                  ← Back to objective
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
