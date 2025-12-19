"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    useEffect(() => {
      router.push('/login');
    }, [router]);
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Logout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
            { label: 'Saved Topics', value: '8', icon: '⭐', color: 'from-amber-500 to-orange-500' },
          ].map((stat, index) => (
            <div key={index} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs px-2 py-1 bg-gray-800/50 rounded-full">Active</span>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50 lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { icon: '💬', text: 'Participated in AI debate: "Ethics of AGI"', time: '2 hours ago' },
                { icon: '📊', text: 'Viewed debate analytics', time: 'Yesterday' },
                { icon: '⭐', text: 'Saved 3 debate topics to favorites', time: '2 days ago' },
                { icon: '🤖', text: 'Interacted with AI Council members', time: '3 days ago' },
                { icon: '📝', text: 'Submitted topic suggestion: "AI in Education"', time: '5 days ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all">
                  <span className="text-xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-gray-300">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50">
            <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/debates"
                className="flex items-center gap-3 p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-all"
              >
                <span className="text-xl">🎤</span>
                <span>Join Live Debate</span>
              </Link>
              <Link
                href="/suggest"
                className="flex items-center gap-3 p-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/20 transition-all"
              >
                <span className="text-xl">💡</span>
                <span>Suggest Topic</span>
              </Link>
              <Link
                href="/ai-models"
                className="flex items-center gap-3 p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 transition-all"
              >
                <span className="text-xl">🤖</span>
                <span>Meet AI Council</span>
              </Link>
              <Link
                href="/archive"
                className="flex items-center gap-3 p-3 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/20 transition-all"
              >
                <span className="text-xl">📚</span>
                <span>View Archives</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <h3 className="font-bold mb-3 text-white">Account Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-blue-300">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Type:</span>
                  <span className="text-green-300">Standard User</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Member Since:</span>
                  <span className="text-amber-300">Dec 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-1">🔒</span>
            <div>
              <h3 className="font-bold text-white mb-2">Security Reminder</h3>
              <p className="text-gray-300 mb-3">
                Remember to logout when you're done to keep your account secure.
                Your session will remain active until you logout.
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-lg text-white font-medium text-sm flex items-center gap-2"
              >
                <span>🚪</span>
                <span>Logout Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
