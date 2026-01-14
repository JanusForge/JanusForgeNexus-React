"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { History, ShieldCheck, MessageSquare, Plus, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  onSelectConversation: (id: string) => void;
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
  
  // OWNER IDENTIFICATION: admin@janusforge.ai [cite: 2025-11-27]
  const isOwner = user?.email === 'admin@janusforge.ai';

  useEffect(() => {
    const fetchHistory = async () => {
      const endpoint = isOwner ? '/api/admin/all-conversations' : '/api/conversations';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
      if (res.ok) setHistory(await res.json());
    };
    if (user) fetchHistory();
  }, [user, isOwner]);

  return (
    <aside className={`
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 fixed lg:relative z-50 w-80 h-screen 
      bg-black/40 backdrop-blur-xl border-r border-white/5 
      flex flex-col transition-transform duration-300
    `}>
      {/* SIDEBAR HEADER */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={16} className="text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            {isOwner ? 'Master Archive' : 'Neural History'}
          </span>
        </div>
        <button onClick={onToggle} className="lg:hidden text-zinc-500">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* NEW CONVERSATION BUTTON */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all group">
          <Plus size={14} className="text-zinc-500 group-hover:text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">New Synthesis</span>
        </button>
      </div>

      {/* HISTORY LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectConversation(item.id)}
            className={`
              w-full text-left p-4 rounded-xl border transition-all relative group
              ${currentConversationId === item.id 
                ? 'bg-indigo-600/10 border-indigo-500/50' 
                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}
            `}
          >
            <div className="flex items-center gap-3 mb-1">
              <MessageSquare size={12} className={currentConversationId === item.id ? 'text-indigo-400' : 'text-zinc-600'} />
              <span className="text-[10px] font-mono text-zinc-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs font-bold text-zinc-300 truncate group-hover:text-white">
              {item.title || 'Untitled Synthesis'}
            </p>
          </button>
        ))}
      </div>

      {/* OWNER STATUS FOOTER */}
      {isOwner && (
        <div className="p-6 border-t border-white/5 bg-indigo-500/5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-indigo-400" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Owner Access</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
