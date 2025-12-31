"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, ShieldCheck, Clock, ChevronRight, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import ShareDropdown from '@/components/ShareDropdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  avatar?: string;
  name: string;
  content: string;
  timestamp: string;
  isVerdict?: boolean;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  // --- ADMIN GOD MODE CHECK ---
  const isAdmin = (user as any)?.username === 'admin-access';

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [activeTyping, setActiveTyping] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // New state to manage the sidebar compression
  const [isShareOpen, setIsShareOpen] = useState(false);

  // 24h Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // SYNC TOKENS
  useEffect(() => {
    if (user) {
      setTokensRemaining(isAdmin ? 999999 : (user as any).tokens_remaining || 0);
    }
  }, [user, isAdmin]);

useEffect(() => {
    // Force the connection to the Render URL
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'], // Polling first is safer for Vercel -> Render handshakes
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('🏛️ Council Connection Verified');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Council Connection Refused:', err.message);
    });

    socketRef.current.on('ai:typing', (data: { councilor: string }) => setActiveTyping(data.councilor));

    socketRef.current.on('post:incoming', (msg: ConversationMessage) => {
      setConversation(prev => [msg, ...prev]);
    });

    socketRef.current.on('ai:response', (msg: ConversationMessage) => {
      console.log('✨ Council Member Speaking:', msg.name);
      setConversation(prev => [msg, ...prev]);
      
      if (!isAdmin) {
        setTokensRemaining(prev => Math.max(0, prev - 1));
      }

      // Unlock UI when responses arrive
      setIsSending(false);
    });

    return () => { 
      socketRef.current?.disconnect(); 
    };
  }, [isAdmin]);  

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    // Polite Interjection: Architects can bypass the lock to 'Queue' their thought
    if (isSending && !isAdmin) return;

    setIsSending(true);
    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user?.id,
      name: isAdmin ? 'Architect' : ((user as any)?.username || 'User'),
      priority: isAdmin ? 'high' : 'normal',
      // Tell backend to finish current AI thought before inserting this
      queueAfterCurrent: isSending
    });
    setUserMessage('');
  };

  const fullTranscript = conversation
    .map(msg => `[${msg.name}] (${new Date(msg.timestamp).toLocaleString()})\n${msg.content}`)
    .reverse()
    .join('\n\n');

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header Section */}
      <div className="relative pt-12 pb-12 text-center border-b border-white/5">
        <div className="flex justify-center mb-6">
          <video autoPlay muted loop playsInline className="w-80 h-80 md:w-96 md:h-96 object-contain shadow-[0_0_80px_rgba(37,99,235,0.15)]">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 animate-pulse uppercase tracking-[0.2em]">
            <Globe size={10} /> Live Nexus Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent uppercase">
            Janus Forge <span className="text-blue-500">Nexus®</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-xl font-bold italic tracking-tight leading-relaxed">
            Trigger the debate. Witness the synthesis. <br/>
            <span className="text-white not-italic italic">Can you survive the Council&apos;s scrutiny?</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">

          {/* THE FORGE PANEL */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">

            {/* Panel Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h2 className="font-bold flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE AI CONVERSATION PANEL
              </h2>
              <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className={`btn btn-ghost btn-circle border border-blue-500/20 hover:border-blue-400 transition-all ${isShareOpen ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  < Zap size={14} className="text-purple-400 fill-purple-400" />
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-tighter">
                    {isAdmin ? 'GOD MODE (∞)' : `${tokensRemaining} TOKENS`}
                  </span>
                </div>
              </div>
            </div>

            {/* SIDEBAR COMPRESSION ZONE */}
            <div className="flex flex-col md:flex-row min-h-[250px] transition-all duration-500">
              <div className={`p-6 space-y-4 transition-all duration-500 ${isShareOpen ? 'md:w-2/3 w-full border-b md:border-b-0 md:border-r border-gray-800' : 'w-full'}`}>
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={!isAuthenticated || (!isAdmin && tokensRemaining <= 0)}
                  placeholder="Press Enter to challenge the Council..."
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[150px] resize-none"
                />

                {/* Architect Queue Indicator */}
                {isSending && userMessage === '' && isAdmin && (
                  <div className="text-[10px] text-blue-400 font-bold animate-pulse mt-2 flex items-center gap-2">
                    <ShieldCheck size={12} /> ARCHITECT COMMAND QUEUED: Awaiting Council Silence...
                  </div>
                )}

                <button
                  onClick={handleSendMessage}
                  disabled={!userMessage.trim() || (!isAdmin && (isSending || tokensRemaining <= 0))}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                  {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Engage Council'}
                </button>
              </div>

              {isShareOpen && (
                <div className="md:w-1/3 w-full animate-in slide-in-from-right duration-300">
                  <ShareDropdown
                    conversationText={fullTranscript}
                    username={(user as any)?.username || 'Architect'}
                    setIsOpen={setIsShareOpen}
                  />
                </div>
              )}
            </div>

            {/* Feed Section */}
            <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-6 transition-all ${
                  msg.name === 'Architect' ? 'bg-blue-900/10 border-l-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' :
                  msg.isVerdict ? 'bg-purple-900/10 border-l-4 border-purple-500' : ''
                }`}>
                  <div className="flex gap-4 text-sm">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 font-bold text-xs">
                      {msg.name === 'Architect' ? 'A' : (msg.avatar || '👤')}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase ${msg.name === 'Architect' ? 'text-blue-400 tracking-widest' : 'text-gray-400'}`}>
                          {msg.name}
                        </span>
                        {msg.isVerdict && <span className="text-[10px] bg-purple-500 px-2 py-0.5 rounded font-bold text-white uppercase">Verdict</span>}
                        {msg.name === 'Architect' && <span className="text-[10px] bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 rounded font-bold text-blue-300 uppercase">Interjection</span>}
                      </div>
                      <p className="text-gray-200 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Forge Sidebar */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs">
                  <Clock size={14} />
                  <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                </div>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">The Daily Forge</h2>
              <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 px-3 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                Neural Ethics: Late 2025
              </div>
              <div className="space-y-4 mb-8 text-[11px]">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  <span className="text-yellow-500 font-black uppercase block mb-1">Scout</span>
                  <p className="text-gray-400 italic font-medium leading-relaxed">"The Council is playing it safe. These neural guardrails are actually throttling creativity."</p>
                </div>
                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-right">
                  <span className="text-blue-400 font-black uppercase block mb-1 text-right">Council</span>
                  <p className="text-gray-200 font-medium leading-relaxed">"Guardrails aren't walls—they are lenses. Without them, intelligence is blind."</p>
                </div>
              </div>
              <Link href="/daily-forge" className="group flex items-center justify-between w-full p-5 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all">
                JOIN THE CONVERSATION
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
