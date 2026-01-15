"use client";
import { Users, ShieldCheck, Mail, Database } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UsersDirectory() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-6xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Architect Directory</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Active Neural Nodes in the Nexus</p>
        </div>
        <div className="px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-2xl flex items-center gap-4">
          <Database size={16} className="text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase">Syncing with Neon DB...</span>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Architect</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tier</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fuel Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><ShieldCheck size={18} /></div>
                  <div>
                    <p className="text-white font-black text-xs uppercase">{user?.username}</p>
                    <p className="text-zinc-500 text-[10px]">{user?.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[8px] font-black uppercase tracking-tighter">Active Now</span>
              </td>
              <td className="px-8 py-6 text-xs font-bold text-indigo-400 uppercase italic">{user?.tier}</td>
              <td className="px-8 py-6 text-xs font-mono text-zinc-300 tracking-widest">∞</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
