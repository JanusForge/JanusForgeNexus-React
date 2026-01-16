"use client";

import React, { useState, useEffect } from 'react';
import { 
  History, 
  MessageSquare, 
  Zap, 
  Loader2, 
  Printer, 
  Download, 
  Share2, 
  RefreshCcw 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SidebarProps {
  onSelectConversation: (id: string | null) => void;
  currentConversationId: string | null;
  // These are passed from the main page to handle the heavy lifting
  onDownload?: (id: string) => void;
  onPrint?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export default function ConversationSidebar({ 
  onSelectConversation, 
  currentConversationId,
  onDownload,
  onPrint,
  onPublish
}: SidebarProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ PROTOCOL: Fetch Neural History on Mount & Update
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`https://janusforgenexus-backend.onrender.com/api/nexus/history/${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setHistory(data);
        }
      } catch (err) {
        console.error("Neural History Sync Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id, currentConversationId]);

  // --- ACTION WRAPPERS ---
  // We use stopPropagation to ensure clicking an icon doesn't trigger the "Select" event
  
  const triggerPublish = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onPublish) onPublish(id);
  };

  const triggerDownload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDownload) onDownload(id);
  };

  const triggerPrint = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onPrint) onPrint(id);
  };

  return (
    <aside className="w-80 h-screen bg-[#050505] border-r border-white/5 flex flex-col z-40">
      
      {/* HEADER */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <History size={20} className="text-indigo-500" />
        <h2 className="text-[14pt] font-black uppercase tracking-[0.3em] text-zinc-400 italic">
          Neural History
        </h2>
      </div>

      {/* 🔄 RESET NEXUS (NEW SYNTHESIS REPLACEMENT) */}
      <div className="px-4 mb-8">
        <button
          onClick={() => onSelectConversation(null)}
          className="w-full bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 hover:border-indigo-500/30 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all group"
        >
          <RefreshCcw size={18} className="text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[11pt] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-200">
            Reset Nexus
          </span>
        </button>
      </div>

      {/* HISTORY LIST */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-zinc-700" />
          </div>
        ) : history.length > 0 ? (
          history.map((conv) => (
            <div key={conv._id} className="group relative">
              <button
                onClick={() => onSelectConversation(conv._id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  currentConversationId === conv._id
                  ? 'bg-indigo-500/10 border-indigo-500/40'
                  : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={14} className={currentConversationId === conv._id ? 'text-indigo-400' : 'text-zinc-600'} />
                  <span className={`text-[9pt] font-bold uppercase tracking-wider truncate pr-10 ${
                    currentConversationId === conv._id ? 'text-zinc-200' : 'text-zinc-500'
                  }`}>
                    {conv.title}
                  </span>
                </div>
                <p className="text-[7pt] text-zinc-700 mt-1 ml-7 font-black italic uppercase">
                  {new Date(conv.timestamp).toLocaleDateString()}
                </p>
              </button>

              {/* 🛠️ ACTION OVERLAY: Visible on Hover */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-zinc-900 border border-white/10 p-1 rounded-lg shadow-2xl">
                <button 
                  onClick={(e) => triggerPrint(e, conv._id)} 
                  className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-blue-400 transition" 
                  title="Print Report"
                >
                  <Printer size={14} />
                </button>
                <button 
                  onClick={(e) => triggerDownload(e, conv._id)} 
                  className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-emerald-400 transition" 
                  title="Save PDF"
                >
                  <Download size={14} />
                </button>
                <button 
                  onClick={(e) => triggerPublish(e, conv._id)} 
                  className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-indigo-400 transition" 
                  title="Publish to Site"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6 opacity-20">
            <Zap size={32} className="mb-4 text-zinc-700" />
            <p className="text-[10pt] font-bold uppercase tracking-widest text-zinc-500">
              No Active Links
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center font-black text-xs">
            JF
          </div>
          <div className="flex flex-col">
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
