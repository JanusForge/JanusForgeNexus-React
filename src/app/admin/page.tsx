"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { NeuralLinkMonitor } from '@/components/admin/NeuralLinkMonitor';
import { UptimeChart } from '@/components/admin/UptimeChart';
import { BroadcastCommand } from '@/components/admin/BroadcastCommand';
import { MaintenanceToggle } from '@/components/admin/MaintenanceToggle'; // Added this

// Icons
import {
  ShieldAlert,
  Activity,
  Users,
  Flame,
  Loader2,
  Database,
  Globe,
  Settings
} from 'lucide-react';

const MASTER_ID = '550e8400-e29b-41d4-a716-446655440000';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://janusforgenexus-backend.onrender.com';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [healthLogs, setHealthLogs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [stats, setStats] = useState({
    users: "2,841",
    tokens: "14.2k",
    uptime: "99.9%"
  });

  // 🛡️ Authority Gate Logic
  const isAuthenticated = !!user;
  const isOwner = user?.email === 'admin@janusforge.ai';
  const isGodMode = user?.role === 'GOD_MODE' || user?.tier === 'ENTERPRISE';

  useEffect(() => {
    const initializeAdmin = async () => {
      if (loading) return;

      // Access Control
      if (!isAuthenticated || (!isOwner && !isGodMode)) {
        router.push('/');
        return;
      }

      try {
        const [healthRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/admin/health-history`, {
            headers: { 'x-user-id': MASTER_ID }
          })
        ]);

        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setHealthLogs(healthData);
        }
      } catch (err) {
        console.error("Nexus Admin Sync Failure:", err);
      } finally {
        setIsSyncing(false);
      }
    };

    initializeAdmin();
  }, [loading, isAuthenticated, isOwner, isGodMode, router]);

  if (loading || isSyncing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <ShieldAlert className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-blue-500 animate-pulse">
            Establishing Master Link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* --- COMMAND HEADER --- */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShieldAlert className="text-blue-500" size={24} />
               </div>
               <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                 Nexus <span className="text-blue-500">Control</span>
               </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Protocol: {isOwner ? "Master Authority" : "God Mode Override"} | Status: Optimized
              </p>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="bg-zinc-900/50 px-6 py-3 rounded-2xl border border-white/5 font-mono text-[10px] text-blue-400">
                <span className="text-zinc-600 mr-2">UID:</span>
                {user?.id}
             </div>
          </div>
        </header>

        {/* --- TOP LEVEL METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/20 transition-all">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Registry</p>
              <p className="text-3xl font-black text-white">{stats.users}</p>
            </div>
            <Users className="text-zinc-800 group-hover:text-blue-500/20 transition-colors" size={40} />
          </div>

          <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-purple-500/20 transition-all">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Current Token Burn</p>
              <p className="text-3xl font-black text-white">{stats.tokens}</p>
            </div>
            <Flame className="text-zinc-800 group-hover:text-purple-500/20 transition-colors" size={40} />
          </div>

          <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-green-500/20 transition-all">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Global Uptime</p>
              <p className="text-3xl font-black text-green-500">{stats.uptime}</p>
            </div>
            <Activity className="text-zinc-800 group-hover:text-green-500/20 transition-colors" size={40} />
          </div>
        </div>

        {/* --- SYSTEM CONTROLS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-4">
                <Globe size={14} className="text-zinc-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live Broadcast Command</h3>
             </div>
             <BroadcastCommand />
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-4">
                <Settings size={14} className="text-zinc-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Integrity Switch</h3>
             </div>
             <MaintenanceToggle />
          </div>
        </div>

        {/* --- DIAGNOSTICS & ANALYTICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="flex items-center gap-2 px-4">
                <Activity size={14} className="text-zinc-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">5-AI Council Heartbeat</h3>
             </div>
             <NeuralLinkMonitor />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-4">
               <Database size={14} className="text-zinc-500" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Latency Matrix</h3>
            </div>
            <UptimeChart data={healthLogs} />
          </div>
        </div>

        <footer className="pt-10 text-center border-t border-white/5">
           <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-[0.5em]">
             Janus Forge Nexus • Master Authority Console • 2026
           </p>
        </footer>
      </div>
    </div>
  );
}
