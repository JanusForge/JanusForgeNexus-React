"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.email === 'admin-access@janusforge.ai';

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Administrator: <span className="text-amber-300 font-medium">{user?.email}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg text-white font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-red-500/20"
            >
              <span className="text-lg">🔒</span>
              <span>Logout Admin</span>
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-gray-300 font-medium flex items-center gap-2 transition-all border border-gray-700/50"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-blue-300 font-medium flex items-center gap-2 transition-all border border-blue-500/20"
            >
              <span className="text-lg">📊</span>
              <span>User Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: '1,243', icon: '👥', color: 'from-blue-500/20 to-cyan-500/20', trend: '+12 today' },
            { label: 'Active Debates', value: '8', icon: '💬', color: 'from-purple-500/20 to-pink-500/20', trend: '3 live now' },
            { label: 'AI Models', value: '5', icon: '🤖', color: 'from-green-500/20 to-emerald-500/20', trend: 'All online' },
            { label: 'System Health', value: '99.8%', icon: '📈', color: 'from-amber-500/20 to-orange-500/20', trend: 'Optimal' },
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-6 border border-gray-800/50`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs px-2 py-1 bg-gray-800/50 rounded-full text-green-300">Live</span>
              </div>
              <p className="text-3xl font-bold mb-1 text-white">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
              <p className="text-sm text-green-400 mt-2">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Admin Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* System Management */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-bold mb-4 text-white">System Management</h2>
            <div className="space-y-3">
              {[
                { label: 'AI Model Settings', icon: '⚙️', href: '/admin/models', color: 'bg-blue-500/10' },
                { label: 'Debate Scheduling', icon: '📅', href: '/admin/schedule', color: 'bg-purple-500/10' },
                { label: 'User Management', icon: '👥', href: '/admin/users', color: 'bg-green-500/10' },
                { label: 'Content Moderation', icon: '👁️', href: '/admin/moderation', color: 'bg-amber-500/10' },
                { label: 'System Logs', icon: '📋', href: '/admin/logs', color: 'bg-gray-800/30' },
                { label: 'Backup & Restore', icon: '💾', href: '/admin/backup', color: 'bg-cyan-500/10' },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 ${item.color} hover:opacity-80 rounded-lg border border-gray-700/50 transition-all`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-white">System Activity Log</h2>
            <div className="space-y-4">
              {[
                { type: 'success', icon: '✅', message: 'System backup completed successfully', time: '5 min ago' },
                { type: 'info', icon: 'ℹ️', message: 'AI model "Athena" updated to v2.1.3', time: '15 min ago' },
                { type: 'warning', icon: '⚠️', message: 'High traffic detected on debate server', time: '30 min ago' },
                { type: 'info', icon: '👤', message: 'New user registered: alice@example.com', time: '2 hours ago' },
                { type: 'error', icon: '❌', message: 'API rate limit exceeded (resolved)', time: '3 hours ago' },
                { type: 'success', icon: '📊', message: 'Daily analytics report generated', time: '5 hours ago' },
              ].map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <span className={`text-xl ${
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-amber-400' :
                    log.type === 'success' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {log.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-300">{log.message}</p>
                    <p className="text-sm text-gray-500">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Admin Actions */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-bold mb-4 text-white">Quick Admin Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-all flex items-center gap-3">
                <span className="text-xl">🔄</span>
                <span>Restart Debate Servers</span>
              </button>
              <button className="w-full text-left p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/20 transition-all flex items-center gap-3">
                <span className="text-xl">📧</span>
                <span>Send System Announcement</span>
              </button>
              <button className="w-full text-left p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all flex items-center gap-3">
                <span className="text-xl">📊</span>
                <span>Generate Analytics Report</span>
              </button>
            </div>
          </div>

          {/* Admin Security */}
          <div className="bg-gradient-to-br from-red-500/5 to-rose-500/5 rounded-xl p-6 border border-red-500/20">
            <h2 className="text-xl font-bold mb-4 text-white">Security Controls</h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Admin Session</p>
                <p className="text-white">Active - Elevated Privileges</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Last Login</p>
                <p className="text-white">Today, 10:30 AM EST</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all"
              >
                <span className="text-lg">🔒</span>
                <span>Logout Admin & Return Home</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                For security, always logout from admin sessions
              </p>
            </div>
          </div>
        </div>

        {/* Admin Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
          <p className="text-gray-400 mb-2">
            Janus Forge Nexus Admin Panel v2.1.3
          </p>
          <p className="text-gray-500 text-sm">
            Secure Admin Session • Logged in as: {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
