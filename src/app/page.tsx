"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Loader2, Sparkles, ShieldCheck, Zap, 
  Cpu, ChevronRight 
} from 'lucide-react';
import ConversationSidebar from './components/ConversationSidebar';

/**
 * 64x64 Neural Logo Component
 * Points to the exact file: /janus-logo-video.mp4
 */
const LogoVideo = () => (
  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-zinc-900 flex items-center justify-center">
    <video 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="w-full h-full object-cover"
    >
      {/* UPDATED TO MATCH YOUR FILE NAME */}
      <source src="/janus-logo-video.mp4" type="video/mp4" />
      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping" />
    </video>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // OWNER BYPASS: admin@janusforge.ai gets unrestricted access [cite: 2025-11-27]
  const isOwner = user?.email === 'admin@janusforge.ai'; [cite: 2025-11-27]
  const canAfford = isOwner || (user?.tokens_remaining && user.tokens_remaining >= 3); [cite: 2025-11-27]

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending || !canAfford) return;
    setIsSending(true);
    try {
      // Backend synthesis logic
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

      <main className="flex-1 flex flex-col relative z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center">
                  <Cpu size={10} className="text-indigo-400" />
                </div>
              ))}
            </div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Frontier Model Cluster <span className="text-indigo-500 ml-2">Online</span>
            </h1>
          </div>
          
          {isOwner && ( [cite: 2025-11-27]
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Owner Access Active</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar flex flex-col items-center justify-center">
          {!currentConversationId && (
            <div className="text-center max-w-3xl mx-auto animate-in fade-in zoom-in duration-700">
              {/* THE LOGO PLACEMENT */}
              <div className="mb-10 animate-float flex justify-center">
                <LogoVideo />
              </div>

              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Nexus Prime
              </h2>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed uppercase tracking-[0.2em] font-medium max-w-xl">
                Initialize adversarial synthesis across the frontier model cluster
              </p>
            </div>
          )}
        </div>

        {/* INPUT PORTAL */}
        <div className="p-8 md:p-16 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
          <div className="max-w-4xl mx-auto relative">
            <div className="relative group p-[1px] rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/40 transition-all duration-500 shadow-neural">
              <div className="bg-[#0a0a0a] rounded-[1.9rem] overflow-hidden">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isOwner ? "Owner Mode: Synthesis Enabled..." : "Challenge the cluster... (3 Tokens)"} [cite: 2025-11-27]
                  className="w-full bg-transparent p-8 md:p-10 text-white min-h-[160px] outline-none transition-all resize-none text-lg font-light placeholder:text-zinc-700"
                />
                
                <div className="p-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/40">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Adversarial Mode</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || !userMessage.trim() || !canAfford}
                    className={`group flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
                      canAfford 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20' 
                      : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {isSending ? <Loader2 className="animate-spin" size={18} /> : (
                      <>Initialize Showdown <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
