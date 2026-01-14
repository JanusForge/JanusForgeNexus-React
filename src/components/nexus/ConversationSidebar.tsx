"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { History, ShieldCheck, Plus, Terminal } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';

interface SidebarProps {
  onSelectConversation: (id: string | null) => void;
  currentConversationId: string | null;
}

export default function ConversationSidebar({ 
  onSelectConversation, 
  currentConversationId 
}: SidebarProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const isOwner = user?.email === 'admin@janusforge.ai';

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    // Hits the new isolated Nexus endpoint we created in Step 1
    const res = await fetch(`${API_BASE_URL}/api/nexus/history?userId=${user.id}`);
    if (res.ok) setHistory(await res.json());
  }, [user]);

  useEffect(() => {
    fetchHistory();

    const socket = io(API_BASE_URL);
    // Real-time update when a new Title is synthesized by the cluster
    socket.on('sidebar:update', () => fetchHistory());

    return () => { socket.disconnect(); };
  }, [fetchHistory]);

  return (
    <aside className="w-80 h-screen bg-[#050505] border-r border-white/5 flex flex-col relative z-20">
      {/* Sidebar Header */}
      <div className="p-8 border-b border-white/5 flex items-center gap-4">
        <History size={16} className="text-indigo-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
          Neural History
        </span>
      </div>

      {/* New Synthesis Trigger */}
      <div className="p-6">
        <button 
          onClick={() => onSelectConversation(null)}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group"
        >
          <Plus size={14} className="text-zinc-400 group-hover:text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-indigo-400">
            New Synthesis
          </span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
        {history.length === 0 && (
          <div className="py-10 text-center">
            <Terminal size={20} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-[10px] uppercase tracking-widest text-zinc-700">No active links</p>
          </div>
        )}
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectConversation(item.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all
              ${currentConversationId === item.id 
                ? 'bg-indigo-600/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.05)]' 
                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'}`}
          >
            <p className={`text-[11px] font-bold uppercase tracking-wider truncate
              ${currentConversationId === item.id ? 'text-indigo-400' : 'text-zinc-400'}`}>
              {item.title || 'SYNTHESIZING...'}
            </p>
            <p className="text-[8px] font-mono text-zinc-600 mt-1 uppercase tracking-tighter">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>

      {/* Admin Identity Footer */}
      {isOwner && (
        <div className="p-8 border-t border-white/5 bg-indigo-500/5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-indigo-400" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Master Authority</p>
              <p className="text-[9px] text-zinc-600 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
