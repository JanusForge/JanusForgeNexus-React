"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Loader2, Sparkles, ShieldCheck, Zap, 
  Cpu, ChevronRight 
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import ConversationSidebar from './components/ConversationSidebar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const LogoVideo = () => (
  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative group">
    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors duration-1000" />
    <video autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai'; [cite: 2025-11-27]
  const canAfford = isOwner || (user?.tokens_remaining && user.tokens_remaining >= 3); [cite: 2025-11-27]

  // 1. SOCKET INITIALIZATION
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true });

    socketRef.current.on('post:incoming', (newPost) => {
      setMessages((prev) => [...prev, newPost]);
      setIsAiThinking(newPost.sender === 'user'); 
    });

    socketRef.current.on('synthesis:complete', () => {
      setIsAiThinking(false);
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 2. JOIN ROOM ON CONVERSATION CHANGE
  useEffect(() => {
    if (currentConversationId && socketRef.current) {
      socketRef.current.emit('join:room', currentConversationId);
      // Fetch existing messages if loading from history
      fetch(`${API_BASE_URL}/api/conversations/${currentConversationId}/posts`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error(err));
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending || !canAfford) return;
    setIsSending(true);
    setIsAiThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/synthesis`, {
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
      setIsAiThinking(false);
    } finally {
      setIsSending(false);
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
             <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
             <h1 className="text-xs md:text-sm font-black uppercase tracking-[0.6em] text-zinc-400">
               Frontier Model Cluster <span className="text-indigo-400 ml-4">Online</span>
             </h1>
          </div>
          {isOwner && ( [cite: 2025-11-27]
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Owner Access</span>
            </div>
          )}
        </header>

        {/* 🏛️ MAIN STAGE: SWITCHES BETWEEN LOGO AND CHAT */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {!currentConversationId ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000">
              <div className="mb-16 animate-float flex justify-center"><LogoVideo /></div>
              <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent leading-[0.85]">
                Nexus Prime
              </h2>
              <p className="text-zinc-500 text-sm md:text-xl leading-relaxed uppercase tracking-[0.4em] font-medium opacity-80">
                Synchronize intelligence across the frontier
              </p>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-12 pb-32">
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`p-10 rounded-[3rem] border animate-in slide-in-from-bottom-8 duration-500
                  ${msg.sender === 'user' ? 'bg-white/5 border-white/10 ml-auto max-w-[85%]' : 'bg-zinc-900/40 border-indigo-500/20 mr-auto w-full'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-zinc-800 border-white/10">
                      {msg.sender === 'user' ? <Zap size={18} className="text-amber-500" /> : <Cpu size={18} className="text-indigo-400" />}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-white">{msg.name || (msg.sender === 'user' ? 'Synthesizer' : 'Frontier Node')}</span>
                      <span className="text-[10px] font-mono text-zinc-600 block uppercase tracking-widest">Verified Identity</span>
                    </div>
                  </div>
                  <p className="text-lg md:text-xl text-zinc-300 leading-relaxed whitespace-pre-wrap font-light">{msg.content}</p>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex items-center gap-4 p-10 animate-pulse text-zinc-500">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Node Synthesizing...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INPUT PORTAL */}
        <div className="p-12 md:p-20 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-5xl mx-auto relative">
            <div className="bg-zinc-900/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Owner Directive: Influence the Cluster..." : "Synthesize new logic..."} [cite: 2025-11-27]
                className="w-full bg-transparent p-12 text-white min-h-[180px] outline-none resize-none text-xl font-light placeholder:text-zinc-800"
              />
              <div className="p-8 border-t border-white/5 bg-black/60 flex justify-between items-center">
                <div className="flex items-center gap-4 text-zinc-500">
                  <Zap size={24} className="text-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Adversarial Engine Active</span>
                </div>
                <button onClick={handleSendMessage} disabled={isSending || !userMessage.trim() || !canAfford}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-16 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.4em] shadow-2xl shadow-indigo-600/30 transition-all">
                  {isSending ? <Loader2 className="animate-spin" /> : "Initialize Showdown"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
