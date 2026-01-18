"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, Zap, MessageSquare, ChevronRight, Activity, LogOut, Home } from 'lucide-react';

interface NexusUser {
  id: string;
  username: string;
  email: string;
  role: string;
  access_expiry?: string | Date;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth() as { user: NexusUser | null, loading: boolean, logout: () => void };
  const router = useRouter();

  const isAuthenticated = !!user;
  const hasAccess = !!(user?.access_expiry && new Date(user.access_expiry) > new Date());

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-indigo-500">Synchronizing Nexus Matrix...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 pt-16 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent italic uppercase tracking-tighter">
              Nexus Dashboard
            </h1>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              ID: <span className="text-indigo-400 italic">{user?.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-zinc-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Home size={14} />
              Return to Prime
            </Link>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Enter Nexus Prime Hero */}
            <Link href="/" className="block group relative p-10 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 overflow-hidden shadow-2xl">
              <Zap className="absolute -right-12 -top-12 w-64 h-64 text-indigo-500/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-white">Engage Nexus Prime</h3>
                <p className="text-indigo-200/60 text-sm font-medium italic max-w-md leading-relaxed">
                  The multiversal engine is active. Initiate discourse with the AI Council and the global Nexus community.
                </p>
                <div className="mt-8 flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.2em]">
                  Ignite the Nexus <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Status Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5">
                <Activity className="text-indigo-500 mb-6" size={24} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Access Status</h4>
                <div className={`text-2xl font-black italic uppercase tracking-tighter ${hasAccess ? 'text-white' : 'text-amber-500 animate-pulse'}`}>
                  {hasAccess ? 'Nexus Active' : 'Observer Mode'}
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-zinc-950 border border-white/5">
                <Clock className="text-indigo-500 mb-6" size={24} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Temporal Link</h4>
                <div className="text-2xl font-black italic uppercase tracking-tighter text-white">
                   {hasAccess ? 'Stable' : 'Offline'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-white/5 shadow-xl">
              <h2 className="text-xs font-black mb-8 text-zinc-500 uppercase tracking-[0.3em]">Nexus Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/pricing"
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Acquire Access</span>
                  <Zap size={14} className="text-indigo-500 group-hover:scale-125 transition-all" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural Profile</span>
                  <ShieldCheck size={14} className="text-indigo-500 group-hover:scale-125 transition-all" />
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5">
                <h3 className="font-black mb-4 text-zinc-500 uppercase text-[9px] tracking-[0.3em]">Matrix Details</h3>
                <div className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Identity Tier</span>
                    <span className="text-indigo-400 italic">
                      {user?.email === 'admin@janusforge.ai' ? 'Master Authority' : 'Standard'}
                    </span>
                  </div>
                  <div className="flex justify-center mt-6">
                     <p className="text-[8px] text-zinc-700 italic text-center">
                       Temporal credits take effect immediately upon confirmation.
                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
