"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { RefreshCw, Share2, ExternalLink, Loader2 } from 'lucide-react';
import ConversationSidebar from '@/components/nexus/ConversationSidebar';
import CouncilBuilder from './components/CouncilBuilder';
import { exportToPDF } from '@/utils/exportProtocol';

const SkeletonCard = () => (
  <div className="bg-zinc-900/20 border border-white/5 p-8 rounded-[2rem] animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-2 h-2 rounded-full bg-zinc-800" />
      <div className="h-3 w-24 bg-zinc-800 rounded" />
    </div>
    <div className="space-y-3">
      <div className="h-3 w-full bg-zinc-800/50 rounded" />
      <div className="h-3 w-5/6 bg-zinc-800/50 rounded" />
    </div>
  </div>
);

const LogoVideo = () => (
  <div className="flex justify-center w-full mb-2">
    <div style={{ width: '480px', aspectRatio: '1/1' }} className="rounded-[2.5rem] overflow-hidden border border-indigo-500/20 shadow-2xl bg-black/60 backdrop-blur-3xl relative z-20">
      <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90">
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
  const [selectedModels, setSelectedModels] = useState<string[]>(['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']);

  // ✅ NEURAL SYNC: This connects the Sidebar clicks to the Main Stage
  useEffect(() => {
    const syncWithArchive = async () => {
      if (!currentConversationId || isSynthesizing) return;
      
      try {
        const res = await fetch(`https://janusforgenexus-backend.onrender.com/api/nexus/synthesis/${currentConversationId}`);
        const data = await res.json();
        
        if (res.ok && data) {
          setUserMessage(data.prompt || '');
          setSynthesisResults(data.results || []);
        }
      } catch (err) {
        console.error("Neural Sync Error:", err);
      }
    };

    syncWithArchive();
  }, [currentConversationId]);

  const handleIgnition = async (modelsToUse: string[] = selectedModels) => {
    if (!userMessage.trim() || isSynthesizing) return;

    setIsSynthesizing(true);
    setSynthesisResults([]); 

    try {
      const response = await fetch('https://janusforgenexus-backend.onrender.com/api/nexus/ignite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          models: modelsToUse,
          userId: user?.id,
          parentConversationId: currentConversationId
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentConversationId(data.conversationId);
        setSynthesisResults(data.results || []);
      }
    } catch (error) {
      console.error("Ignition Error:", error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleIgnition(selectedModels);
    }
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
        <div id="synthesis-stage" className="w-full flex flex-col items-center py-10 px-8">
          <LogoVideo />

          <div className="w-full max-w-4xl mb-12 no-print">
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSynthesizing}
              placeholder={isSynthesizing ? "Cluster Synchronizing..." : "Initiate Strategic Objective..."}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-[3rem] p-12 text-white min-h-[180px] outline-none resize-none text-xl text-center shadow-2xl transition-all"
            />
          </div>

          {(isSynthesizing || synthesisResults.length > 0) && (
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {isSynthesizing
                ? selectedModels.map((_, idx) => <SkeletonCard key={idx} />)
                : synthesisResults.map((res, idx) => (
                    <div key={idx} className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all">
                      <h3 className="text-indigo-400 font-black uppercase text-[10px] mb-4 tracking-widest">{res.model} PROTOCOL</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{res.response || res.error}</p>
                    </div>
                  ))
              }
            </div>
          )}

          <div className="w-full max-w-5xl pb-20 no-print">
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
