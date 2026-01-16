"use client";

import React from 'react';
import { Plus, History, MessageSquare, Zap } from 'lucide-react';

interface SidebarProps {
  onSelectConversation: (id: string) => void;
  currentConversationId: string | null;
}

export default function ConversationSidebar({ onSelectConversation, currentConversationId }: SidebarProps) {
  return (
    <aside className="w-80 h-screen bg-[#050505] border-r border-white/5 flex flex-col z-40">
      {/* 🟢 NEURAL HISTORY TITLE: Scaled up for better visibility */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <History size={20} className="text-indigo-500" />
        <h2 className="text-[14pt] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
          Neural History
        </h2>
      </div>

      <div className="px-4 mb-8">
        <button 
          onClick={() => window.location.reload()} // Quick reset for new synthesis
          className="w-full bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-indigo-500/30 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all group"
        >
          <Plus size={18} className="text-zinc-500 group-hover:text-indigo-400" />
          <span className="text-[11pt] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-200">
            New Synthesis
          </span>
        </button>
      </div>

      {/* 📂 Scrollable History List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
        {/* If no history exists yet */}
        <div className="py-20 flex flex-col items-center justify-center text-center px-6 opacity-20">
          <Zap size={32} className="mb-4 text-zinc-700" />
          <p className="text-[10pt] font-bold uppercase tracking-widest text-zinc-500">
            No Active Links
          </p>
        </div>
      </div>

      {/* 🔐 Footer Identity */}
<div className="p-6 border-t border-white/5 bg-black/20">
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center font-black text-xs">
      JF
    </div>
    <div className="flex flex-col">
      {/* ✅ UPDATED: Added Nexus® to reflect the full legal name */}
      <span className="text-[10pt] font-black uppercase tracking-tighter text-zinc-300">
        Janus Forge Nexus®
      </span>
      <span className="text-[8pt] font-bold text-zinc-600 uppercase">
        System Identity
      </span>
    </div>
  </div>
</div>
    </aside>
  );
}
