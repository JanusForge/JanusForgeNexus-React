"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, ShieldCheck, Clock, ChevronRight, Share2 } from 'lucide-react';
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

// Added interface for synced Forge data
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
  const [activeTyping, setActiveTyping] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  
  // NEW: Synced Daily Forge State
  const [forgeStatus, setForgeStatus] = useState<ForgeStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isShareOpen, setIsShareOpen] = useState(false);

  // --- 🛰️ SYNC DAILY FORGE DATA FROM BACKEND ---
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
    // Re-sync every 5 minutes to stay perfectly aligned
    const syncInterval = setInterval(fetchForgeStatus, 300000);
    return () => clearInterval(syncInterval);
  }, []);

  // --- ⏲️ CALCULATE TRUE COUNTDOWN ---
  useEffect(() => {
    if (!forgeStatus?.nextReset) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(forgeStatus.nextReset).getTime();
      const diff = target - now;

      if (diff <= 0) {
        // If timer hits zero, trigger a fresh topic fetch
        window.location.reload(); 
        return;
      }

      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [forgeStatus]);

  // SYNC TOKENS
  useEffect(() => {
    if (user) {
      setTokensRemaining(isAdmin ? 999999 : (user as any).tokens_remaining || 0);
    }
  }, [user, isAdmin]);

  // SOCKET SETUP
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

  const fullTranscript = conversation
    .map(msg => `[${msg.name}] (${new Date(msg.timestamp).toLocaleString()})\n${msg.content}`)
    .reverse()
    .join('\n\n');

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header (keeping your original video logic) */}
      <div className="relative pt-12 pb-12 text-center border-b border-white/5">
        <div className="flex justify-center mb-6">
          <video autoPlay muted loop playsInline className="w-80 h-80 md:w-96 md:h-96 object-contain shadow-[0_0_80px_rgba(37,99,235,0.15)]">
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
          
          {/* THE FORGE PANEL (unchanged logic) */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
              <h2 className="font-bold flex items-center gap-2 text-sm uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Council Feed
              </h2>
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

            <div className="flex flex-col md:flex-row transition-all duration-500">
               <div className={`p-6 space-y-4 ${isShareOpen ? 'md:w-2/3 w-full' : 'w-full'}`}>
                 <textarea 
                   value={userMessage}
                   onChange={(e) => setUserMessage(e.target.value)}
                   disabled={!isAuthenticated || (!isAdmin && tokensRemaining <= 0)}
                   placeholder="Enter your query..."
                   className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white min-h-[150px] outline-none"
                 />
                 <button onClick={handleSendMessage} disabled={isSending} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-500 transition-all">
                   {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Engage Council'}
                 </button>
               </div>
               {isShareOpen && (
                 <div className="md:w-1/3 w-full p-4 border-l border-gray-800 animate-in slide-in-from-right">
                   <ShareDropdown conversationText={fullTranscript} username={(user as any)?.username || 'User'} setIsOpen={setIsShareOpen} />
                 </div>
               )}
            </div>
          </div>

          {/* SYNCED DAILY FORGE SIDEBAR */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs">
                  <Clock size={14} />
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
