"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  // ✅ REPAIR: Destructure 'loading' instead of 'isLoading'
  // ✅ REPAIR: Removed 'isAuthenticated' (now derived from 'user')
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  // Derive auth status locally for cleaner logic
  const isAuthenticated = !!user;

  // Security Redirect logic
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // 🔄 Synchronizing State UI
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-500">Synchronizing Dashboard...</p>
        </div>
      </div>
    );
  }

  // Prevent flicker before redirect
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 pt-16 animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic tracking-tighter">
              User Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, <span className="text-blue-300 font-medium">{user?.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-lg text-white font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-rose-500/20"
            >
              <span className="text-lg">🚪</span>
              <span>Logout & Return Home</span>
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-gray-300 font-medium flex items-center gap-2 transition-all border border-gray-700/50"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Debates Joined', value: '12', icon: '💬', color: 'from-blue-500 to-cyan-500' },
            { label: 'Topics Suggested', value: '5', icon: '💡', color: 'from-purple-500 to-pink-500' },
            { label: 'AI Interactions', value: '47', icon: '🤖', color: 'from-green-500 to-emerald-500' },
            { label: 'Tokens Remaining', value: user?.tokens_remaining?.toLocaleString() || '0', icon: '🪙', color: 'from-amber-500 to-orange-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-gray-800/50 rounded-full text-blue-400">Status: Active</span>
              </div>
              <p className="text-3xl font-bold mb-1 text-white">{stat.value}</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 lg:col-span-2 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-tighter">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { icon: '💬', text: 'Participated in AI debate: "Ethics of AGI"', time: '2 hours ago' },
                { icon: '📊', text: 'Viewed debate analytics', time: 'Yesterday' },
                { icon: '⭐', text: 'Saved 3 debate topics to favorites', time: '2 days ago' },
                { icon: '🤖', text: 'Interacted with AI Council members', time: '3 days ago' },
                { icon: '📝', text: 'Submitted topic suggestion: "AI in Education"', time: '5 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/20 rounded-lg hover:bg-gray-800/40 transition-all border border-transparent hover:border-gray-700">
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm">{activity.text}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-tighter">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/nexus"
                className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🌌</span>
                <span className="font-bold">Enter Nexus Prime</span>
              </Link>
              <Link
                href="/daily-forge"
                className="flex items-center gap-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 transition-all group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🎤</span>
                <span>Daily Forge Debate</span>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <h3 className="font-bold mb-3 text-white uppercase text-xs tracking-[0.2em]">Account Matrix</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Identity</span>
                  <span className="text-blue-300">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Tier</span>
                  <span className="text-green-300 font-bold">{user?.email === 'admin@janusforge.ai' ? 'MASTER AUTHORITY' : 'STANDARD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase">Credits</span>
                  <span className="text-amber-300 font-mono">{user?.tokens_remaining ?? 0} 🪙</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
