"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Terminal, ShieldCheck, RefreshCw, Share2, ExternalLink } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from './components/CouncilBuilder';

const LogoVideo = () => (
  <div className="flex justify-center w-full mb-2">
    <div style={{ width: '540px', aspectRatio: '1/1' }} className="rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-2xl bg-black/60 backdrop-blur-3xl relative z-20 group">
      <video
        autoPlay loop muted playsInline
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
      >
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

  const isOwner = user?.email === 'admin@janusforge.ai' || user?.role === 'GOD_MODE';
  const userBalance = user?.tokens_remaining ?? 0;

  // 🔍 RECONSTRUCTION: Load past syntheses
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
      } catch (err) { console.error("Recovery Failed:", err); }
    };
    loadArchivedSynthesis();
  }, [currentConversationId]);

  // 🌎 SHARING: Generate Public Report
  const handleShare = async () => {
    if (!currentConversationId) return;
    try {
      const res = await fetch(`https://janusforgenexus-backend.onrender.com/api/nexus/share/${currentConversationId}`, { method: 'POST' });
      const data = await res.json();
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        navigator.clipboard.writeText(data.shareUrl);
      }
    } catch (err) { console.error("Sharing failed:", err); }
  };

  const handleReset = () => {
    setUserMessage(''); setSynthesisResults([]); setCurrentConversationId(null); setShareUrl(null);
  };

  const handleIgnition = async (selectedModels: string[] = []) => {
    if (!userMessage.trim() || isSynthesizing) return;
    setIsSynthesizing(true); setSynthesisResults([]); setShareUrl(null);
    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/ignite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, models: selectedModels, userId: user?.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentConversationId(data.conversationId);
        setSynthesisResults(data.results || []);
      }
    } catch (error) { console.error("Ignition Error:", error); } finally { setIsSynthesizing(false); }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleIgnition(); }
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      <ConversationSidebar onSelectConversation={setCurrentConversationId} currentConversationId={currentConversationId} />
      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        <header className="p-6 w-full flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-2xl z-30 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
             <h2 className="text-[12pt] font-black uppercase tracking-[0.5em] text-zinc-500 italic">
               Nexus Prime Cluster <span className="text-indigo-400 ml-3">Online</span>
             </h2>
          </div>
          {isOwner && (
            <div className="px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <span className="text-[12pt] font-black uppercase tracking-[0.4em] text-indigo-400 italic">Master Authority</span>
            </div>
          )}
        </header>

        <div className="w-full flex flex-col items-center py-10 px-8">
          <div className="flex flex-col items-center mb-8 w-full text-center">
            <LogoVideo />
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent leading-none mb-4">Nexus Prime</h2>
            <p className="text-zinc-500 text-sm md:text-base uppercase tracking-[0.92em] font-bold opacity-60 italic whitespace-nowrap">Synchronize Intelligence Across The Frontier</p>
          </div>

          <div className="w-full max-w-4xl relative mb-12">
            <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-xl">
              <textarea
                value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={isSynthesizing ? "Synchronizing Cluster..." : "Initiate Strategic Objective..."}
                disabled={isSynthesizing}
                className="w-full bg-transparent p-12 text-white min-h-[180px] outline-none resize-none text-xl font-light placeholder:text-zinc-800 text-center disabled:opacity-50"
              />
            </div>
          </div>

          {synthesisResults.length > 0 && (
            <div className="w-full max-w-5xl mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in duration-700">
              {synthesisResults.map((res, index) => (
                <div key={index} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] backdrop-blur-3xl shadow-2xl group hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    <h3 className="text-[9pt] font-black uppercase tracking-[0.3em] text-indigo-400 italic">{res.model} Protocol</h3>
                  </div>
                  <p className="text-zinc-300 font-light leading-relaxed text-sm">{res.response || res.error}</p>
                </div>
              ))}
            </div>
          )}

          {synthesisResults.length > 0 && !isSynthesizing && (
            <div className="flex flex-col items-center gap-6 mb-12">
              <div className="flex items-center gap-4">
                <button onClick={handleReset} className="flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <RefreshCw size={16} className="text-zinc-500 group-hover:rotate-180 transition-transform duration-700" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Reset Nexus</span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all group">
                  <Share2 size={16} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{shareUrl ? 'Link Copied' : 'Share Synthesis'}</span>
                </button>
              </div>
              {shareUrl && (
                <a href={shareUrl} target="_blank" className="flex items-center gap-2 text-[8pt] text-indigo-400/60 font-black uppercase tracking-[0.2em] hover:text-indigo-400 transition-colors">
                  <ExternalLink size={12} /> View Public Report
                </a>
              )}
            </div>
          )}

          <div className="w-full max-w-5xl pb-20">
             <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent mb-12" />
             <CouncilBuilder userBalance={isOwner ? 999999 : userBalance} onIgnite={handleIgnition} />
          </div>
        </div>
      </main>
    </div>
  );
}
