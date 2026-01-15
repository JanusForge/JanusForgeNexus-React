"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NeuralLinkMonitor } from '@/components/admin/NeuralLinkMonitor';
import { UptimeChart } from '@/components/admin/UptimeChart';
import { ShieldAlert, Activity, Users, Flame } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [healthLogs, setHealthLogs] = useState([]);

  // Deriving status from the current Auth State
  const isAuthenticated = !!user;
  const isOwner = user?.email === 'admin@janusforge.ai';
  const isGodMode = user?.role === 'GOD_MODE' || user?.tier === 'ENTERPRISE';

  // 🛡️ Authority Gate
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || (!isOwner && !isGodMode)) {
        router.push('/');
      } else {
        // Fetch historical health data once authorized
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/health-history?userId=${user?.id}`)
          .then(res => res.json())
          .then(data => setHealthLogs(data))
          .catch(err => console.error("History fetch failed", err));
      }
    }
  }, [loading, isAuthenticated, isOwner, isGodMode, router, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-500">Synchronizing Authority...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (!isOwner && !isGodMode)) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              <ShieldAlert className="text-blue-500" /> Nexus Control
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                System Status: Optimal | Mode: {isOwner ? "Master Authority" : "God Mode"}
              </p>
            </div>
          </div>
          <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-white/5 font-mono text-xs text-blue-400">
             Session ID: {user?.id?.split('-')[0]}...
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">User Registry</p>
              <p className="text-3xl font-black">2,841</p>
            </div>
            <Users className="text-zinc-800" size={32} />
          </div>
          <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Daily Burn</p>
              <p className="text-3xl font-black">14.2k</p>
            </div>
            <Flame className="text-zinc-800" size={32} />
          </div>
          <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Mean Uptime</p>
              <p className="text-3xl font-black text-green-500">99.9%</p>
            </div>
            <Activity className="text-zinc-800" size={32} />
          </div>
        </div>

        {/* --- LIVE DIAGNOSTICS & TRENDS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NeuralLinkMonitor />
          <UptimeChart data={healthLogs} />
        </div>

      </div>
    </div>
  );
}
