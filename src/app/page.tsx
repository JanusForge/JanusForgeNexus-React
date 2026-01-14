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
 * Scaled to w-80 (320px) to ensure the verbiage in your 
 * janus-logo-video.mp4 is perfectly legible.
 */
const LogoVideo = () => (
  <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] overflow-hidden border border-indigo-500/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] bg-black/60 backdrop-blur-3xl flex items-center justify-center relative group">
    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse group-hover:bg-indigo-500/10 transition-colors duration-1000" />
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="w-full h-full object-cover relative z-10"
    >
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
  
  // OWNER BYPASS: admin@janusforge.ai [cite: 2025-11-27]
  const isOwner = user?.email === 'admin@janusforge.ai'; 
  const canAfford = isOwner || (user?.tokens_remaining && user.tokens_remaining >= 3);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending || !canAfford) return;
    setIsSending(true);
    try {
      // Backend synthesis logic will go here
      setUserMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex relative overflow-hidden font-sans">
      <ConversationSidebar
  onSelectConversation={(id) => setCurrentConversationId(id)} // Accepts string or null
  currentConversationId={currentConversationId}
  isOpen={isSidebarOpen}
  onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
/>      
      <main className="flex-1 flex flex-col relative z-10">
        {/* Dynamic Background Accents */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] -z-10" />
        
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-2xl">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                {/* ENLARGED STATUS TEXT TO MATCH SIDEBAR */}
                <h1 className="text-xs md:text-sm font-black uppercase tracking-[0.6em] text-zinc-400">
                  Frontier Model Cluster <span className="text-indigo-400 ml-4">Online</span>
                </h1>
             </div>
          </div>
          
          {isOwner && (
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Owner Access</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-center">
          {!currentConversationId ? (
            <div className="text-center max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards">
              
              {/* THE ENLARGED LOGO CORE */}
              <div className="mb-16 animate-float flex justify-center">
                <LogoVideo />
              </div>

              {/* STRIKING TYPOGRAPHY */}
              <h2 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white via-white to-zinc-700 bg-clip-text text-transparent leading-[0.85]">
                Nexus Prime
              </h2>
              <p className="text-zinc-500 text-sm md:text-xl leading-relaxed uppercase tracking-[0.4em] font-medium max-w-3xl mx-auto opacity-80">
                Synchronize intelligence across the frontier
              </p>
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto p-8">
              {/* ⚠️ This is where the private chat showdown content will render */}
              <div className="p-12 border border-white/5 rounded-[3rem] bg-zinc-900/20 text-center">
                 <Sparkles className="mx-auto mb-4 text-indigo-500" />
                 <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Synthesis in Progress</p>
              </div>
            </div>
          )}
        </div>

        {/* INPUT PORTAL */}
        <div className="p-12 md:p-20 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-5xl mx-auto relative">
            <div className="bg-zinc-900/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Owner Directive: Influence the Cluster..." : "Synthesize new logic..."}
                className="w-full bg-transparent p-12 text-white min-h-[200px] outline-none resize-none text-xl font-light placeholder:text-zinc-800"
              />
              <div className="p-8 border-t border-white/5 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 text-zinc-500">
                  <Zap size={24} className="text-amber-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Adversarial Engine Active</span>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !userMessage.trim() || !canAfford}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-16 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.4em] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-indigo-600/30"
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
