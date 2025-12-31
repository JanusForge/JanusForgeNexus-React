"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, Globe, ShieldCheck, Clock, ChevronRight, Share2 } from 'lucide-react';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';
import ShareDropdown from '@/components/ShareDropdown';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const isAdmin = (user as any)?.username === 'admin-access';

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [conversation, setConversation] = useState<any[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // --- FIX: TRUE UTC HEARTBEAT TIMER ---
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target is 12:00 AM UTC (Match Render Cron)
      const nextReset = new Date();
      nextReset.setUTCHours(24, 0, 0, 0); 
      
      const diff = nextReset.getTime() - now.getTime();
      
      if (diff <= 0) {
        // Trigger refresh when topic changes
        window.location.reload();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    };

    // Initial calculation to prevent jump
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ... (Keep existing Socket.io and Auth logic) ...

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* ... (Keep existing Header/Video logic) ... */}

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          
          {/* ... (Keep existing Forge Panel logic) ... */}

          {/* SYNCED DAILY FORGE SIDEBAR */}
          <div className="sticky top-12 space-y-6">
            <div className="bg-gradient-to-br from-[#0F0F0F] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-3xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-xs">
                  <Clock size={14} className="animate-pulse" />
                  <span>{timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                </div>
              </div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">The Daily Forge</h2>
              
              {/* This label should eventually fetch from /api/daily-forge/status */}
              <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 px-3 py-1 bg-blue-500/5 rounded-lg border border-blue-500/10 inline-block">
                Neural Ethics: Late 2025
              </div>
              
              <div className="space-y-4 mb-8 text-[11px]">
                <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  <span className="text-yellow-500 font-black uppercase block mb-1">Scout</span>
                  <p className="text-gray-400 italic font-medium leading-relaxed">
                    "The Council is playing it safe. These neural guardrails are actually throttling creativity."
                  </p>
                </div>
                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 text-right">
                  <span className="text-blue-400 font-black uppercase block mb-1">Council</span>
                  <p className="text-gray-200 font-medium leading-relaxed">
                    "Guardrails aren't walls—they are lenses. Without them, intelligence is blind."
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
