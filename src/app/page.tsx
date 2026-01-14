"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Loader2, Sparkles, ShieldCheck, Zap, 
  Cpu, ChevronRight 
} from 'lucide-react';
import ConversationSidebar from './components/ConversationSidebar';

/**
 * Cinematic Neural Core Component
 * Scaled to ensure the verbiage in your janus-logo-video.mp4 is legible.
 */
const LogoVideo = () => (
  <div className="w-64 h-64 md:w-96 md:h-96 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative group">
    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors duration-1000" />
    <video autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10">
      <source src="/janus-logo-video.mp4" type="video/mp4" />
    </video>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // OWNER BYPASS: admin@janusforge.ai
  const isOwner = user?.email === 'admin@janusforge.ai'; 
  const canAfford = isOwner || (user?.tokens_remaining && user.tokens_remaining >= 3);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending || !canAfford) return;
    setIsSending(true);
    try {
      setUserMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex relative overflow-hidden font-sans">
      <ConversationSidebar
        onSelectConversation={(id: string) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col relative z-10">
        <header className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-2xl">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                {/* ENLARGED STATUS TEXT */}
                <h1 className="text-xs md:text-sm font-black uppercase tracking-[0.6em] text-zinc-400">
                  Frontier Model Cluster <span className="text-indigo-400 ml-4">Online</span>
                </h1>
             </div>
          </div>
          
          {isOwner && (
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Master Console</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center">
          {!currentConversationId && (
            <div className="text-center max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="mb-20 animate-float flex justify-center">
                <LogoVideo />
              </div>

              <h2 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter mb-10 bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent leading-[0.8]">
                Nexus Prime
              </h2>
              <p className="text-zinc-500 text-base md:text-2xl leading-relaxed uppercase tracking-[0.5em] font-medium max-w-4xl mx-auto opacity-70">
                Synchronize intelligence across the frontier
              </p>
            </div>
          )}
        </div>

        <div className="p-12 md:p-24 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="max-w-6xl mx-auto relative">
            <div className="bg-zinc-900/60 rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.6)] backdrop-blur-md">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Owner Directive: Influence the Cluster..." : "Synthesize new logic..."}
                className="w-full bg-transparent p-14 text-white min-h-[240px] outline-none resize-none text-2xl font-light placeholder:text-zinc-800"
              />
              <div className="p-10 border-t border-white/5 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4 text-zinc-400">
                  <Zap size={24} className="text-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">Adversarial Engine Active</span>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !userMessage.trim() || !canAfford}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-20 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.5em] transition-all transform hover:scale-[1.03] active:scale-95 shadow-2xl shadow-indigo-600/40"
                >
                  {isSending ? <Loader2 className="animate-spin" size={24} /> : "Initialize Showdown"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
