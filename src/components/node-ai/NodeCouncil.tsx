"use client";
import { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Radio, Lock } from 'lucide-react';
import { io } from 'socket.io-client';
import { useAuth } from '@/components/auth/AuthProvider';
import NodeArchiveSidebar from '@/components/node-ai/NodeArchiveSidebar';
import FlowViewer from '@/components/ui/FlowViewer'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function NodeCouncil({ institution, userType, accentColor }: any) {
  const { user } = useAuth() as any;
  const [prompt, setPrompt] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    socket.on(`nexus:transmission`, (data: any) => {
      setFeed((prev) => [...prev, data]);
      setIsSynthesizing(false);
    });
    return () => { socket.disconnect(); };
  }, [institution]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [feed]);

  const handleLoadThread = (thread: any) => {
    setFeed(thread.posts || []);
    setActiveThreadId(thread.id);
  };

  const handleNewThread = () => {
    setFeed([]);
    setActiveThreadId(null);
  };

  const handleIgnite = async () => {
    if (!prompt.trim() || !user) return;
    setIsSynthesizing(true);
    try {
      await fetch(`${API_BASE_URL}/api/nodes/ignite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt, 
            institution, 
            userType, 
            userId: user.id, 
            conversationId: activeThreadId,
            models: ['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK'] 
        })
      });
      setPrompt("");
    } catch (err) { setIsSynthesizing(false); }
  };

  return (
    <div className="flex bg-zinc-900/80 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[650px]">
      <NodeArchiveSidebar
        institution={institution}
        userType={userType}
        onSelectThread={handleLoadThread}
        onNewThread={handleNewThread}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <Radio size={18} className={isSynthesizing ? "animate-pulse text-emerald-400" : "text-zinc-600"} />
            <div>
              <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest flex items-center gap-1"><Lock size={8}/> Secure Node Session</p>
              <h2 className="text-xs font-bold uppercase">{institution || 'Nexus Prime'} | {userType}</h2>
            </div>
          </div>
          <Shield size={16} className="text-zinc-800" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {feed.map((msg: any) => (
            <div key={msg.id} className={`flex flex-col ${msg.is_human ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] font-black uppercase text-zinc-600 mb-1 px-2">
                {msg.is_human ? (user?.username || 'SovereignNode') : msg.name}
              </span>
              <div className={`p-5 rounded-3xl max-w-[95%] text-sm leading-relaxed ${msg.is_human ? 'bg-zinc-800 border border-white/5 text-white' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-50'}`}>
                {(() => {
                  const content = msg.content || "";
                  
                  // 🏛️ EXTRA-RESILIENT FLOW PARSER
                  const flowRegex = /```(?:json-flow|json)\s*([\s\S]*?)```/;
                  const match = content.match(flowRegex);

                  if (match && match[1]) {
                    try {
                      const flowData = JSON.parse(match[1].trim());
                      const textParts = content.split(flowRegex);
                      
                      return (
                        <div className="space-y-4 w-full relative">
                          {textParts[0] && <p className="whitespace-pre-wrap">{textParts[0].trim()}</p>}
                          
                          {/* 🛡️ FORCE STACKING CONTEXT */}
                          <div className="relative z-50 w-full min-h-[400px]">
                            <FlowViewer 
                              nodes={flowData.nodes || []} 
                              edges={flowData.edges || []} 
                            />
                          </div>

                          {textParts[textParts.length - 1] && (
                            <p className="whitespace-pre-wrap text-zinc-400 italic text-[11px] mt-4">
                              {textParts[textParts.length - 1].trim()}
                            </p>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return <p className="whitespace-pre-wrap">{content}</p>;
                    }
                  }

                  return <p className="whitespace-pre-wrap">{content}</p>;
                })()}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-black/60 border-t border-white/5">
          <div className="relative flex items-center">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleIgnite()}
              placeholder="Instruct the Council..."
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 px-6 pr-16 text-xs focus:outline-none"
            />
            <button
              onClick={handleIgnite}
              className={`absolute right-2 p-3 rounded-xl transition-all ${accentColor || 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
              <Zap size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
