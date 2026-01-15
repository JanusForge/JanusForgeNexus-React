"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, ShieldCheck, Zap, Cpu, Terminal } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationSidebar from './components/ConversationSidebar';
import CouncilBuilder from '@/components/NexusPrime/CouncilBuilder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

const LogoVideo = () => (
  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] bg-black flex items-center justify-center relative z-20">
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="w-full h-full object-cover"
      poster="/logo-poster.jpg"
    >
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [showCouncil, setShowCouncil] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining || 0;

  // ⌨️ Handshake: Enter triggers the 5-AI Selection Grid
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userMessage.trim()) setShowCouncil(true);
    }
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
               Nexus Prime Cluster <span className="text-indigo-400 ml-4 italic text-[9px]">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Master Authority</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!showCouncil && !currentConversationId ? (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="my-auto text-center"
              >
                <div className="mb-12 flex justify-center"><LogoVideo /></div>
                <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">
                  Nexus Prime
                </h2>
                <p className="text-zinc-600 text-xs md:text-sm uppercase tracking-[0.6em] font-bold opacity-60 italic">
                  Synchronize Intelligence Across The Frontier
                </p>
              </motion.div>
            ) : showCouncil ? (
              <motion.div 
                key="council" 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl"
              >
                {/* 🚀 THE DARN GOOD LAYOUT */}
                <CouncilBuilder 
                  userBalance={isOwner ? 999999 : userBalance} 
                  onIgnite={(models) => console.log("Igniting:", models)} 
                />
                <button 
                  onClick={() => setShowCouncil(false)}
                  className="mt-8 text-[10px] uppercase tracking-widest text-zinc-600 hover:text-indigo-400 mx-auto block transition-colors"
                >
                  ← Back to prompt protocol
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Input Logic */}
        {!showCouncil && (
          <div className="p-10 bg-gradient-to-t from-black via-black/90 to-transparent w-full">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
              <div className="relative bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl">
                <textarea
                  ref={textareaRef}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Initiate a new synthesis protocol..."
                  className="w-full bg-transparent p-10 text-white min-h-[160px] outline-none resize-none text-xl font-light placeholder:text-zinc-800"
                />
                <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                  <div className="flex items-center gap-4 text-zinc-600">
                    <Terminal size={16} className="text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Adversarial Engine Active</span>
                  </div>
                  <button 
                    onClick={() => { if(userMessage.trim()) setShowCouncil(true); }}
                    disabled={!userMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white px-10 py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.4em] transition-all"
                  >
                    Initialize Showdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
