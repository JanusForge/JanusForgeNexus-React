"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, ShieldCheck, Zap, Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationSidebar from './components/ConversationSidebar';
import CouncilBuilder from './components/NexusPrime/CouncilBuilder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function HomePage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [showCouncil, setShowCouncil] = useState(false); // Controls the "Darn Good" layout visibility
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining || 0;

  // KEYDOWN: Pressing Enter now specifically triggers the Council Selection
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userMessage.trim()) setShowCouncil(true); // Switches to the 5-AI selection grid
    }
  };

  const handleIgnite = async (selectedModels: string[]) => {
    // This is the function called by the "IGNITE" button in your layout
    console.log("Igniting with models:", selectedModels, "and prompt:", userMessage);
    // Logic to send to backend /api/conversations/synthesis...
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex relative overflow-hidden font-sans">
      <ConversationSidebar 
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col relative z-10">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
             <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
               Nexus Prime Cluster <span className="text-indigo-400 ml-4 italic">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Master Authority</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!showCouncil ? (
              <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto"
              >
                <h2 className="text-8xl md:text-10xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent leading-[0.85]">
                  Nexus Prime
                </h2>
                <p className="text-zinc-600 text-xs md:text-lg uppercase tracking-[0.6em] font-bold opacity-60">
                  Synchronize Intelligence Across The Frontier
                </p>
              </motion.div>
            ) : (
              <motion.div key="council" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* 🚀 THIS IS YOUR 'DARN GOOD' LAYOUT */}
                <CouncilBuilder 
                  userBalance={userBalance} 
                  onIgnite={handleIgnite} 
                />
                <button 
                  onClick={() => setShowCouncil(false)}
                  className="mt-8 text-[10px] uppercase tracking-widest text-zinc-600 hover:text-white mx-auto block"
                >
                  ← Back to prompt
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        {!showCouncil && (
          <div className="p-10 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="max-w-4xl mx-auto relative group">
              <div className="relative bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <textarea
                  ref={textareaRef}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Initiate a new synthesis protocol..."
                  className="w-full bg-transparent p-10 text-white min-h-[160px] outline-none resize-none text-xl font-light placeholder:text-zinc-800 shadow-inner"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
