"use client";
import { useEffect, useState } from 'react';
import { History, Clock } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function NodeArchiveSidebar({ institution, userType, onSelectThread }: any) {
  const { user } = useAuth() as any;
  const [archives, setArchives] = useState<any[]>([]);

  useEffect(() => {
    const fetchArchives = async () => {
      if (!user) return;
      const res = await fetch(`${API_BASE_URL}/api/nodes/history?institution=${institution}&userType=${userType}&userId=${user.id}`);
      if (res.ok) setArchives(await res.json());
    };
    fetchArchives();
  }, [institution, userType, user]);

  return (
    <div className="w-64 bg-zinc-950/40 border-r border-white/5 h-full overflow-y-auto p-4 hidden lg:block">
      <div className="flex items-center gap-2 mb-6 px-2 text-zinc-500 font-black uppercase tracking-widest text-[9px]">
        <History size={12} /> Mission Archives
      </div>
      <div className="space-y-1">
        {archives.map((thread) => (
          <button key={thread.id} onClick={() => onSelectThread(thread)} className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={10} className="text-zinc-600" />
              <span className="text-[8px] font-bold text-zinc-600 uppercase">{new Date(thread.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-[10px] font-black text-zinc-400 group-hover:text-white truncate uppercase tracking-tighter">
              {thread.title.replace(/\[.*?\]\s?/, '')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
