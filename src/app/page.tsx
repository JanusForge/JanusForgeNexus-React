"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Loader2, Sparkles, ShieldCheck, Zap, 
  Cpu, SendHorizontal, Terminal, Shield, ChevronRight 
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationSidebar from './components/ConversationSidebar';
import CouncilBuilder from './components/NexusPrime/CouncilBuilder';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function HomePage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCouncilBuilder, setShowCouncilBuilder] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🛡️ Master Authority Protocol
  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining || 0;

  // 1. SOCKET INITIALIZATION
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true });
    socketRef.current.on('post:incoming', (newPost) => {
      setMessages((prev) => [...prev, newPost]);
      setIsAiThinking(newPost.sender === 'user');
    });
    socketRef.current.on('synthesis:complete', () => setIsAiThinking(false));
    return () => { socketRef.current?.disconnect(); };
  }, []);

  // 2. CINEMATIC ENTER-KEY PROTOCOL
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!currentConversationId && !showCouncilBuilder) {
        setShowCouncilBuilder(true);
      } else {
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = async (selectedModels: string[] = []) => {
    if (!userMessage.trim() || isSending) return;
    setIsSending(true);
    setIsAiThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/conversations/synthesis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user?.id, 
          content: userMessage,
          models: selectedModels 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentConversationId(data.conversationId);
        setUserMessage('');
        setShowCouncilBuilder(false);
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
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
             <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
               Nexus Prime Cluster <span className="text-indigo-400 ml-4 italic">Status: Online</span>
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
            {!currentConversationId && !showCouncilBuilder ? (
              <motion.div 
                key="hero"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto"
              >
                <h2 className="text-8xl md:text-10xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-800 bg-clip-text text-transparent">
                  Nexus Prime
                </h2>
                <p className="text-zinc-600 text-xs md:text-lg uppercase tracking-[0.6em] font-bold opacity-60">
                  Synchronize Intelligence Across The Frontier
                </p>
              </motion.div>
            ) : showCouncilBuilder ? (
              <motion.div key="builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* 5-AI Model Selection Layout */}
                <CouncilBuilder 
                  userBalance={userBalance} 
                  onIgnite={(models) => handleSendMessage(models)} 
                />
              </motion.div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-10 pb-40">
                {messages.map((msg, idx) => (
                  <MessageBubble key={msg.id || idx} msg={msg} />
                ))}
                {isAiThinking && <ThinkingIndicator />}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Cinematic Input Section */}
        <div className="p-10 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
              <textarea
                ref={textareaRef}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isOwner ? "Owner Directive: Influence the Cluster..." : "Initiate a new synthesis protocol..."}
                className="w-full bg-transparent p-10 text-white min-h-[160px] outline-none resize-none text-xl font-light placeholder:text-zinc-800"
              />
              <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-4 text-zinc-600">
                  <Terminal size={16} className="text-indigo-600" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Adversarial Engine Active</span>
                </div>
                <button 
                  onClick={() => setShowCouncilBuilder(true)} 
                  disabled={isSending || !userMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.4em] transition-all shadow-xl shadow-indigo-500/20"
                >
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

function MessageBubble({ msg }: { msg: any }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`p-10 rounded-[3rem] border ${isUser ? 'bg-white/5 border-white/10 ml-auto max-w-[80%]' : 'bg-zinc-900/40 border-indigo-500/20 mr-auto w-full'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-zinc-800 border-white/10">
          {isUser ? <Zap size={18} className="text-amber-500" /> : <Cpu size={18} className="text-indigo-400" />}
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-white">{msg.name || 'Frontier Node'}</span>
          <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-tighter italic">Verified Identity</span>
        </div>
      </div>
      <p className="text-lg text-zinc-300 leading-relaxed font-light">{msg.content}</p>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-4 p-10 animate-pulse text-zinc-600">
      <Loader2 className="animate-spin" size={18} />
      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Synthesizing...</span>
    </div>
  );
}
