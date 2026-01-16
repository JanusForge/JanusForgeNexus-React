"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { RefreshCw, Share2, ExternalLink, Loader2 } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from './components/CouncilBuilder';
import { exportToPDF } from '@/utils/exportProtocol';

const LogoVideo = () => (
  <div className="flex justify-center w-full mb-2">
    <div style={{ width: '480px', aspectRatio: '1/1' }} className="rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-2xl bg-black/60 backdrop-blur-3xl relative z-20 group">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000">
        <source src="/janus-logo-video.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
);

export default function NexusPrimeEngine() {
  const { user } = useAuth();
  const [userMessage, setUserMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResults, setSynthesisResults] = useState<any[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const isOwner = user?.email === 'admin@janusforge.ai';

  // ✅ 1. LOAD ARCHIVE (Restores past "Talk")
  useEffect(() => {
    const loadArchivedSynthesis = async () => {
      if (!currentConversationId || isSynthesizing) return;
      try {
        const res = await fetch(`https://janusforgenexus-backend.onrender.com/api/nexus/synthesis/${currentConversationId}`);
        const data = await res.json();
        if (res.ok && data) {
          setUserMessage(data.prompt);
          setSynthesisResults(data.results || []);
          setShareUrl(data.shareSlug ? `https://janusforgenexus-react.vercel.app/share/${data.shareSlug}` : null);
        }
      } catch (err) { console.error("Neural Recovery Failed:", err); }
    };
    loadArchivedSynthesis();
  }, [currentConversationId]);

  // ✅ 2. IGNITION (The Adversarial Trigger)
  const handleIgnition = async (selectedModels: string[] = []) => {
    if (!userMessage.trim() || isSynthesizing) return;
    setIsSynthesizing(true);
    setShareUrl(null);

    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/ignite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          models: selectedModels,
          userId: user?.id,
          parentConversationId: currentConversationId // 🧠 CRITICAL: This enables the "Back and Forth"
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentConversationId(data.conversationId);
        setSynthesisResults(data.results || []);
      }
    } catch (error) { console.error("Ignition Error:", error); } finally { setIsSynthesizing(false); }
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar 
        onSelectConversation={setCurrentConversationId} 
        currentConversationId={currentConversationId}
        onPrint={() => window.print()}
        onDownload={(id) => exportToPDF('synthesis-stage', `Janus-Report-${id}`)}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        <header className="p-6 flex justify-between items-center border-b border-white/5 bg-black/90 backdrop-blur-xl sticky top-0 z-30">
          <h2 className="text-[12pt] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Nexus Prime Cluster Online</h2>
          {isOwner && <span className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">MASTER AUTHORITY</span>}
        </header>

        <div id="synthesis-stage" className="w-full flex flex-col items-center py-10 px-8">
          <LogoVideo />
          <h2 className="text-7xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent mb-8">Nexus Prime</h2>

          <div className="w-full max-w-4xl mb-12 no-print">
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Initiate Strategic Objective..."
              className="w-full bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-12 text-white text-xl text-center outline-none resize-none focus:border-indigo-500/30 transition-all"
            />
          </div>

          {/* 🎭 ADVERSARIAL CARDS */}
          {synthesisResults.length > 0 && (
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {synthesisResults.map((res, idx) => (
                <div key={idx} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                  <h3 className="text-indigo-400 font-black uppercase italic text-[10px] mb-4 tracking-widest">{res.model} PROTOCOL</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{res.response || res.error}</p>
                </div>
              ))}
            </div>
          )}

          <div className="w-full max-w-5xl pb-20 no-print">
             <CouncilBuilder userBalance={user?.tokens_remaining || 0} onIgnite={handleIgnition} />
          </div>
        </div>
      </main>
    </div>
  );
}
