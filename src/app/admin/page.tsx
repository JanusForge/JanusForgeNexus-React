"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (!loading && user && !user.is_admin) {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.is_admin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400">Welcome, Administrator ({user.email})</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-400">248</p>
            <p className="text-gray-400 text-sm mt-2">Registered users</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-purple-400">56</p>
            <p className="text-gray-400 text-sm mt-2">In development</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Storage Used</h3>
            <p className="text-3xl font-bold text-green-400">2.4TB</p>
            <p className="text-gray-400 text-sm mt-2">Total storage</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">API Requests</h3>
            <p className="text-3xl font-bold text-yellow-400">45K</p>
            <p className="text-gray-400 text-sm mt-2">Last 24 hours</p>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Admin Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors text-left">
              <h4 className="text-white font-medium">User Management</h4>
              <p className="text-gray-400 text-sm mt-1">Manage user accounts and permissions</p>
            </button>
            <button className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors text-left">
              <h4 className="text-white font-medium">System Settings</h4>
              <p className="text-gray-400 text-sm mt-1">Configure system parameters</p>
            </button>
            <button className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-green-500 transition-colors text-left">
              <h4 className="text-white font-medium">API Keys</h4>
              <p className="text-gray-400 text-sm mt-1">Generate and manage API keys</p>
            </button>
            <button className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-red-500 transition-colors text-left">
              <h4 className="text-white font-medium">Audit Logs</h4>
              <p className="text-gray-400 text-sm mt-1">View system activity logs</p>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
