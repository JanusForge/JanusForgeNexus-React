"use client";
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';
import Link from 'next/link';
import { Zap, User, Mail, Shield, Coins, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  // ✅ REPAIR: Removed isAuthenticated from destructuring, added loading
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // ✅ REPAIR: Derive authentication status locally
  const isAuthenticated = !!user;

  // 🔄 REPAIR: Prevent "Please log in" flicker while session is restoring
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Access Restricted</p>
        <Link 
          href="/login" 
          className="px-6 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl"
        >
          Initialize Identity
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase italic tracking-tighter">
            Your Forge Profile
          </h1>
          <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] font-bold">Architect Status & Nexus Energy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Info Card */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl shadow-purple-500/20 group-hover:scale-105 transition-transform">
                {user.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">{user.username}</h2>
                <p className="text-zinc-500 text-xs font-mono">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                <User size={16} className="text-zinc-500" />
                <span className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Architect</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                <Mail size={16} className="text-zinc-500" />
                <span className="text-zinc-300 text-xs font-bold uppercase tracking-wider">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl">
                <Shield size={16} className="text-zinc-500" />
                <span className="text-zinc-300 text-xs font-bold uppercase tracking-wider">
                  {user.tier === 'ENTERPRISE' ? 'Master Authority' : 'Active Nexus Member'}
                </span>
              </div>
            </div>
          </div>

          {/* Token Balance Card */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/20 transition-colors">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Nexus Energy Reserve</h3>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="p-4 bg-purple-500/10 rounded-3xl">
                <Coins size={40} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-5xl font-black text-white tracking-tighter">
                  {user.tokens_remaining?.toLocaleString() || 0}
                </p>
                <p className="text-purple-500 italic font-bold text-[10px] uppercase tracking-widest mt-1">Available Fuel</p>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
              <p className="text-zinc-500 text-[10px] leading-relaxed font-bold uppercase tracking-tight">
                Nexus Queries consume 1 token per synthesis cycle. 
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-3 px-10 py-5 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-purple-500/20"
          >
            <Zap size={16} fill="white" />
            Add More Fuel
          </Link>
        </div>
      </div>
    </div>
  );
}
