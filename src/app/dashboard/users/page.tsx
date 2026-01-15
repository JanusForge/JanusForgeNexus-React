"use client";
import { Users, ShieldCheck, Activity, Database } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UsersDirectory() {
  const { user } = useAuth(); //

  return (
    <div className="p-8 max-w-6xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Architect Directory</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 text-blue-400/80">Active Neural Nodes in the Nexus</p>
        </div>
        <div className="px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
          <Database size={16} className="text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Neon Primary Sync</span>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Architect Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Connection Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nexus Tier</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Fuel Reserve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500/20 transition-all">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-white font-black text-xs uppercase tracking-tight">{user?.username || 'Architect'}</p>
                    <p className="text-zinc-500 text-[10px] font-mono lowercase">{user?.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500 text-[8px] font-black uppercase tracking-widest">Active Link</span>
                </div>
              </td>
              <td className="px-8 py-6 text-xs font-bold text-indigo-400 uppercase italic">
                {user?.tier || 'Pro'}
              </td>
              <td className="px-8 py-6 text-xs font-mono text-zinc-300 tracking-widest italic font-bold">
                {user?.role === 'GOD_MODE' ? '∞ UNLIMITED' : user?.tokens_remaining}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
