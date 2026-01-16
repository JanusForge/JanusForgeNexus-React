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
  
  // --- CORE STATE ---
  const [userMessage, setUserMessage] = useState('');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResults, setSynthesisResults] = useState<any[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  // --- MODEL SELECTION STATE (Lifted for onKeyDown access) ---
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);

  const isOwner = user?.email === 'admin@janusforge.ai';

  // ✅ 1. NEURAL RECONSTRUCTION (Loads History)
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

  // ✅ 2. STRATEGIC IGNITION (Adversarial Sequence)
  const handleIgnition = async (modelsToUse: string[] = selectedModels) => {
    if (!userMessage.trim() || isSynthesizing || modelsToUse.length < 2) return;
    
    setIsSynthesizing(true);
    setSynthesisResults([]);
    setShareUrl(null);

    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/ignite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          models: modelsToUse,
          userId: user?.id,
          parentConversationId: currentConversationId // 🧠 Memory link for back-and-forth
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setCurrentConversationId(data.conversationId);
        setSynthesisResults(data.results || []);
      }
    } catch (error) { 
      console.error("Ignition Protocol Error:", error); 
    } finally { 
      setIsSynthesizing(false); 
    }
  };

  // ✅ 3. KEYBOARD PROTOCOL (The "Enter" Fix)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleIgnition(selectedModels); // Uses the current cluster selection
    }
  };

  const handleReset = () => {
    setUserMessage('');
    setSynthesisResults([]);
    setCurrentConversationId(null);
    setShareUrl(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#020202]">
      {/* SIDEBAR */}
      <ConversationSidebar 
        onSelectConversation={setCurrentConversationId} 
        currentConversationId={currentConversationId}
        onPrint={() => window.print()}
        onDownload={(id) => exportToPDF('synthesis-stage', `Janus-Report-${id}`)}
      />

      <main className="flex-1 flex flex-col relative z-10 bg-black overflow-y-auto custom-scrollbar">
        <header className="p-6 flex justify-between items-center border-b border-white/5 bg-black/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-[12pt] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Nexus Prime Cluster Online</h2>
          </div>
          {isOwner && <span className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">MASTER AUTHORITY</span>}
        </header>

        <div id="synthesis-stage" className="w-full flex flex-col items-center py-10 px-8">
          <LogoVideo />
          <h2 className="text-7xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent mb-8">Nexus Prime</h2>

          {/* TEXTAREA WITH KEYBOARD BINDING */}
          <div className="w-full max-w-4xl mb-12 no-print">
            <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-xl">
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSynthesizing}
                placeholder={isSynthesizing ? "Synchronizing Cluster..." : "Initiate Strategic Objective..."}
                className="w-full bg-transparent p-12 text-white min-h-[180px] outline-none resize-none text-xl font-light placeholder:text-zinc-800 text-center disabled:opacity-50"
              />
            </div>
          </div>

          {/* ADVERSARIAL RESULTS */}
          {synthesisResults.length > 0 && (
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {synthesisResults.map((res, idx) => (
                <div key={idx} className="ai-card bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <h3 className="text-indigo-400 font-black uppercase italic text-[10px] tracking-widest">{res.model} PROTOCOL</h3>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{res.response || res.error}</p>
                </div>
              ))}
            </div>
          )}

          {/* COUNCIL BUILDER SECTION */}
          <div className="w-full max-w-5xl pb-20 no-print">
             <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent mb-12" />
             <CouncilBuilder 
                userBalance={user?.tokens_remaining || 0} 
                onIgnite={handleIgnition}
                selectedModels={selectedModels}
                setSelectedModels={setSelectedModels} 
             />
          </div>
        </div>
      </main>
    </div>
  );
}
