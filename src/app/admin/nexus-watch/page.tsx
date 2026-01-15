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
  SendHorizontal,
  MessageSquare,
  Mail
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function NexusWatch() {
  const { user } = useAuth(); //
  const [metrics, setMetrics] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // 🛡️ Master Authority Protocol [cite: 2025-11-27]
  const isAuthorized = user?.email === 'admin@janusforge.ai';

  useEffect(() => {
    if (isAuthorized) {
      fetchMetrics();
      fetchTickets();
    }
  }, [user, isAuthorized]);

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

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/tickets?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error("Failed to load support transmissions");
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

  if (!isAuthorized) return <div className="p-24 text-red-500 font-black tracking-widest text-center uppercase">ACCESS DENIED: PROTOCOL 0 VIOLATION</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24 font-sans animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-zinc-800 pb-8 gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">Nexus <span className="text-amber-500">Watch</span></h1>
            <p className="text-zinc-500 uppercase text-[10px] tracking-[0.3em] mt-2 font-bold flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-500" /> Protocol 0: Global Oversight [cite: 2025-11-27]
            </p>
          </div>
          <button
            onClick={() => { fetchMetrics(); fetchTickets(); }}
            className="flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-zinc-700 rounded-full text-[10px] font-black tracking-widest hover:bg-zinc-800 transition-all uppercase"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Command Center
          </button>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<Users className="text-blue-500"/>} label="Total Souls" value={metrics?.totalUsers} />
          <StatCard icon={<Zap className="text-amber-500"/>} label="24h Syntheses" value={metrics?.activeDebates} />
          <StatCard icon={<ShieldAlert className="text-red-500"/>} label="Total Consumption" value={metrics?.userTokens?.reduce((a:any, b:any) => a + (b.tokens_used || 0), 0)} />
        </div>

        {/* SUPPORT TICKET MODULE - Connects to Table #11 */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
             <MessageSquare className="text-blue-500" size={20} />
             <span className="font-black uppercase text-xs tracking-[0.3em]">Neural Transmissions</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {tickets.length === 0 ? (
              <div className="p-12 border border-zinc-800 rounded-3xl text-center text-zinc-600 uppercase text-[10px] font-black italic">
                No active neural anomalies reported.
              </div>
            ) : (
              tickets.map((t: any) => (
                <div key={t.id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl flex justify-between items-center group hover:border-blue-500/50 transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${t.status === 'OPEN' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                        {t.status}
                      </span>
                      <span className="text-xs font-black uppercase tracking-tight">{t.subject}</span>
                    </div>
                    <p className="text-zinc-400 text-[10px] line-clamp-1 mt-1 font-medium">{t.message}</p>
                    <p className="text-zinc-600 text-[8px] mt-2 font-mono uppercase tracking-[0.2em]">Origin: {t.user?.username || 'Unknown Node'}</p>
                  </div>
                  <button className="p-4 bg-black rounded-2xl border border-zinc-800 text-zinc-500 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-all shadow-xl">
                    <Mail size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* GLOBAL BROADCAST CONTROL */}
        <div className="bg-zinc-900/40 border border-indigo-500/30 p-8 rounded-[2.5rem] mb-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 text-indigo-400">
            <Radio size={20} className="animate-pulse" />
            <span className="font-black uppercase text-xs tracking-[0.3em]">Global Broadcast (Nexus Alert)</span>
          </div>
          <div className="flex gap-4">
            <input
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Deploy system-wide message to all active rooms..."
              className="flex-1 bg-black/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none transition-all"
            />
            <button
              onClick={handleGlobalBroadcast}
              className="px-8 py-4 bg-indigo-600 rounded-2xl hover:bg-indigo-500 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
            >
              <SendHorizontal size={18} /> Deploy
            </button>
          </div>
        </div>

        {/* USER ACTIVITY TABLE */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-zinc-800 flex items-center gap-3 bg-white/[0.02]">
            <BarChart3 size={20} className="text-zinc-500" />
            <span className="font-black uppercase text-xs tracking-[0.3em]">User Neural Activity</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-zinc-600 bg-black/50 font-black tracking-widest">
                <tr>
                  <th className="p-6">Entity</th>
                  <th className="p-6">Fuel Balance</th>
                  <th className="p-6">Consumption</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Command</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {metrics?.userTokens.map((u: any) => (
                  <tr key={u.id || u.email} className="border-t border-zinc-800/50 hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="font-black uppercase text-xs tracking-tight">{u.username}</div>
                      <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{u.email}</div>
                    </td>
                    <td className="p-6 font-mono text-blue-400 font-bold italic">{u.tokens_remaining?.toLocaleString()}</td>
                    <td className="p-6 font-mono text-amber-500 font-bold italic">{u.tokens_used?.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`text-[8px] px-3 py-1 rounded-full font-black tracking-widest ${u.role === 'BANNED' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {u.role === 'BANNED' ? 'HALTED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleUpdateTokens(u.id, u.tokens_remaining)}
                          className="text-zinc-600 hover:text-blue-500 transition-all hover:scale-110"
                          title="Override Tokens"
                        >
                          <Zap size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id, u.role === 'BANNED' ? 'USER' : 'BANNED')}
                          className={`transition-all hover:scale-110 ${u.role === 'BANNED' ? 'text-green-500 hover:text-green-400' : 'text-zinc-600 hover:text-red-600'}`}
                          title={u.role === 'BANNED' ? "Restore Access" : "Execute Remote Kill"}
                        >
                          <ShieldAlert size={18} />
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
    <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-[2.5rem] shadow-xl hover:border-zinc-700 transition-all group">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-black rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em]">{label}</span>
      </div>
      <div className="text-4xl font-black font-mono italic tracking-tighter">
        {value !== undefined ? value.toLocaleString() : '---'}
      </div>
    </div>
  );
}
