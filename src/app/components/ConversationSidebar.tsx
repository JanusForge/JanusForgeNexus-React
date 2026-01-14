"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { History, ShieldCheck, ChevronLeft, Plus } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface SidebarProps {
  onSelectConversation: (id: string | null) => void;
  currentConversationId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ConversationSidebar({ 
  onSelectConversation, 
  currentConversationId, 
  isOpen, 
  onToggle 
}: SidebarProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const isOwner = user?.email === 'admin@janusforge.ai'; 

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    const endpoint = isOwner ? '/api/admin/all-conversations' : `/api/conversations?userId=${user.id}`;
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (res.ok) setHistory(await res.json());
  }, [user, isOwner]);

  useEffect(() => {
    fetchHistory();

    const socket = io(API_BASE_URL);
    socket.on('sidebar:update', () => {
      fetchHistory();
    });

    return () => { socket.disconnect(); };
  }, [fetchHistory]);

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 fixed lg:relative z-50 w-96 h-screen 
      bg-[#050505]/80 backdrop-blur-3xl border-r border-white/10 
      flex flex-col transition-transform duration-300
    `}>
      <div className="p-10 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <History size={18} className="text-indigo-500" />
          <span className="text-xs md:text-sm font-black uppercase tracking-[0.6em] text-zinc-400">
            {isOwner ? 'Master Archive' : 'Neural History'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <button 
          onClick={() => onSelectConversation(null)}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 hover:border-indigo-500/60 transition-all group"
        >
          <Plus size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">
            New Synthesis
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectConversation(item.id)}
            className={`w-full text-left p-6 rounded-2xl border transition-all relative group
              ${currentConversationId === item.id 
                ? 'bg-indigo-600/10 border-indigo-500/50' 
                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
          >
            <p className="text-sm font-bold text-zinc-300 truncate group-hover:text-white uppercase tracking-wider">
              {item.title || 'Initializing Title...'}
            </p>
          </button>
        ))}
      </div>

      {isOwner && (
        <div className="p-10 border-t border-white/5 bg-indigo-500/5">
          <div className="flex items-center gap-4">
            <ShieldCheck size={20} className="text-indigo-400" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Master Access</p>
              <p className="text-xs text-zinc-600 truncate mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
