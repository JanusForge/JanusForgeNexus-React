// src/app/admin/nexus-watch/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  Users, 
  Zap, 
  ShieldCheck, 
  Radio, 
  RefreshCw,
  SendHorizontal
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function NexusWatch() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const isAuthorized = user?.email === 'admin@janusforge.ai';

  useEffect(() => {
    if (isAuthorized) {
      fetchMetrics();
    }
  }, [user]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/nexus-metrics?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error("Failed to load metrics", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTokens = async (targetUserId: string, currentAmount: number) => {
    const amount = prompt(`Set new token balance for this user:`, currentAmount.toString());
    if (amount === null) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/update-tokens?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, amount })
      });
      if (res.ok) fetchMetrics();
    } catch (err) {
      alert("Token override failed.");
    }
  };

  const handleToggleStatus = async (targetUserId: string, status: string) => {
    const action = status === 'BANNED' ? "Remote Kill (BAN)" : "Reactivate";
    if (!confirm(`Execute ${action} protocol for this entity?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/toggle-status?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, status })
      });
      if (res.ok) fetchMetrics();
    } catch (err) {
      alert("Status override failed.");
    }
  };

  const handleGlobalBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/broadcast?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: broadcastMessage })
      });
      if (res.ok) {
        alert("Broadcast sent via Nexus Link.");
        setBroadcastMessage('');
      }
    } catch (err) {
      alert("Broadcast failed.");
    }
  };

  if (!isAuthorized) return <div className="p-24 text-red-500 font-black tracking-widest text-center">ACCESS DENIED: PROTOCOL 0 VIOLATION</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-zinc-800 pb-8 gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">Nexus <span className="text-amber-500">Watch</span></h1>
            <p className="text-zinc-500 uppercase text-xs tracking-widest mt-2 font-bold flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-500" /> Protocol 0: Global Oversight
            </p>
          </div>
          <button 
            onClick={fetchMetrics} 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-xs font-bold hover:bg-zinc-800 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> REFRESH METRICS
          </button>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Users className="text-blue-500"/>} label="Total Souls" value={metrics?.totalUsers} />
          <StatCard icon={<Zap className="text-amber-500"/>} label="24h Syntheses" value={metrics?.activeDebates} />
          <StatCard icon={<ShieldAlert className="text-red-500"/>} label="Consumption" value={metrics?.userTokens?.reduce((a:any, b:any) => a + b.tokens_used, 0)} />
        </div>

        {/* GLOBAL BROADCAST CONTROL */}
        <div className="bg-zinc-900/40 border border-indigo-500/30 p-6 rounded-3xl mb-12">
          <div className="flex items-center gap-3 mb-4 text-indigo-400">
            <Radio size={20} className="animate-pulse" />
            <span className="font-black uppercase text-xs tracking-widest">Global Broadcast (Nexus Alert)</span>
          </div>
          <div className="flex gap-4">
            <input 
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Deploy system-wide message to all active rooms..."
              className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none"
            />
            <button 
              onClick={handleGlobalBroadcast}
              className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 flex items-center gap-2 font-bold text-xs uppercase"
            >
              <SendHorizontal size={16} /> Deploy
            </button>
          </div>
        </div>

        {/* USER ACTIVITY TABLE */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <BarChart3 size={20} className="text-zinc-500" />
            <span className="font-bold uppercase text-sm tracking-widest">User Neural Activity</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-zinc-600 bg-black/50">
                <tr>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Consumption</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Command</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {metrics?.userTokens.map((u: any, i: number) => (
                  <tr key={u.id || u.email} className="border-t border-zinc-800/50 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{u.username}</div>
                      <div className="text-[10px] text-zinc-500">{u.email}</div>
                    </td>
                    <td className="p-4 font-mono text-blue-400">{u.tokens_remaining}</td>
                    <td className="p-4 font-mono text-amber-500">{u.tokens_used}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${u.role === 'BANNED' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {u.role === 'BANNED' ? 'HALTED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleUpdateTokens(u.id, u.tokens_remaining)}
                          className="text-zinc-500 hover:text-blue-500 transition-colors"
                          title="Override Tokens"
                        >
                          <Zap size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(u.id, u.role === 'BANNED' ? 'USER' : 'BANNED')}
                          className={`transition-colors ${u.role === 'BANNED' ? 'text-green-500 hover:text-green-400' : 'text-zinc-500 hover:text-red-500'}`}
                          title={u.role === 'BANNED' ? "Restore Access" : "Execute Remote Kill"}
                        >
                          <ShieldAlert size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">{label}</span>
      </div>
      <div className="text-4xl font-black font-mono">{value !== undefined ? value : '...'}</div>
    </div>
  );
}
