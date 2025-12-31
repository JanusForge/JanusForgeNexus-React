"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, ShieldCheck, Clock, ChevronRight, Share2, ArrowRight, Radio, Info,Coins } from 'lucide-react';
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

interface ForgeStatus {
  topic: string;
  scoutQuote: string;
  councilQuote: string;
  nextReset: string; 
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const isAdmin = (user as any)?.username === 'admin-access';

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [forgeStatus, setForgeStatus] = useState<ForgeStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // --- 🚀 FIRST TIME VISITOR STATE ---
  const [showBriefing, setShowBriefing] = useState(false);

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

  // --- ⏲️ SYNC DAILY FORGE DATA & TIMER ---
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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = forgeStatus?.nextReset ? new Date(forgeStatus.nextReset) : new Date();
      if (!forgeStatus?.nextReset) targetDate.setUTCHours(24, 0, 0, 0);
      const diff = targetDate.getTime() - now;
      if (diff <= 0) { window.location.reload(); return; }
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [forgeStatus]);

  // --- 🔌 SOCKET.IO CONNECTION ---
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
    });
    socketRef.current.on('connect', () => console.log('🏛️ Council Connection Verified'));
    socketRef.current.on('post:incoming', (msg: ConversationMessage) => setConversation(prev => [msg, ...prev]));
    socketRef.current.on('ai:response', (msg: ConversationMessage) => {
      setConversation(prev => [msg, ...prev]);
      if (!isAdmin) setTokensRemaining(prev => Math.max(0, prev - 1));
      setIsSending(false);
    });
    return () => { socketRef.current?.disconnect(); };
  }, [isAdmin]);

  useEffect(() => {
    if (user) setTokensRemaining(isAdmin ? 999999 : (user as any).tokens_remaining || 0);
  }, [user, isAdmin]);

  const handleSendMessage = () => {
    if (!userMessage.trim() || (isSending && !isAdmin)) return;
    setIsSending(true);
    socketRef.current?.emit('post:new', {
      content: userMessage,
      userId: user?.id,
      name: isAdmin ? 'Architect' : ((user as any)?.username || 'User'),
    });
    setUserMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      
      {/* 🚀 FIRST TIME VISITOR BRIEFING */}
      {showBriefing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="max-w-xl bg-gray-900 border border-blue-500/30 rounded-[3rem] p-12 shadow-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
            
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
              <ShieldCheck className="text-blue-400" size={40} />
            </div>

            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-white">Architect Briefing</h2>
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Protocol: Synthesis Induction</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-3 text-yellow-500">
                  <Zap size={18} />
                  <span className="font-black uppercase text-xs tracking-widest">Initial Fuel</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Your account is pre-loaded with <span className="text-white font-bold">10 Neural Tokens</span>. Each query to the Council consumes 1 token.
                </p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-3 text-blue-400">
                  <Coins size={18} />
                  <span className="font-black uppercase text-xs tracking-widest">Expansion</span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Running low? Access the <span className="text-white font-bold">Pricing sector</span> to purchase Spark Packs and continue your multiversal research.
                </p>
              </div>
            </div>

            <button 
              onClick={closeBriefing}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-blue-900/40"
            >
              Initialize Connection
            </button>
          </div>
        </div>
      )}

      {/* 🎬 HEADER */}
      <div className="relative pt-12 pb-12 text-center border-b border-white/5">
        <div className="flex justify-center mb-6">
          <video autoPlay muted loop playsInline className="w-80 h-80 md:w-96 md:h-96 object-contain">
            <source src="/janus-logo-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black mb-6 animate-pulse uppercase tracking-[0.2em]">
            <Globe size={10} /> Live Nexus Active
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent uppercase">
            Janus Forge <span className="text-blue-500">Nexus®</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          
          {/* 🛡️ THE COUNCIL OF SYNTHESIS PANEL */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <div className="flex flex-col relative group">
                <h2 className="font-black flex items-center gap-2 text-sm tracking-widest text-white uppercase cursor-help">
                  <Radio className="text-red-500 animate-pulse" size={16} />
                  The Council of Synthesis
                  <div className="p-1 bg-white/5 rounded-full">
                    <Info size={12} className="text-blue-400" />
                  </div>
                </h2>
                <span className="text-[10px] text-gray-500 font-bold uppercase ml-6 tracking-tighter">Real-time Multiversal Debate</span>
                
                <div className="absolute top-10 left-0 w-64 p-4 bg-black/90 border border-blue-500/30 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 backdrop-blur-xl">
                  <p className="text-[10px] text-blue-400 font-black uppercase mb-2 tracking-widest text-left">Synthesis Protocol</p>
                  <p className="text-[11px] text-gray-300 leading-relaxed italic text-left">
                    "Your prompt triggers a simultaneous logical clash between GPT-4, Claude, and DeepSeek. Witness where they align and where they break."
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={() => setIsShareOpen(!isShareOpen)} className={`btn btn-ghost btn-circle border border-blue-500/20 ${isShareOpen ? 'text-blue-400' : 'text-gray-400'}`}>
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  <Zap size={14} className="text-purple-400 fill-purple-400" />
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-tighter">
                    {isAdmin ? 'GOD MODE' : `${tokensRemaining} TOKENS`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row border-b border-gray-800">
               <div className={`p-6 space-y-4 ${isShareOpen ? 'md:w-2/3 w-full' : 'w-full'}`}>
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
                   placeholder="Enter your query to challenge the Council..."
                   className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white min-h-[150px] outline-none focus:border-blue-500 transition-all resize-none font-medium placeholder:italic"
                 />
                 <button onClick={handleSendMessage} disabled={!userMessage.trim() || isSending} className="w-full py-4 bg-blue-600 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                   {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Execute Synthesis'}
                 </button>
               </div>
               {isShareOpen && (
                 <div className="md:w-1/3 w-full p-4 border-l border-gray-800 bg-black/20">
                   <ShareDropdown conversationText={conversation.map(m => `[${m.name}]: ${m.content}`).join('\n\n')} username={(user as any)?.username || 'User'} setIsOpen={setIsShareOpen} />
                 </div>
               )}
            </div>

            <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
              {conversation.map((msg) => (
                <div key={msg.id} className={`p-6 transition-all ${msg.name === 'Architect' ? 'bg-blue-900/10 border-l-4 border-blue-500' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 font-bold text-xs uppercase">
                      {msg.name[0]}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{msg.name}</span>
                        {msg.name === 'Architect' && <span className="text-[8px] bg-blue-500 px-2 py-0.5 rounded font-black text-white uppercase">Primary Intel</span>}
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ⏲️ SYNC DAILY FORGE SIDEBAR */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs">
                  <Clock size={14} className="animate-pulse" />
                  <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                </div>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">The Daily Forge</h2>
              <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 px-3 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                {forgeStatus?.topic || 'Initializing Neural Link...'}
              </div>
              
              <div className="space-y-4 mb-8 text-[11px]">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  <span className="text-yellow-500 font-black uppercase block mb-1">Scout</span>
                  <p className="text-gray-400 italic font-medium leading-relaxed">
                    "{forgeStatus?.scoutQuote || 'Scouting live intelligence...'}"
                  </p>
                </div>
                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-right">
                  <span className="text-blue-400 font-black uppercase block mb-1">Council</span>
                  <p className="text-gray-200 font-medium leading-relaxed">
                    "{forgeStatus?.councilQuote || 'Analyzing global synthesis...'}"
                  </p>
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
