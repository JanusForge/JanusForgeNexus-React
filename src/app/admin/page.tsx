"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Deriving status from the current Auth State
  const isAuthenticated = !!user;
  const isOwner = user?.email === 'admin@janusforge.ai';
  const isGodMode = user?.role === 'GOD_MODE' || user?.tier === 'ENTERPRISE';

  // 🛡️ Authority Gate: Redirect if not authenticated or not authorized
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || (!isOwner && !isGodMode)) {
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, isOwner, isGodMode, router]);

  // 🔄 Synchronizing State
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

  // 🚫 Final Safety catch before rendering restricted UI
  if (!isAuthenticated || (!isOwner && !isGodMode)) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 animate-in fade-in duration-1000">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Janus Forge Admin Panel</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              Welcome, Architect. {isOwner ? "Owner" : "God"} Mode active.
            </p>
          </div>
        </header>
        
        {/* --- ADMIN DASHBOARD TOOLS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
            <h3 className="text-zinc-400 text-xs font-bold uppercase mb-4">User Registry</h3>
            <p className="text-2xl font-mono">2,841</p>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
            <h3 className="text-zinc-400 text-xs font-bold uppercase mb-4">Daily Token Burn</h3>
            <p className="text-2xl font-mono">14.2k</p>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
            <h3 className="text-zinc-400 text-xs font-bold uppercase mb-4">System Uptime</h3>
            <p className="text-2xl font-mono text-green-500">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
