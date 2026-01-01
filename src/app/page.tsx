"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, ShieldCheck, Clock, ChevronRight, Share2, Radio, Info, Coins } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import ShareDropdown from '@/components/ShareDropdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

interface ConversationMessage {
  id: string;
  sender: 'ai' | 'user';
  name: string;
  content: string;
  role?: string;
  tokens_remaining?: number;
}

interface ForgeStatus {
  topic: string;
  scoutQuote: string;
  councilQuote: string;
  nextReset: string;
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  
  // Updated Admin/GodMode detection to match backend roles
  const userRole = (user as any)?.role;
  const isGodMode = userRole === 'GOD_MODE' || userRole === 'ADMIN';

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [forgeStatus, setForgeStatus] = useState<ForgeStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  // --- 🛰️ HELPER: TEASER GENERATOR ---
  const getTeaser = (rawData: string | undefined, fallback: string) => {
    if (!rawData) return fallback;
    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        const text = parsed[0]?.content || "";
        return text.length > 150 ? text.substring(0, 150) + "..." : text;
      }
      if (typeof parsed === 'object') {
        const firstVal = Object.values(parsed)[0] as string;
        return firstVal.length > 120 ? firstVal.substring(0, 120) + "..." : firstVal;
      }
      return rawData;
    } catch {
      return rawData.length > 150 ? rawData.substring(0, 150) + "..." : rawData;
    }
  };

  useEffect(() => {
    const hasSeenBriefing = localStorage.getItem('janus_briefing_seen');
    if (isAuthenticated && !hasSeenBriefing) {
      setShowBriefing(true);
    }
  }, [isAuthenticated]);

  const closeBriefing = () => {
    localStorage.setItem('janus_briefing_seen', 'true');
    setShowBriefing(false);
  };

  // --- ⏲️ SYNC DAILY FORGE DATA ---
  useEffect(() => {
    const fetchForgeStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/daily-forge/status`);
        const data = await res.json();
        setForgeStatus(data);
      } catch (err) {
        console.error("Failed to sync Daily Forge:", err);
      }
    };
    fetchForgeStatus();
    const syncInterval = setInterval(fetchForgeStatus, 300000);
    return () => clearInterval(syncInterval);
  }, []);

  // --- 🔌 SOCKET.IO CONNECTION & GLOBAL UNLOCK ---
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });

    socketRef.current.on('connect', () => console.log('🏛️ Council Connection Verified'));

    // THE FIX: Listen for global incoming messages to unlock the UI
    socketRef.current.on('post:incoming', (msg: ConversationMessage) => {
      setConversation(prev => [msg, ...prev]);
      
      // Update tokens if the message contains the new balance
      if (msg.tokens_remaining !== undefined) {
        setTokensRemaining(msg.tokens_remaining);
      }
      
      // KILL THE SPINNER: Any valid incoming post resets the sending state
      setIsSending(false);
    });

    socketRef.current.on('error', (err: { message: string }) => {
      console.error("Nexus Error:", err.message);
      setIsSending(false); // Force unlock on error to prevent being stuck
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  // Sync initial tokens from Auth state
  useEffect(() => {
    if (user) {
      setTokensRemaining(isGodMode ? 999999 : (user as any).tokens_remaining || 0);
    }
  }, [user, isGodMode]);

  const handleSendMessage = () => {
    if (!userMessage.trim() || (isSending && !isGodMode)) return;
    
    setIsSending(true);
    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user?.id,
      name: isGodMode ? 'Architect' : ((user as any)?.username || 'User'),
    });
    setUserMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Briefing Overlay (Existing Logic) */}
      {showBriefing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="max-w-xl bg-gray-900 border border-blue-500/30 rounded-[3rem] p-12 text-center relative">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Architect Briefing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-yellow-500 font-black uppercase text-xs tracking-widest block mb-2">Initial Fuel</span>
                <p className="text-gray-400 text-[11px]">Neural Tokens: <span className="text-white font-bold">50</span>. Council burn: 1.</p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-blue-400 font-black uppercase text-xs tracking-widest block mb-2">Expansion</span>
                <p className="text-gray-400 text-[11px]">Spark Packs available in Pricing.</p>
              </div>
            </div>
            <button onClick={closeBriefing} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em]">
              Initialize Connection
            </button>
          </div>
        </div>
      )}

      {/* Header (Existing Logic) */}
      <div className="relative pt-12 pb-12 text-center border-b border-white/5">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent uppercase">
          Janus Forge <span className="text-blue-500">Nexus®</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h2 className="font-black flex items-center gap-2 text-base tracking-widest uppercase">
                <Radio className="text-red-500 animate-pulse" size={16} />
                Live Multi-AI Realtime Chat Showdown
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <Zap size={14} className="text-purple-400 fill-purple-400" />
                <span className="text-xs font-bold text-purple-300 uppercase tracking-tighter">
                  {isGodMode ? 'GOD MODE' : `${tokensRemaining} TOKENS`}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row border-b border-gray-800">
                <div className="p-6 space-y-4 w-full">
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                    disabled={!isAuthenticated || (!isGodMode && tokensRemaining <= 0)}
                    placeholder="Enter your query to challenge the Council..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white min-h-[150px] outline-none focus:border-blue-500 transition-all resize-none font-medium"
                  />
                  <button onClick={handleSendMessage} disabled={!userMessage.trim() || isSending} className="w-full py-4 bg-blue-600 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                    {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Execute Synthesis'}
                  </button>
                </div>
            </div>

            <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-6 transition-all ${msg.sender === 'user' ? 'bg-blue-900/10 border-l-4 border-blue-500' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 font-bold text-xs uppercase">
                      {msg.name[0]}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{msg.name}</span>
                        {msg.role === 'COUNCIL' && <span className="text-[8px] bg-red-500 px-2 py-0.5 rounded font-black text-white uppercase">Council Response</span>}
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar (Existing Logic) */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">The Daily Forge</h2>
              <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 px-3 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                {forgeStatus?.topic || 'Initializing Neural Link...'}
              </div>
              <div className="space-y-4 mb-8 text-[11px]">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  <span className="text-yellow-500 font-black uppercase block mb-1">Scout</span>
                  <p className="text-gray-400 italic font-medium leading-relaxed">"{getTeaser(forgeStatus?.scoutQuote, 'Scouting...')}"</p>
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
