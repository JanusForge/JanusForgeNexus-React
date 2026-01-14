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
 * Scaled to 256x256 (w-64) to ensure video detail is legible.
 */
const LogoVideo = () => (
  <div className="w-64 h-64 rounded-[3rem] overflow-hidden border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] bg-zinc-900/50 backdrop-blur-3xl flex items-center justify-center relative">
    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="w-full h-full object-cover opacity-90"
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
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex relative overflow-hidden font-sans">
      <ConversationSidebar
        onSelectConversation={(id: string) => setCurrentConversationId(id)}
        currentConversationId={currentConversationId}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 flex flex-col relative z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
        
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Frontier Model Cluster <span className="text-indigo-500 ml-2">Online</span>
            </h1>
          </div>
          
          {isOwner && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Owner Access</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
          {!currentConversationId && (
            <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="mb-12 animate-float flex justify-center">
                <LogoVideo />
              </div>
              <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent">
                Nexus Prime
              </h2>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed uppercase tracking-[0.3em] font-medium max-w-2xl">
                Synthesize intelligence across the frontier
              </p>
            </div>
          )}
        </div>

        <div className="p-8 md:p-16">
          <div className="max-w-4xl mx-auto relative">
            <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={isOwner ? "Owner: Interject Directive..." : "Challenge the cluster..."}
                className="w-full bg-transparent p-10 text-white min-h-[160px] outline-none resize-none text-lg font-light"
              />
              <div className="p-6 border-t border-white/5 bg-black/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Adversarial Mode</span>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !userMessage.trim() || !canAfford}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all"
                >
                  Initialize Showdown
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
