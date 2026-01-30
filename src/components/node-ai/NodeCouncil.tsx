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

  // 🏛️ CUMULATIVE MANIFOLD STATE
  // These arrays persist across the entire session to collect model contributions
  const allNodes = useRef<any[]>([]);
  const allEdges = useRef<any[]>([]);

  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
    
    // Unified listener for Nexus and Institutional transmissions
    const channel = institution ? `node:${institution}:transmission` : 'nexus:transmission';
    
    socket.on(channel, (data: any) => {
      setFeed((prev) => [...prev, data]);
      setIsSynthesizing(false);
    });
    
    return () => { socket.disconnect(); };
  }, [institution]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [feed]);

  const handleLoadThread = (thread: any) => {
    // Reset manifolds when loading a new thread
    allNodes.current = [];
    allEdges.current = [];
    setFeed(thread.posts || []);
    setActiveThreadId(thread.id);
  };

  const handleNewThread = () => {
    allNodes.current = [];
    allEdges.current = [];
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

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {feed.map((msg: any) => {
            const content = msg.content || "";
            
            // 🛡️ REGEX: Handles spaces and different json tags
            const flowRegex = /```(?:json-flow|json)\s*([\s\S]*?)```/;
            const match = content.match(flowRegex);

            if (match && match[1]) {
              try {
                const data = JSON.parse(match[1].trim());
                
                // 🏛️ CUMULATIVE UPDATE LOGIC
                // We use a ref so the graph grows as we map through the feed
                if (data.nodes) {
                  data.nodes.forEach((newNode: any) => {
                    const exists = allNodes.current.find(n => n.id === newNode.id);
                    if (!exists) allNodes.current.push(newNode);
                  });
                }
                if (data.edges) {
                  data.edges.forEach((newEdge: any) => {
                    const exists = allEdges.current.find(e => e.id === newEdge.id);
                    if (!exists) allEdges.current.push(newEdge);
                  });
                }

                const textParts = content.split(flowRegex);

                return (
                  <div key={msg.id} className="flex flex-col items-start w-full">
                    <span className="text-[8px] font-black uppercase text-zinc-600 mb-2 px-2">{msg.name}</span>
                    <div className="p-6 rounded-3xl w-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-50">
                      {textParts[0] && <p className="whitespace-pre-wrap mb-4">{textParts[0].trim()}</p>}
                      
                      {/* 🛡️ GRAPH MANIFESTATION ZONE */}
                      <div className="relative z-10 w-full" style={{ height: '400px', minHeight: '400px' }}>
                        <FlowViewer 
                          key={`flow-${msg.id}`} 
                          nodes={[...allNodes.current]} 
                          edges={[...allEdges.current]} 
                        />
                      </div>

                      {textParts[textParts.length - 1] && (
                        <p className="mt-4 text-zinc-500 italic text-[10px]">{textParts[textParts.length - 1].trim()}</p>
                      )}
                    </div>
                  </div>
                );
              } catch (e) {
                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <p className="p-5 rounded-3xl bg-red-500/5 border border-red-500/10 text-red-200 text-xs font-mono">
                      [!] Visual Synthesis Fragment Corrupted
                    </p>
                  </div>
                );
              }
            }

            // Standard message fallback
            return (
              <div key={msg.id} className={`flex flex-col ${msg.is_human ? 'items-end' : 'items-start'}`}>
                <span className="text-[8px] font-black uppercase text-zinc-600 mb-1 px-2">
                  {msg.is_human ? (user?.username || 'SovereignNode') : msg.name}
                </span>
                <div className={`p-5 rounded-3xl max-w-[85%] text-sm leading-relaxed ${msg.is_human ? 'bg-zinc-800 border border-white/5 text-white' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-50'}`}>
                   <p className="whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            );
          })}
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
              className={`absolute right-2 p-3 rounded-xl transition-all ${accentColor || 'bg-indigo-600'}`}
            >
              <Zap size={18}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
