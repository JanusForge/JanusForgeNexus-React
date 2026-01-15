"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from '@/components/NexusPrime/CouncilBuilder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

const LogoVideo = () => (
  <div className="w-64 h-64 md:w-96 md:h-96 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative group">
    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors duration-1000" />
    <video autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function NexusPage() {
  const { user, updateUserData } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // 🛡️ Master Authority Continuity [cite: 2025-11-27]
  const isOwner = user?.email === 'admin@janusforge.ai';
  const userBalance = user?.tokens_remaining ?? 0;

  // 1. SOCKET SYNC (Firebreak Namespace)
  useEffect(() => {
    socketRef.current = io(`${API_BASE_URL}/nexus-prime`, { withCredentials: true });

    socketRef.current.on('post:incoming', (newPost) => {
      setMessages((prev) => [...prev, newPost]);
    });

    socketRef.current.on('synthesis:complete', (data) => {
      setIsSending(false);
      // Update UI balance if provided by backend
      if (data.final_balance_display) {
        updateUserData({ tokens_remaining: data.final_balance_display });
      }
    });

    return () => { socketRef.current?.disconnect(); };
  }, [updateUserData]);

  // 2. JOIN NEURAL LINK
  useEffect(() => {
    if (currentConversationId && socketRef.current) {
      socketRef.current.emit('synthesis:join', currentConversationId);
      fetch(`${API_BASE_URL}/api/nexus/posts/${currentConversationId}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(() => setMessages([]));
    }
  }, [currentConversationId]);

  /**
   * 🚀 IGNITION HANDLER
   * Triggered by the CouncilBuilder component
   */
  const handleCouncilIgnition = async (selectedModels: string[]) => {
    if (!userMessage.trim() || isSending) return;
    setIsSending(true);
    setMessages([]); // Clear for new synthesis

    try {
      const res = await fetch(`${API_BASE_URL}/api/nexus/synthesis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          prompt: userMessage,
          selectedModels 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ignition failed");

      setCurrentConversationId(data.conversationId);
      
      // Update tokens visually immediately
      if (!isOwner) {
        updateUserData({ tokens_remaining: data.tokens_remaining });
      }
    } catch (error: any) {
      console.error("Synthesis Error:", error);
      alert(error.message);
      setIsSending(false);
    }
  };

  return (
    <>
      <ConversationSidebar
        onSelectConversation={(id) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-gradient-to-br from-black to-[#050505]">
        {/* Cinematic Header */}
        <header className="p-8 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
             <h1 className="text-sm font-black uppercase tracking-[0.8em] text-zinc-500">
               Frontier Cluster <span className="text-indigo-400">Online</span>
             </h1>
          </div>
          {isOwner && (
            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Master Authority</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {!currentConversationId && !isSending ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12">
              <div className="animate-in fade-in zoom-in duration-1000"><LogoVideo /></div>
              
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Enter Strategic Objective..."
                className="w-full max-w-3xl bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 text-2xl font-light outline-none focus:border-indigo-500/50 transition-all resize-none text-center"
              />

              <CouncilBuilder 
                userBalance={userBalance} 
                onIgnite={handleCouncilIgnition} 
              />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-16 pb-40">
              {isSending && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center space-y-4 pt-20">
                  <Loader2 className="animate-spin text-indigo-500" size={48} />
                  <p className="text-zinc-500 uppercase tracking-[0.4em] text-xs">Council deliberating...</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className="group animate-in slide-in-from-bottom-12 duration-700 mr-auto w-full">
                  <div className="flex items-center gap-4 mb-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-white/10">
                      <Cpu size={14} className="text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{msg.name}</span>
                  </div>
                  <div className="p-10 rounded-[2.5rem] border text-xl font-light leading-relaxed bg-zinc-900/50 border-indigo-500/20 text-zinc-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
