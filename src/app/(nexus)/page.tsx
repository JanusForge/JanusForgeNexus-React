"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Loader2, ShieldCheck, Zap, Cpu } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

const LogoVideo = () => (
  <div className="w-64 h-64 md:w-96 md:h-96 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative group">
    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors duration-1000" />
    <video autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-1000">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function NexusPage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai';
  const canAfford = isOwner || (user?.tokens_remaining && user.tokens_remaining >= 3);

  // 1. SOCKET SYNC
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true });

    socketRef.current.on('post:incoming', (newPost) => {
      setMessages((prev) => [...prev, newPost]);
      setIsAiThinking(newPost.sender === 'user'); 
    });

    socketRef.current.on('synthesis:complete', () => setIsAiThinking(false));

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 2. JOIN NEURAL LINK
  useEffect(() => {
    if (currentConversationId && socketRef.current) {
      socketRef.current.emit('join:room', currentConversationId);
      fetch(`${API_BASE_URL}/api/nexus/posts/${currentConversationId}`)
        .then(res => res.json())
        .then(data => setMessages(data));
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const handleInitializeShowdown = async () => {
    if (!userMessage.trim() || isSending || !canAfford) return;
    setIsSending(true);
    setIsAiThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/nexus/synthesis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, content: userMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentConversationId(data.conversationId);
        setUserMessage('');
      }
    } catch (error) {
      console.error("Synthesis Error:", error);
    } finally {
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

        {/* Dynamic Viewport */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {!currentConversationId ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
              <div className="mb-20 animate-in fade-in zoom-in duration-1000"><LogoVideo /></div>
              <h2 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white via-zinc-200 to-zinc-800 bg-clip-text text-transparent leading-[0.8]">
                Nexus<br/>Prime
              </h2>
              <p className="text-zinc-600 text-sm md:text-xl uppercase tracking-[0.6em] font-light max-w-2xl leading-loose">
                Autonomous Intelligence Synthesis
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-16 pb-40">
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`group animate-in slide-in-from-bottom-12 duration-700
                  ${msg.sender === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto w-full'}`}>
                  <div className="flex items-center gap-4 mb-4 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-white/10">
                      {msg.sender === 'user' ? <Zap size={14} className="text-amber-500" /> : <Cpu size={14} className="text-indigo-400" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{msg.name}</span>
                  </div>
                  <div className={`p-10 rounded-[2.5rem] border text-xl font-light leading-relaxed
                    ${msg.sender === 'user' ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-900/50 border-indigo-500/20 text-zinc-300 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Matrix */}
        <div className="p-12 bg-gradient-to-t from-black via-black to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#080808] rounded-[3rem] border border-white/10 p-2 shadow-2xl focus-within:border-indigo-500/50 transition-all">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Directive: Influence the Cluster..." : "Enter Directive..."}
                className="w-full bg-transparent px-10 pt-10 pb-4 text-white min-h-[160px] outline-none resize-none text-2xl font-light placeholder:text-zinc-800"
              />
              <div className="flex justify-between items-center px-8 pb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Neural Link Active</span>
                <button 
                  onClick={handleInitializeShowdown}
                  disabled={isSending || !userMessage.trim() || !canAfford}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] transition-all shadow-lg shadow-indigo-600/20"
                >
                  {isSending ? <Loader2 className="animate-spin" /> : "Initialize Synthesis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
