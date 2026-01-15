"use client";

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Zap, Shield, Cpu, Terminal } from 'lucide-react';

export default function NexusPrimePage() {
  const [query, setQuery] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [statusText, setStatusText] = useState("System Ready");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on load for immediate interaction
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 🛡️ Deploy Protocol: Send on 'Enter', allow new line on 'Shift + Enter'
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      deployToCouncil();
    }
  };

  const deployToCouncil = async () => {
    if (!query.trim() || isDeploying) return;
    
    setIsDeploying(true);
    setStatusText("Transmitting to Council...");

    try {
      // 📡 Simulation of dispatching query to the backend
      console.log("🚀 Query dispatched to Council:", query);
      
      // Artificial delay for cinematic effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setQuery("");
      setStatusText("Query Received. Council deliberating...");
      
      // Reset status after a few seconds
      setTimeout(() => setStatusText("System Ready"), 3000);
    } catch (err) {
      setStatusText("Transmission Failed. Retry.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-12 flex flex-col items-center">
        
        {/* Cinematic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 italic">
              Nexus Prime Interface
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
            Consult the <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Council</span>
          </h1>
        </motion.div>

        {/* Input Area */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative bg-zinc-900/40 border border-white/5 rounded-[3rem] p-2 backdrop-blur-3xl shadow-2xl">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a prompt to initiate civilization-scale problem solving..."
              className="w-full bg-transparent border-none rounded-[2.5rem] p-8 pb-20 text-lg md:text-xl font-medium placeholder-zinc-700 focus:ring-0 resize-none min-h-[200px] transition-all"
            />
            
            {/* Action Bar */}
            <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-zinc-500">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{statusText}</span>
                </div>
                <div className="h-4 w-[1px] bg-zinc-800" />
                <span className="text-[10px] font-bold uppercase tracking-tighter italic">
                  Shift + Enter for new line
                </span>
              </div>

              <button
                onClick={deployToCouncil}
                disabled={!query.trim() || isDeploying}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all
                  ${query.trim() && !isDeploying 
                    ? 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-lg shadow-white/5' 
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
              >
                {isDeploying ? (
                  <Zap size={16} className="animate-pulse text-amber-500" />
                ) : (
                  <SendHorizontal size={16} />
                )}
                Deploy Query
              </button>
            </div>
          </div>
        </div>

        {/* Footer Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-8 w-full max-w-2xl text-center"
        >
          <Indicator icon={<Shield size={14}/>} label="Security" value="Protocol 0" />
          <Indicator icon={<Cpu size={14}/>} label="Council" value="Synchronized" />
          <Indicator icon={<Zap size={14}/>} label="Neural Link" value="Active" />
        </motion.div>
      </main>
    </div>
  );
}

function Indicator({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-zinc-600">{icon}</div>
      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">{label}</span>
      <span className="text-[10px] font-bold uppercase tracking-tighter text-indigo-400">{value}</span>
    </div>
  );
}
