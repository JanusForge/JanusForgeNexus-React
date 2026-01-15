"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, ShieldCheck, Zap, Cpu, Terminal } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';

// ✅ HQ PATHS: These use the new 'src/nexus' headquarters
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from '@/nexus/components/CouncilBuilder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

const LogoVideo = () => (
  <div className="w-64 h-64 md:w-96 md:h-96 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative z-20">
    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function NexusEnginePage() {
  const { user, updateUserData } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [showCouncil, setShowCouncil] = useState(false); 
  const [isSending, setIsSending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining ?? 0;

  useEffect(() => {
    socketRef.current = io(`${API_BASE_URL}/nexus-prime`, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  // ⌨️ PROTOCOL 0: Enter key triggers Council Panels
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (userMessage.trim()) setShowCouncil(true);
    }
  };

  const handleIgnition = async (selectedModels: string[]) => {
    if (!userMessage.trim() || isSending) return;
    setIsSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/nexus/synthesis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, prompt: userMessage, selectedModels }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCurrentConversationId(data.conversationId);
    } catch (error: any) {
      alert(error.message);
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black items-center justify-center">
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!showCouncil && !currentConversationId ? (
              <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="my-auto text-center space-y-12">
                <LogoVideo />
                <h2 className="text-8xl md:text-10xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">
                  Nexus Prime
                </h2>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Initiate Strategic Objective..."
                  className="w-full max-w-3xl bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 text-2xl font-light outline-none text-center"
                />
              </motion.div>
            ) : showCouncil && !currentConversationId ? (
              <motion.div key="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full pt-10">
                {/* 🚀 Restored 5-AI Selection Grid */}
                <CouncilBuilder
                  userBalance={isOwner ? 999999 : userBalance}
                  onIgnite={handleIgnition}
                />
              </motion.div>
            ) : (
              <div className="text-zinc-500 pt-20 uppercase tracking-widest text-xs animate-pulse">
                Neural Link Establishing...
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
