"use client";
import { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Radio, Activity } from 'lucide-react';
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

  const allNodes = useRef<any[]>([]);
  const allEdges = useRef<any[]>([]);

  useEffect(() => {
    const socket = io(API_BASE_URL, { withCredentials: true });
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
            prompt, institution, userType, userId: user.id,
            conversationId: activeThreadId,
            models: ['CLAUDE', 'GPT4', 'GEMINI', 'GROK', 'DEEPSEEK']
        })
      });
      setPrompt("");
    } catch (err) { setIsSynthesizing(false); }
  };

  return (
    <div className="flex flex-col bg-zinc-900/80 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl h-[750px]">
      
      <div className="flex flex-1 overflow-hidden">
        <NodeArchiveSidebar institution={institution} userType={userType} onSelectThread={handleLoadThread} onNewThread={handleNewThread} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
            <div className="flex items-center gap-3">
              <Radio size={18} className={isSynthesizing ? "animate-pulse text-emerald-400" : "text-zinc-600"} />
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                {institution || 'Nexus Prime'} | {userType}
              </h2>
            </div>
            <Shield size={16} className="text-zinc-800" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {feed.map((msg: any) => {
              const content = msg.content || "";
              const flowRegex = /```(?:json-flow|json)\s*([\s\S]*?)```/;
              const match = content.match(flowRegex);

              // --- FLOW ENGINE RENDERING ---
              if (match && match[1]) {
                try {
                  const data = JSON.parse(match[1].trim());
                  if (data.nodes) data.nodes.forEach((n: any) => {
                    if (!allNodes.current.find(ex => ex.id === n.id)) allNodes.current.push(n);
                  });
                  if (data.edges) data.edges.forEach((e: any) => {
                    if (!allEdges.current.find(ex => ex.id === e.id)) allEdges.current.push(e);
                  });

                  return (
                    <div key={msg.id} className="w-full space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">
                        Neural Graph Sync: {msg.ai_model || msg.name || 'Nexus'}
                      </p>
                      <div className="relative z-10 w-full rounded-2xl border border-white/5 bg-black/40" style={{ height: '450px' }}>
                        <FlowViewer nodes={[...allNodes.current]} edges={[...allEdges.current]} />
                      </div>
                    </div>
                  );
                } catch (err: any) { return <p key={msg.id} className="text-xs text-red-400">Fragment Error</p>; }
              }

              // --- STANDARD TEXT RENDERING ---
              return (
                <div key={msg.id} className={`flex flex-col ${msg.is_human ? 'items-end' : 'items-start'}`}>
                  {/* ✅ RESTORED IDENTITY LABELS */}
                  {!msg.is_human && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 italic">
                      {msg.ai_model || msg.name || 'Sovereign Node'}
                    </span>
                  )}
                  <div className={`p-5 rounded-3xl text-sm leading-relaxed max-w-[85%] ${
                    msg.is_human ? 'bg-indigo-600/20 border border-indigo-500/30 text-white' : 'bg-zinc-800 text-zinc-100 shadow-xl'
                  }`}>
                    {content}
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
                className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
                placeholder="Instruct the Council..." 
              />
              <button onClick={handleIgnite} className="absolute right-2 p-3 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl text-white">
                <Zap size={18}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
